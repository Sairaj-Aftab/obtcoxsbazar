import { formatDateTime } from "../utils/formatDateTime";

const scheduleColumn = [
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
        <a href={data.leavingMapLink} className="underline text-primary-color">
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

export default scheduleColumn;
