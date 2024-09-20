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
  const handleStatusChange = (id, status) => {
    const approved = status === "approved";
    const rejected = status === "rejected";

    dispatch(
      updateTouristBusPermission({
        id,
        approved,
        rejected,
        // permissionReason: "User changed status",
      })
    ).then(() => {
      setEditStatusId(null); // Reset the edit mode
    });
  };
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const handlePageChange = (page) => {
    setPage(page);
    dispatch(getAllTouristBusPermission({ page, limit: rowPage, search }));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    dispatch(getAllTouristBusPermission({ page, limit: newPerPage, search }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(
      getAllTouristBusPermission({
        page,
        limit: rowPage,
        search: e.target.value,
      })
    );
  };
  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  useEffect(() => {
    dispatch(getAllTouristBusPermission({ page: 1, limit: 10 }));
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
    }
    return () => {
      dispatch(setMessageEmpty());
    };
  }, [dispatch, message, error]);

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
      width: "60px",
    },
    {
      name: "View",
      cell: (data) => (
        <a
          data-target="#showreview"
          data-toggle="modal"
          href="#edit_specialities_details"
          rel="noreferrer"
          // onClick={() => handleShowReview(data.id)}
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
