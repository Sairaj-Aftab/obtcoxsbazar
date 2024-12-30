/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import locationIcon from "../../assets/icon/location.png";
import arrowRighIcon from "../../assets/icon/arrow-right.png";
import { useNavigate, useParams } from "react-router-dom";
import { formatDateTime } from "../../utils/formatDateTime";
import DataTable from "react-data-table-component";
import Skeleton from "react-loading-skeleton";
import TodayDate from "../../components/TodayDate";
import { useQuery } from "@tanstack/react-query";
import { getSingleBusData } from "../../services/bus.service";
import useSchedules from "../../store/useSchedules";
import usePlaces from "../../store/usePlaces";
import useNotice from "../../store/useNotice";

const BusInformation = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { regularSchedules, regularScheduleLoader: loader } = useSchedules();
  const { destinationPlaces } = usePlaces();
  const { paribahanNotices } = useNotice();

  const [paribahanNotice, setParibahanNotice] = useState(null);
  const { data: busInfo, isLoading } = useQuery({
    queryKey: ["singleBusData", { id: params.id }],
    queryFn: () => getSingleBusData(params.id),
  });

  const handleGoReviewPage = () => {
    navigate(`/bus/comp/${params.slug}/${params.id}`);
  };

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
        const formattedPhone = data.guidePhone.startsWith("+88")
          ? data.guidePhone.slice(3)
          : data.guidePhone;
        return (
          <a
            href={`tel:+88${formattedPhone}`}
            className="w-full flex items-center gap-1 text-primary-color"
          >
            <FaPhone size={16} />
            <span>{formattedPhone}</span>
          </a>
        );
      },
      width: "160px",
    },
    {
      name: "Departure Place",
      // selector: (data) => data.leavingPlace,
      cell: (data) => {
        return (
          <a
            href={data.leavingMapLink}
            className="w-full flex items-center gap-1 text-primary-color"
          >
            {data.leavingMapLink && (
              <img src={locationIcon} alt="" className="w-6" />
            )}
            <span>{data.leavingPlace}</span>
          </a>
        );
      },
      width: "200px",
      sortable: true,
    },
    {
      name: "Destination",
      selector: (data) => data.destinationPlace,
      cell: (data) => {
        const matchingPlace = destinationPlaces?.places?.find(
          (place) => place.placeName === data.destinationPlace
        );
        return matchingPlace ? (
          <div
            onClick={() =>
              navigate(`/${matchingPlace.slug}/${matchingPlace.id}`)
            }
            className="cursor-pointer flex gap-1 items-center text-primary-color"
          >
            <img src={arrowRighIcon} alt="" className="w-5" />
            <span>{data.destinationPlace}</span>
          </div>
        ) : null;
      },
      sortable: true,
      width: "160px",
    },
    {
      name: "Fare",
      cell: (data) => (
        <p className="w-full flex flex-col text-center">
          <span>{`৳ ${
            data.discountRent ? data.discountRent : data.rent
          }`}</span>
          {data.discountRent > 0 && data.discountRent !== data.rent && (
            <div className="text-red -mt-2">
              ৳ <span className="line-through text-xs">{data.rent}</span>
            </div>
          )}
        </p>
      ),
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
    const getParibahanNotice = () => {
      return paribahanNotices?.notices?.find(
        (notice) => notice.paribahanUserId === params.id
      );
    };

    const notice = getParibahanNotice();
    setParibahanNotice(notice);
  }, [paribahanNotices, params.id]);
  return (
    <>
      <div className="container mx-auto bg-white rounded-lg my-5">
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-primary-color rounded-t-lg text-white py-2 px-3">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-center">
            {isLoading && (
              <div className="w-full sm:w-96">
                <Skeleton height={30} baseColor="#008B8B" />
              </div>
            )}
            {!isLoading && (
              <>
                <h1 className="text-xl font-medium">
                  {busInfo?.paribahanUser?.paribahanName}
                </h1>{" "}
                <div className="flex justify-between items-center gap-6">
                  {busInfo?.totalReviewCount > 0 && (
                    <>
                      <span className="hidden sm:block">&#10072;</span>
                      <div className="text-yellow text-base font-semibold flex gap-1">
                        <span>Rating :</span>
                        <div className="flex gap-2">
                          <div className="flex items-center text-primary-color">
                            {[...Array(5)].map((_, index) => (
                              <FaStar
                                key={index}
                                className={`${
                                  index < Math.round(busInfo?.averageRating)
                                    ? "text-yellow"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span>({busInfo?.totalReviewCount})</span>
                        </div>
                      </div>
                    </>
                  )}
                  <a
                    href={`tel:+88${busInfo?.paribahanUser?.salesNumber}`}
                    className="flex gap-3 items-center text-base font-semibold sm:hidden"
                  >
                    <span>Call for Ticket</span>
                    <span className="text-2xl">&#9990;</span>
                  </a>
                </div>
                <TodayDate className="text-base text-white font-normal sm:ml-10" />
              </>
            )}
          </div>

          {isLoading && (
            <div className="w-full sm:w-96">
              <Skeleton height={30} baseColor="#008B8B" />
            </div>
          )}
          {!isLoading && (
            <p className="text-sm md:text-base font-medium hidden sm:block">
              টিকেট এর জন্য যোগাযোগ করুন :{" "}
              <a
                href={`tel:+88${busInfo?.paribahanUser?.salesNumber}`}
                className="font-semibold underline"
              >
                {busInfo?.paribahanUser?.salesNumber}
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
        {isLoading && (
          <div className="w-full">
            <Skeleton height={200} baseColor="#ffffff" highlightColor="#ddd" />
          </div>
        )}
        {!isLoading && busInfo && (
          <DataTable
            columns={column}
            data={busInfo?.paribahanUser?.busSchedule
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
      <div className="container w-full mx-auto flex flex-col items-center">
        <div
          onClick={handleGoReviewPage}
          className="flex gap-1 items-center text-yellow_500 cursor-pointer shadow-md bg-white py-1 px-3 rounded-full"
        >
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
        </div>
        <div
          onClick={handleGoReviewPage}
          className="flex gap-2 items-center text-sm font-semibold cursor-pointer"
        >
          <span className="text-primary-color">Review</span>&#10072;
          <span className="text-yellow_500">Rating</span>&#10072;
          <span className="text-primary-color">Comment</span>
        </div>
      </div>
      <section className="container w-full mx-auto mt-3 mb-2 p-4 bg-white border border-primary-color md:rounded-lg">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg text-center sm:text-left font-semibold">
            Regular Schedule
          </h3>
        </div>
        {isLoading && loader && (
          <div className="w-full">
            <Skeleton height={150} />
          </div>
        )}
        {!isLoading && !loader && (
          <>
            <DataTable
              columns={scheduleColumn}
              data={
                regularSchedules?.schedules?.filter(
                  (schedule) => schedule?.paribahanUserId === params?.id
                ) || []
              }
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
      <section className="mb-8">
        {busInfo?.paribahanUser?.counterLocation && (
          <div className="w-fit mx-auto flex flex-col items-center">
            <h3 className="text-base font-semibold text-black">
              Counter Location
            </h3>
            <span className="text-lg text-primary-color">&#8681;</span>
            <a
              href={busInfo?.paribahanUser?.counterLocationMap}
              className="flex gap-1"
            >
              {busInfo?.paribahanUser?.counterLocationMap && (
                <img src={locationIcon} alt="" className="w-6" />
              )}
              <span className="text-base font-semibold text-primary-color">
                {busInfo?.paribahanUser?.counterLocation}
              </span>
            </a>
          </div>
        )}
      </section>
    </>
  );
};

export default BusInformation;
