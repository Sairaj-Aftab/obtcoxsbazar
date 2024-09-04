import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { useEffect } from "react";
import Modal from "../../components/Modal/Modal";
import { paribahanAuthData } from "../../features/paribahanAuth/paribahanAuthSlice";
import { formatDateTime } from "../../utils/formatDateTime";
import Skeleton from "react-loading-skeleton";
import PageLoader from "../../components/Loader/PageLoader";
import {
  rgSchedulesData,
  setRgScheduleMessageEmpty,
} from "../../features/regularBusSchedule/regularBusScheduleSlice";
import { getSchedulesByParibahanId } from "../../features/regularBusSchedule/regularBusScheduleApiSlice";

const ProfileRegSchedule = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { paribahanAuth: user } = useSelector(paribahanAuthData);
  const {
    authParibahanRgSchedules,
    totalAuthParCount,
    searchAuthParCount,
    loader,
    message,
    error,
  } = useSelector(rgSchedulesData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const handlePageChange = (page) => {
    setPage(page);
    dispatch(
      getSchedulesByParibahanId({ id: user.id, page, limit: rowPage, search })
    );
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    dispatch(
      getSchedulesByParibahanId({
        id: user.id,
        page,
        limit: newPerPage,
        search,
      })
    );
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(
      getSchedulesByParibahanId({
        id: user.id,
        page,
        limit: rowPage,
        search: e.target.value,
      })
    ); // Fetch schedules with the search term
  };

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };
  const column = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
      width: "60px",
    },
    {
      name: "Time",
      selector: (data) => data.time,
      sortable: true,
    },
    {
      name: "Type",
      selector: (data) => data.type,
      sortable: true,
    },
    {
      name: "Destination",
      selector: (data) => data.destinationPlace,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (data) => (
        <div className="flex justify-end gap-1 w-fit">
          <button
            //   onClick={() => handleOpenUpdateForm(data.id)}
            className="bg-primary-color py-1 px-2 text-sm font-medium text-white rounded w-full"
          >
            OFF
          </button>
          <button
            //   onClick={() => handleOpenUpdateForm(data.id)}
            className="bg-primary-color py-1 px-2 text-sm font-medium text-white rounded w-full"
          >
            <FaPencilAlt />
          </button>
          <button
            //   onClick={() => handleDeleteSchedule(data.id)}
            className="bg-red py-1 px-2 text-sm font-medium text-white rounded w-full"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      ),
      right: true,
    },
  ];

  useEffect(() => {
    if (user) {
      dispatch(getSchedulesByParibahanId({ id: user.id, page: 1, limit: 100 }));
    }
    if (message) {
      toast.success(message);

      setShowUpdateModal(false);
    }
    if (error) {
      toast.error(error);
    }
    if (message || error) {
      dispatch(setRgScheduleMessageEmpty());
    }
  }, [dispatch, message, error, user]);
  return (
    <>
      <div className="container mx-auto bg-white p-5 my-5 rounded-lg">
        {/* Table Body */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-lg font-semibold text-gray-700">
              Schedule List
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-40 sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                className="w-full sm:w-60"
                onChange={handleSearchChange}
              />
              <button
                onClick={() => setShowModal(true)}
                className="bg-primary-color py-1 px-2 text-base font-medium text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
          <DataTable
            columns={column}
            data={authParibahanRgSchedules}
            responsive
            // progressPending={loader}
            // progressComponent={
            //   <div className="w-full">
            //     <Skeleton height={200} />
            //   </div>
            // }
            pagination
            paginationServer
            paginationTotalRows={
              totalAuthParCount ? totalAuthParCount : searchAuthParCount
            }
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            paginationRowsPerPageOptions={[100, 150, 200]}
            customStyles={{
              headCells: {
                style: {
                  fontSize: "14px",
                  fontWeight: "bold",
                },
              },
              rows: {
                style: {
                  fontSize: "14px",
                  fontWeight: "400",
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ProfileRegSchedule;
