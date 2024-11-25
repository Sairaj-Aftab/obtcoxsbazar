import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader/PageHeader";
import DataTable from "react-data-table-component";
import { authData } from "../../features/auth/authSlice";
import { useEffect, useState } from "react";
import {
  getAllTouristBusPermission,
  updateTouristBusPermission,
} from "../../features/touristBusPermission/touristBusPermissionApiSlice";
import {
  setMessageEmpty,
  touristBusPermissionsData,
} from "../../features/touristBusPermission/touristBusPermissionSlice";
import toast from "react-hot-toast";
import { formatDateAndTime, formatDateTime } from "../../utils/timeAgo";
import Loading from "../../components/Loading/Loading";
import ModalPopup from "../../components/ModalPopup/ModalPopup";

const TouristBusPermission = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(authData);
  const {
    permissions,
    permissionsCount,
    message,
    error,
    permissionLoader,
    loader,
  } = useSelector(touristBusPermissionsData);
  const [editStatusId, setEditStatusId] = useState(null);

  const [reviewPermission, setReviewPermission] = useState({});
  const [reviewStatus, setReviewStatus] = useState("");
  const [rejectContent, setRejectContent] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);

  const handleShowReviewPermission = (id) => {
    const selectedReview = permissions?.find((per) => per.id === id);
    if (selectedReview) {
      setReviewPermission(selectedReview);
      setReviewStatus(
        selectedReview.approved
          ? "approved"
          : selectedReview.rejected
          ? "rejected"
          : "pending"
      );
    }
  };

  const handleStatusChange = (id, status) => {
    const approved = status === "approved";
    const rejected = status === "rejected";

    dispatch(
      updateTouristBusPermission({
        id,
        approved,
        rejected,
        rejectedReason: rejectContent,
      })
    ).then(() => {
      setEditStatusId(null); // Reset the edit mode
      toast.success(`Status updated to ${status}`);
    });
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    handleStatusChange(reviewPermission.id, reviewStatus);
  };

  const handlePageChange = (page) => {
    setPage(page);
    dispatch(getAllTouristBusPermission({ page, limit: rowPage, search }));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    dispatch(getAllTouristBusPermission({ page, limit: newPerPage, search }));
  };

  // const handleSearchChange = (e) => {
  //   setSearch(e.target.value);
  //   dispatch(
  //     getAllTouristBusPermission({
  //       page,
  //       limit: rowPage,
  //       search: e.target.value,
  //     })
  //   );
  // };
  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  useEffect(() => {
    return () => {
      setReviewStatus("");
    };
  }, [reviewPermission]);

  useEffect(() => {
    dispatch(getAllTouristBusPermission({ page: 1, limit: 10 }));
    if (error) {
      toast.error(error);
    }
    if (message) {
      setReviewPermission({
        pending: false,
      });
    }
    if (error || message) {
      dispatch(setMessageEmpty());
    }
  }, [dispatch, message, error, reviewPermission?.pending]);

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
      width: "60px",
    },
    {
      name: "Review",
      cell: (data) => (
        <a
          data-target="#reviewpermission"
          data-toggle="modal"
          href="#edit_specialities_details"
          rel="noreferrer"
          onClick={() => handleShowReviewPermission(data.id)}
        >
          <i
            className="fa fa-eye"
            style={{ color: "#00d0f1", fontSize: "17px" }}
          ></i>
        </a>
      ),
      width: "60px",
    },
    {
      name: "Status",
      cell: (data) =>
        editStatusId === data.id ? (
          <select
            value={
              data.approved
                ? "approved"
                : data.rejected
                ? "rejected"
                : "pending"
            }
            onChange={(e) => handleStatusChange(data.id, e.target.value)}
            className="form-control mb-0"
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        ) : (
          <p
            className={`badge mb-0 ${
              data.approved
                ? "badge-success"
                : data.rejected
                ? "badge-danger"
                : "badge-warning"
            }`}
            onClick={() => setEditStatusId(data.id)}
          >
            {data.approved
              ? "Approved"
              : data.rejected
              ? "Rejected"
              : "Pending"}
          </p>
        ),
      width: "140px",
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
      name: "Phone No.",
      selector: (data) => data.phone,
      sortable: true,
    },
    {
      name: "Institution & Arrival Place",
      selector: (data) => data.institutionName,
      sortable: true,
    },
    {
      name: "Arrival Date & Time",
      selector: (data) => formatDateAndTime(data.arrivalDateTime),
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
    {
      name: "Entry Date",
      selector: (data) => formatDateTime(data.createdAt),
      sortable: true,
    },
    {
      name: "Actions",

      cell: (data) => (
        <div className="text-right actions">
          <button
            className="btn btn-sm bg-danger-light"
            // onClick={() => handleDeleteSchedule(data.id)}
            disabled={authUser?.role?.name === "VIEWER" && true}
          >
            <i className="fe fe-trash"></i> Delete
          </button>
        </div>
      ),
      right: true, // Align the column to the right
    },
  ];
  return (
    <>
      <ModalPopup
        size="modal-lg"
        title="Permission Review"
        target="reviewpermission"
      >
        <form className="permission-review-modal" onSubmit={handleModalSubmit}>
          <ul>
            <li>
              <p>Applicant Name</p> <p>{reviewPermission?.applicantName}</p>
            </li>
            <li>
              <p>Mobile No.</p> <p>{reviewPermission?.phone}</p>
            </li>
            <li>
              <p>Institution & Arrival Place</p>{" "}
              <p>{reviewPermission?.institutionName}</p>
            </li>
            <li>
              <p>No of Tourist</p> <p>{reviewPermission?.numberTourist}</p>
            </li>
            <li>
              <p>No of Transport</p> <p>{reviewPermission?.numberBus}</p>
            </li>
            <li>
              <p>Transport Name</p> <p>{reviewPermission?.transportName}</p>
            </li>
            <li>
              <p>Transport Reg.</p> <p>{reviewPermission?.vehicleRegNo}</p>
            </li>
            <li>
              <p>Destination Place</p>{" "}
              <p>{reviewPermission?.destinationName}</p>
            </li>
            <li>
              <p>Parking Place</p> <p>{reviewPermission?.parkingPlace}</p>
            </li>
            <li>
              <p>Arrival Date & Time</p>{" "}
              <p>{formatDateAndTime(reviewPermission?.arrivalDateTime)}</p>
            </li>
            <li>
              <p>Return Date & Time</p>{" "}
              <p>{formatDateAndTime(reviewPermission?.returnDateTime)}</p>
            </li>
            {reviewPermission?.description && (
              <li>
                <p>Description</p> <p>{reviewPermission?.description}</p>
              </li>
            )}
            {reviewPermission?.pending && (
              <li>
                <p>Permission</p>{" "}
                <div className="d-flex">
                  <label
                    htmlFor="accept"
                    className="mr-2 mb-0 form-control d-flex align-items-center"
                  >
                    <input
                      type="radio"
                      id="accept"
                      name="status"
                      value="approved"
                      checked={reviewStatus === "approved"}
                      onChange={(e) => setReviewStatus(e.target.value)}
                    />
                    <span className="ml-1 font-weight-bold">Approve</span>
                  </label>
                  <label
                    htmlFor="reject"
                    className="mb-0 form-control d-flex align-items-center"
                  >
                    <input
                      type="radio"
                      id="reject"
                      name="status"
                      value="rejected"
                      checked={reviewStatus === "rejected"}
                      onChange={(e) => setReviewStatus(e.target.value)}
                    />
                    <span className="ml-1 font-weight-bold text-danger">
                      Reject
                    </span>
                  </label>
                </div>
              </li>
            )}
            {reviewPermission?.pending && reviewStatus === "rejected" && (
              <li>
                <p className="text-danger">Reason for rejection</p>{" "}
                <div className="form-group">
                  <select
                    value={rejectContent}
                    onChange={(e) => setRejectContent(e.target.value)}
                    className="form-control"
                  >
                    <option value="Rejected">Rejected</option>
                    <option value="Traffic Jam in Town Area">
                      Traffic Jam in Town Area
                    </option>
                    <option value="Incomplete Bus Reg. Number">
                      Incomplete Bus Reg. Number
                    </option>
                    <option value="Incomplete  Information">
                      Incomplete Information
                    </option>
                    <option value="Wrong selection of parking area">
                      Wrong selection of parking area
                    </option>
                  </select>
                </div>
              </li>
            )}
          </ul>
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-danger mr-2"
              type="button"
              data-dismiss="modal"
            >
              Cancel
            </button>
            {reviewPermission?.pending && (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loader}
              >
                {loader ? "Updating..." : "Update Status"}
              </button>
            )}
          </div>
        </form>
      </ModalPopup>
      <PageHeader title="Tourist Bus Permission" />
      <DataTable
        columns={columns}
        data={permissions}
        responsive
        progressPending={permissionLoader}
        progressComponent={<Loading />}
        pagination
        paginationServer
        paginationTotalRows={permissionsCount}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
    </>
  );
};

export default TouristBusPermission;
