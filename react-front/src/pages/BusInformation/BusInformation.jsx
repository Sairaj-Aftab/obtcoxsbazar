/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { busData } from "../../features/bus/busSlice";
import { noticeData } from "../../features/notice/noticeSlice";
import { getBusInfoData } from "../../features/bus/busApiSlice";
import { formatDateTime } from "../../utils/formatDateTime";
import DataTable from "react-data-table-component";
import Skeleton from "react-loading-skeleton";
import TodayDate from "../../components/TodayDate";
import {
  getParibahanRgSchedules,
  rgSchedulesData,
} from "../../features/regularBusSchedule/regularBusScheduleSlice";

const BusInformation = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { busInfo, busInfoLoader } = useSelector(busData);
  const { paribahanRgSchedules, loader } = useSelector(rgSchedulesData);
  const { paribahanNotices } = useSelector(noticeData);
  const [paribahanNotice, setParibahanNotice] = useState(null);

  const column = [
    {
      name: "#",
      selector: (data, index) => index + 1,
      width: "60px",
    },
    {
      name: "Time",
      selector: (data) => formatDateTime(data.time),
      sortable: true,
    },
    {
      name: "Type",
      selector: (data) => data.type,
      sortable: true,
    },
    {
      name: "Reg No",
      selector: (data) => data.busNo,
      sortable: true,
    },
    {
      name: "Guide No",
      selector: (data) => data.guidePhone,
      cell: (data) => {
        return (
          <a
            href={`tel:+88${data.guidePhone}`}
            className="underline text-primary-color"
          >
            {data.guidePhone}
          </a>
        );
      },
      width: "140px",
    },
    {
      name: "Departure Place",
      // selector: (data) => data.leavingPlace,
      cell: (data) => {
        return (
          <a
            href={`${data.leavingMapLink}`}
            className="underline text-primary-color"
          >
            {data.leavingPlace}
          </a>
        );
      },
      width: "180px",
      sortable: true,
    },
    {
      name: "Destination",
      selector: (data) => data.destinationPlace,
      sortable: true,
    },
    {
      name: "Rent",
      selector: (data) => `৳ ${data.rent ? data.rent : "--"}`,
      sortable: true,
      width: "90px",
    },
    {
      name: "Seat Status",
      selector: (data) => (data.seatStatus ? "Available" : "Booked"),
      sortable: true,
    },
  ];

  const scheduleColumn = [
    {
      name: "#",
      selector: (_row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Time",
      selector: (row) => row.time,
      sortable: true,
    },
    {
      name: "Paribahan",
      selector: (row) => row.busName,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Destination",
      selector: (row) => row.destinationPlace,
      sortable: true,
    },
  ];

  useEffect(() => {
    dispatch(getBusInfoData(params.id));
    dispatch(getParibahanRgSchedules(params.id));
    const getParibahanNotice = () => {
      return paribahanNotices?.find(
        (notice) => notice.paribahanUserId === params.id
      );
    };

    const notice = getParibahanNotice();
    setParibahanNotice(notice);
  }, [dispatch, paribahanNotices, params.id]);
  return (
    <>
      <div className="container mx-auto bg-white rounded-lg my-5">
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-primary-color rounded-t-lg text-white py-2 px-3">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 items-center">
            {busInfoLoader && (
              <div className="w-full sm:w-96">
                <Skeleton height={30} baseColor="#008B8B" />
              </div>
            )}
            {!busInfoLoader && (
              <>
                <h1 className="text-xl font-medium">
                  {busInfo?.paribahanName}
                </h1>
                <TodayDate className="text-base text-white font-normal" />
              </>
            )}
          </div>

          {busInfoLoader && (
            <div className="w-full sm:w-96">
              <Skeleton height={30} baseColor="#008B8B" />
            </div>
          )}
          {!busInfoLoader && (
            <p className="text-sm md:text-base font-medium">
              টিকেট এর জন্য যোগাযোগ করুন :{" "}
              <a
                href={`tel:+88${busInfo?.salesNumber}`}
                className="font-semibold underline"
              >
                {busInfo?.salesNumber}
              </a>
            </p>
          )}
        </div>
        {paribahanNotice && (
          <p className="text-base font-medium text-black mb-2">
            <marquee behavior="" direction="left">
              {paribahanNotice?.title}
            </marquee>
          </p>
        )}
        {busInfoLoader && (
          <div className="w-full">
            <Skeleton height={200} baseColor="#ffffff" highlightColor="#ddd" />
          </div>
        )}
        {!busInfoLoader && busInfo && (
          <DataTable
            columns={column}
            data={busInfo?.busSchedule
              ?.slice()
              .sort((a, b) => new Date(a.time) - new Date(b.time))}
            responsive
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: "#f8f9fa !important",
                },
              },
              headCells: {
                style: {
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "black",
                },
              },
              rows: {
                style: {
                  fontSize: "16px",
                  fontWeight: "500",
                },
              },
            }}
          />
        )}
      </div>
      <section className="container w-full mx-auto my-8 p-4 bg-white border border-primary-color md:rounded-lg">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg text-center sm:text-left font-semibold">
            Regular Schedule
          </h3>
        </div>
        {busInfoLoader && loader && (
          <div className="w-full">
            <Skeleton height={150} />
          </div>
        )}
        {!busInfoLoader && !loader && (
          <>
            <DataTable
              columns={scheduleColumn}
              data={paribahanRgSchedules}
              responsive
              customStyles={{
                headCells: {
                  style: {
                    fontSize: "16px",
                    fontWeight: "bold",
                  },
                },
                rows: {
                  style: {
                    fontSize: "16px",
                    fontWeight: "500",
                  },
                },
              }}
            />
          </>
        )}
      </section>
    </>
  );
};

export default BusInformation;
