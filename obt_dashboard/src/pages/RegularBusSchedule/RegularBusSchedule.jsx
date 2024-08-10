import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader/PageHeader";
import { authData } from "../../features/auth/authSlice";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import { toast } from "react-hot-toast";
import {
  rgSchedulesData,
  setRgScheduleMessageEmpty,
} from "../../features/regularSchedule/regularScheduleSlice";
import {
  createSchedule,
  deleteSchedule,
  getAllRgSchedules,
} from "../../features/regularSchedule/regularScheduleApiSlice";
import { formatDateTime } from "../../utils/timeAgo";
import { placeData } from "../../features/place/placeSlice";
import { getAllData } from "../../features/user/userSlice";
import swal from "sweetalert";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading/Loading";

const RegularBusSchedule = () => {
  const dispatch = useDispatch();
  const { paribahanUsers } = useSelector(getAllData);
  const { authUser } = useSelector(authData);
  const { rgSchedules, totalCount, searchCount, message, error, loader } =
    useSelector(rgSchedulesData);
  const { leavingPlaces, destinationPlaces } = useSelector(placeData);

  const [input, setInput] = useState({
    busName: "",
    time: "",
    type: "",
    leavingPlace: "",
    destinationPlace: "",
    rent: "",
  });

  const changeInputValue = (e) => {
    const { name, value } = e.target;

    setInput({ ...input, [name]: value });
  };

  const handleCreateSchedule = (e) => {
    e.preventDefault();
    if (
      !input.busName ||
      !input.time ||
      !input.type ||
      !input.leavingPlace ||
      !input.destinationPlace
    ) {
      toast.error("All fields are required");
    } else {
      dispatch(createSchedule({ data: input }));
    }
  };

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
        dispatch(setRgScheduleMessageEmpty());
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
    dispatch(getAllRgSchedules({ page, limit: rowPage, search }));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    dispatch(getAllRgSchedules({ page, limit: newPerPage, search }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(
      getAllRgSchedules({ page, limit: rowPage, search: e.target.value })
    );
  };
  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
    }
    return () => {
      dispatch(setRgScheduleMessageEmpty());
    };
  }, [dispatch, message, error]);

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
      width: "50px",
    },
    {
      name: "Time",
      selector: (data) => data.time,
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

  return (
    <>
      <ModalPopup title="Create Regular Schedule" target="busScheduleModal">
        <form onSubmit={handleCreateSchedule}>
          <div className="form-group mb-2">
            <select
              name="busName"
              id="busName"
              value={input.busName}
              onChange={changeInputValue}
              className="form-control"
            >
              <option value="">Paribahan Name</option>
              {paribahanUsers?.map((data, index) => (
                <option key={index} value={data.paribahanName}>
                  {data.paribahanName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-2">
            <label htmlFor="time">Starting Time</label>
            <input
              id="time"
              type="time"
              name="time"
              value={input.time}
              min={new Date().toISOString().slice(0, 16)}
              onChange={changeInputValue}
              placeholder="Starting Time"
              className="form-control"
            />
          </div>
          <div className="form-group mb-2">
            <select
              name="type"
              id="type"
              value={input.type}
              onChange={changeInputValue}
              className="form-control"
            >
              <option value="">Bus Type</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
              <option value="Sleeper Coach">Sleeper Coach</option>
            </select>
          </div>
          <div className="form-group mb-2">
            <select
              name="leavingPlace"
              id="leavingPlace"
              value={input.leavingPlace}
              onChange={changeInputValue}
              className="form-control"
            >
              <option value="">Departure Place</option>
              {leavingPlaces?.map((place, index) => (
                <option key={index} value={place?.placeName}>
                  {place?.placeName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-2">
            <select
              name="destinationPlace"
              id="destinationPlace"
              value={input.destinationPlace}
              onChange={changeInputValue}
              className="form-control"
            >
              <option value="">Destination</option>
              {destinationPlaces?.map((place, index) => (
                <option key={index} value={place?.placeName}>
                  {place?.placeName}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
      </ModalPopup>
      <PageHeader title="Regular Bus Schedule" />
      <button
        data-target="#busScheduleModal"
        data-toggle="modal"
        className="btn btn-primary btn-sm mb-2"
        disabled={authUser?.role?.name === "VIEWER" && true}
      >
        Add regular schedule
      </button>
      <input
        type="text"
        placeholder="Search"
        className="form-control table-search-box"
        onChange={handleSearchChange}
      />
      <DataTable
        columns={columns}
        data={rgSchedules}
        responsive
        fixedHeader
        progressPending={loader}
        progressComponent={<Loading />}
        pagination
        paginationServer
        paginationTotalRows={searchCount ? searchCount : totalCount}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
    </>
  );
};

export default RegularBusSchedule;
