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

export default scheduleColumn;
