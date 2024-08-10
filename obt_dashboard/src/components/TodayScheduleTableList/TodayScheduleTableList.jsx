import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  schedulesData,
  setMessageEmpty,
} from "../../features/schedules/schedulesSlice";
import { authData } from "../../features/auth/authSlice";
import { formatDateTime } from "../../utils/timeAgo";
import swal from "sweetalert";
import {
  deleteSchedule,
  getTodaysSchedule,
} from "../../features/schedules/schedulesApiSlice";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";

const TodayScheduleTableList = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(authData);
  const {
    todaySchedule,
    todayTotalCount,
    todaySearchCount,
    message,
    error,
    todayLoader,
  } = useSelector(schedulesData);

  const handleDeleteSchedule = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`Poof! Successfully deleted`, {
          icon: "success",
        });
        dispatch(deleteSchedule(id));
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const handlePageChange = (page) => {
    setPage(page);
    dispatch(getTodaysSchedule({ page, limit: rowPage, search }));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    dispatch(getTodaysSchedule({ page, limit: newPerPage, search }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(
      getTodaysSchedule({ page, limit: rowPage, search: e.target.value })
    ); // Fetch schedules with the search term
  };

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
      width: "50px",
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
      name: "Bus Type",
      selector: (data) => data.type,
      sortable: true,
    },
    {
      name: "Reg No",
      selector: (data) => data.busNo,
      sortable: true,
    },
    {
      name: "Guide Name",
      selector: (data) => data.guideName,
      sortable: true,
    },
    {
      name: "Guide Phone",
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
      name: "Seat Status",
      selector: (data) => (data.seatStatus ? "Available" : "Booked"),
      sortable: true,
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
            onClick={() => handleDeleteSchedule(data.id)}
            disabled={authUser?.role?.name === "VIEWER" && true}
          >
            <i className="fe fe-trash"></i> Delete
          </button>
        </div>
      ),
      right: true, // Align the column to the right
    },
  ];

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(setMessageEmpty());
    };
  }, [dispatch, todayLoader, error, message]);

  return (
    <>
      <input
        type="text"
        placeholder="Search"
        className="form-control table-search-box"
        onChange={handleSearchChange}
      />
      <DataTable
        columns={columns}
        data={todaySchedule}
        responsive
        progressPending={todayLoader}
        progressComponent={<Loading />}
        pagination
        paginationServer
        paginationTotalRows={
          todaySearchCount ? todaySearchCount : todayTotalCount
        }
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationRowsPerPageOptions={[100, 150, 200]}
      />
    </>
  );
};

export default TodayScheduleTableList;
