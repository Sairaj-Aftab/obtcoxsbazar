/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { busData } from "../../features/bus/busSlice";
import { noticeData } from "../../features/notice/noticeSlice";
import { getBusInfoData } from "../../features/bus/busApiSlice";
import { formatDateTime } from "../../utils/formatDateTime";
import DataTable from "react-data-table-component";

const BusInformation = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { busInfo } = useSelector(busData);
  const { paribahanNotices } = useSelector(noticeData);
  const [paribahanNotice, setParibahanNotice] = useState(null);

  const column = [
    {
      name: "#",
      selector: (data, index) => index + 1,
      width: "40px",
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
      sortable: true,
    },
    {
      name: "Departure Place",
      selector: (data) => data.leavingPlace,
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

  useEffect(() => {
    dispatch(getBusInfoData(params.id));
    const getParibahanNotice = () => {
      return paribahanNotices?.find(
        (notice) => notice.paribahanUserId === params.id
      );
    };

    const notice = getParibahanNotice();
    setParibahanNotice(notice);
  }, [dispatch, paribahanNotices, params.id]);
  return (
    <div className="container mx-auto bg-white rounded-lg my-5">
      {/* Heading */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-primary-color rounded-t-lg text-white py-2 px-3">
        <h1 className="text-xl font-medium">{busInfo?.paribahanName}</h1>
        <p className="text-sm md:text-base font-medium">
          টিকেট এর জন্য যোগাযোগ করুন :{" "}
          <a
            href={`tel:+88${busInfo?.salesNumber}`}
            className="font-semibold underline"
          >
            {busInfo?.salesNumber}
          </a>
        </p>
      </div>
      {paribahanNotice && (
        <p className="text-base font-medium text-black mb-2">
          <marquee behavior="" direction="left">
            {paribahanNotice?.title}
          </marquee>
        </p>
      )}
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
        // progressPending={todayLoader}
        // progressComponent={<Loading />}
        // pagination
        // paginationServer
        // paginationTotalRows={
        //   authSchedulesCount ? authSchedulesCount : authSearchCount
        // }
        // onChangeRowsPerPage={handlePerRowsChange}
        // onChangePage={handlePageChange}
        // paginationRowsPerPageOptions={[100, 150, 200]}
      />
    </div>
  );
};

export default BusInformation;
