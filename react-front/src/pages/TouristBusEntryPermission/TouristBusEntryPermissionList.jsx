import DataTable from "react-data-table-component";
import { formatDateTime } from "../../utils/formatDateTime";
import { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import locationIcon from "../../assets/icon/location.png";
import Modal from "../../components/Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { touristBusPermissionsData } from "../../features/touristBusPermission/touristBusPermissionSlice";
import ComponentLoader from "../../components/Loader/ComponentLoader";
import { getAllTouristBusPermission } from "../../features/touristBusPermission/touristBusPermissionApiSlice";

const TouristBusEntryPermissionList = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [reviewPermission, setReviewPermission] = useState({});
  const { permissions, count, permissionLoader } = useSelector(
    touristBusPermissionsData
  );
  const handleShowViewPermission = (id) => {
    const selectedReview = permissions?.find((per) => per.id === id);
    if (selectedReview) {
      setReviewPermission(selectedReview);
    }
    setShowModal(true);
  };
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const handlePageChange = (page) => {
    setPage(page);
    dispatch(getAllTouristBusPermission({ page, limit: rowPage }));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    dispatch(getAllTouristBusPermission({ page, limit: newPerPage }));
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
          <p
            className={`w-full text-center ${
              data.pending && "text-black bg-yellow"
            } ${data.approved && "text-white bg-primary-color"} ${
              data.rejected && "text-white bg-red"
            }  py-1 rounded-md font-medium`}
          >
            {data.pending && "Pending"}
            {data.approved && "Approved"}
            {data.rejected && "Rejected"}
          </p>
        </>
      ),
      width: "100px",
    },
    {
      name: "App. No.",
      selector: (data) => data.applicationNo,
      sortable: true,
      width: "100px",
    },
    {
      name: "Applicant Name",
      selector: (data) => data.applicantName,
      sortable: true,
    },
    {
      name: "Institution/Address",
      selector: (data) => data.institutionName,
      sortable: true,
    },
    {
      name: "Arrival Date & Time",
      selector: (data) => formatDateTime(data.arrivalDateTime),
      sortable: true,
    },
    {
      name: "Number of Bus",
      selector: (data) => data.numberBus,
      width: "60px",
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
      name: "Parking Place",
      cell: (data) => {
        return (
          <a
            href={data.parkingPlaceMapLink}
            className="w-full flex items-center gap-1 text-primary-color cursor-pointer"
          >
            {data.parkingPlaceMapLink && (
              <img src={locationIcon} alt="" className="w-6" />
            )}
            <span>{data.parkingPlace}</span>
          </a>
        );
      },
      width: "260px",
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
  useEffect(() => {
    dispatch(getAllTouristBusPermission({ page: 1, limit: 10 }));
  }, [dispatch]);
  let styles = "flex flex-col gap-1 border border-primary-color rounded-md p-2";
  return (
    <>
      {showModal && (
        <Modal
          title="Tourist Bus Entry Permission"
          close={() => setShowModal(false)}
        >
          <div className="permission-review-modal p-3">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <li className={styles}>
                <p className="font-semibold">Applicant Name</p>
                <p>{reviewPermission?.applicantName}</p>
              </li>
              {/* <li className={styles}>
                <p className="font-semibold">Mobile No.</p>
                <p>{reviewPermission?.phone}</p>
              </li> */}
              <li className={styles}>
                <p className="font-semibold">Institution/Address</p>
                <p>{reviewPermission?.institutionName}</p>
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
                <p className="font-semibold">Parking Place</p>
                <a
                  href={reviewPermission.parkingPlaceMapLink}
                  className="w-full flex items-center gap-1 text-primary-color cursor-pointer"
                >
                  {reviewPermission.parkingPlaceMapLink && (
                    <img src={locationIcon} alt="" className="w-6" />
                  )}
                  <span>{reviewPermission.parkingPlace}</span>
                </a>
              </li>
              <li className={styles}>
                <p className="font-semibold">Arrival Date & Time</p>
                <p>{formatDateTime(reviewPermission?.arrivalDateTime)}</p>
              </li>
              <li className={styles}>
                <p className="font-semibold">Return Date & Time</p>
                <p>{formatDateTime(reviewPermission?.returnDateTime)}</p>
              </li>
              {reviewPermission?.description && (
                <li className={styles}>
                  <p className="font-semibold">Description</p>
                  <p>{reviewPermission.description}</p>
                </li>
              )}
              {/* <li className={styles}>
                <p className="font-semibold">Permission</p>
                <p>Pending</p>
              </li> */}
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
          data={permissions || []}
          responsive
          progressPending={permissionLoader}
          progressComponent={
            <div className="bg-white h-[70vh]">
              <ComponentLoader />
            </div>
          }
          pagination
          paginationServer
          paginationTotalRows={count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
        />
        <h1 className="bg-primary-color p-2 text-white text-sm font-normal text-center sm:text-start">
          জরুরি প্রয়োজনে কল করুন : ‍
          <a
            href="tel:+8801320108710"
            className="text-yellow text-base font-semibold"
          >
            01320-108710
          </a>
        </h1>
      </div>
    </>
  );
};

export default TouristBusEntryPermissionList;
