import { formatDateTime } from "../utils/formatDateTime";
import { FaPhone } from "react-icons/fa6";
import locationIcon from "../assets/icon/location.png";

const scheduleColumn = ({ navigate, destinationPlaces }) => {
  return [
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
      name: "Paribahan",
      selector: (data) => data.busName,
      cell: (data) => {
        return (
          <p
            onClick={() =>
              navigate(`/all-bus-services/${data.slug}/${data.paribahanUserId}`)
            }
            className="w-full flex items-center gap-1 text-primary-color cursor-pointer"
          >
            {data.busName}
          </p>
        );
      },
      sortable: true,
      width: "210px",
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
      width: "150px",
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
      width: "225px",
      sortable: true,
    },
    {
      name: "Destination",
      cell: (data) => {
        const matchingPlace = destinationPlaces?.find(
          (place) => place.placeName === data.destinationPlace
        );
        return matchingPlace ? (
          <div
            onClick={() =>
              navigate(`/${matchingPlace.slug}/${matchingPlace.id}`)
            }
            className="cursor-pointer flex gap-1 items-center text-red"
          >
            <span>&#10132;</span>
            <span>{data.destinationPlace}</span>
          </div>
        ) : null;
      },
      sortable: true,
      width: "160px",
    },
    {
      name: "Fare",
      cell: (data) => {
        return (
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
        );
      },
      sortable: true,
      width: "90px",
    },
    {
      name: "Seat Status",
      cell: (data) => {
        return (
          <div
            onClick={() =>
              navigate(`/all-bus-services/${data.slug}/${data.paribahanUserId}`)
            }
            className="cursor-pointer"
          >
            {data.seatStatus ? (
              <span className="bg-primary-color text-white rounded-md p-1">
                Available
              </span>
            ) : (
              <span className="bg-red text-white rounded-md p-1">Booked</span>
            )}
          </div>
        );
      },
      sortable: true,
    },
  ];
};

export default scheduleColumn;
