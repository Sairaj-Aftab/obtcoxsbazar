import DataTable from "react-data-table-component";
import { formatDateTime } from "../../utils/formatDateTime";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import Modal from "../../components/Modal/Modal";

const dummyData = [
  {
    id: 1,
    applicantName: "John Doe",
    phone: "123-456-7890",
    institutionName: "XYZ University",
    arrivalPlace: "Cox's Bazar",
    arrivalDateTime: "2024-09-25T08:00:00",
    numberTourist: 25,
    numberBus: 2,
    transportName: "Green Line",
    vehicleRegNo: "Dhaka Metro B-1234",
    destinationName: "Saint Martin",
    parkingPlace: "Cox's Bazar Parking Lot",
    returnDateTime: "2024-09-30T18:00:00",
    description: "Student trip for research purposes.",
  },
  {
    id: 2,
    applicantName: "Jane Smith",
    phone: "987-654-3210",
    institutionName: "ABC School",
    arrivalPlace: "Cox's Bazar",
    arrivalDateTime: "2024-09-26T09:30:00",
    numberTourist: 40,
    numberBus: 3,
    transportName: "Shyamoli Paribahan",
    vehicleRegNo: "Chittagong B-4567",
    destinationName: "Teknaf",
    parkingPlace: "Teknaf Parking Zone",
    returnDateTime: "2024-09-29T17:45:00",
    description: "School field trip to Teknaf.",
  },
  {
    id: 3,
    applicantName: "Alice Johnson",
    phone: "456-789-0123",
    institutionName: "DEF College",
    arrivalPlace: "Cox's Bazar",
    arrivalDateTime: "2024-09-27T07:15:00",
    numberTourist: 15,
    numberBus: 1,
    transportName: "Sohag Paribahan",
    vehicleRegNo: "Sylhet B-7890",
    destinationName: "Inani Beach",
    parkingPlace: "Inani Beach Parking",
    returnDateTime: "2024-09-28T16:30:00",
    description: "College tour to Inani Beach.",
  },
];

const TouristBusEntryPermissionList = () => {
  const [showModal, setShowModal] = useState(false);
  const [reviewPermission, setReviewPermission] = useState({});
  const handleShowViewPermission = (id) => {
    const selectedReview = dummyData?.find((per) => per.id === id);
    if (selectedReview) {
      setReviewPermission(selectedReview);
    }
    setShowModal(true);
  };
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const handlePageChange = (page) => {
    setPage(page);
    // dispatch(getAllTouristBusPermission({ page, limit: rowPage, search }));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    // dispatch(getAllTouristBusPermission({ page, limit: newPerPage, search }));
  };
  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };
  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
      width: "60px",
    },
    {
      name: "View",
      cell: (data) => (
        <div onClick={() => handleShowViewPermission(data.id)}>
          <FaRegEye className="text-primary-color text-lg cursor-pointer" />
        </div>
      ),
      width: "60px",
    },
    {
      name: "Status",
      selector: (data) => data.applicantName,
      cell: (data) => (
        <>
          <p className="w-full text-center text-white bg-red py-1 rounded-md font-medium">
            Pending
          </p>
        </>
      ),
      width: "100px",
    },
    {
      name: "Applicant Name",
      selector: (data) => data.applicantName,
      sortable: true,
    },
    {
      name: "Phone No.",
      selector: (data) => data.phone,
      sortable: true,
    },
    {
      name: "Institution Name",
      selector: (data) => data.institutionName,
      sortable: true,
    },
    {
      name: "Arrival Place",
      selector: (data) => data.arrivalPlace,
      sortable: true,
    },
    {
      name: "Arrival Date & Time",
      selector: (data) => formatDateTime(data.arrivalDateTime),
      sortable: true,
    },
    {
      name: "No of Tourist",
      selector: (data) => data.numberTourist,
    },
    {
      name: "Number of Bus",
      selector: (data) => data.numberBus,
    },
    {
      name: "Transport Name",
      selector: (data) => data.transportName,
    },
    {
      name: "Vehicle Reg.",
      selector: (data) => data.vehicleRegNo,
    },
    {
      name: "Destination",
      selector: (data) => data.destinationName,
    },
    {
      name: "Parking Place",
      selector: (data) => data.parkingPlace,
    },
    {
      name: "Return Date & Time",
      selector: (data) => formatDateTime(data.returnDateTime),
    },
    {
      name: "Description",
      selector: (data) => data.description,
    },
  ];
  let styles = "flex flex-col gap-1 border border-primary-color rounded-md p-2";
  return (
    <>
      {showModal && (
        <Modal title="View details" close={() => setShowModal(false)}>
          <div className="permission-review-modal p-3">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <li className={styles}>
                <p className="font-semibold">Applicant Name</p>
                <p>{reviewPermission?.applicantName}</p>
              </li>
              <li className={styles}>
                <p className="font-semibold">Mobile No.</p>
                <p>{reviewPermission?.phone}</p>
              </li>
              <li className={styles}>
                <p className="font-semibold">Institution & Arrival Place</p>
                <p>{reviewPermission?.institutionName}</p>
              </li>
              <li className={styles}>
                <p className="font-semibold">No of Tourist</p>
                <p>{reviewPermission?.numberTourist}</p>
              </li>
              <li className={styles}>
                <p className="font-semibold">No of Transport</p>
                <p>{reviewPermission?.numberBus}</p>
              </li>
              <li className={styles}>
                <p className="font-semibold">Transport Name</p>
                <p>{reviewPermission?.transportName}</p>
              </li>
              <li className={styles}>
                <p className="font-semibold">Transport Reg.</p>
                <p>{reviewPermission?.vehicleRegNo}</p>
              </li>
              <li className={styles}>
                <p className="font-semibold">Destination Place</p>
                <p>{reviewPermission?.destinationName}</p>
              </li>
              <li className={styles}>
                <p className="font-semibold">Parking Place</p>
                <p>{reviewPermission?.parkingPlace}</p>
              </li>
              <li className={styles}>
                <p className="font-semibold">Arrival Date & Time</p>
                <p>{formatDateTime(reviewPermission?.arrivalDateTime)}</p>
              </li>
              <li className={styles}>
                <p className="font-semibold">Return Date & Time</p>
                <p>{formatDateTime(reviewPermission?.returnDateTime)}</p>
              </li>
              <li className={styles}>
                <p className="font-semibold">Permission</p>
                <p>Pending</p>
              </li>
            </ul>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                className="bg-red text-white py-1 px-2 rounded-md text-base font-medium"
                onClick={() => setShowModal(!showModal)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="container mx-auto bg-white rounded-lg">
        <DataTable
          columns={columns}
          data={dummyData}
          responsive
          // progressPending={permissionLoader}
          // progressComponent={<Loading />}
          pagination
          paginationServer
          // paginationTotalRows={permissionsCount}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
        />
      </div>
    </>
  );
};

export default TouristBusEntryPermissionList;
