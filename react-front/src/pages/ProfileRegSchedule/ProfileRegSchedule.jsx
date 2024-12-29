import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import { paribahanAuthData } from "../../features/paribahanAuth/paribahanAuthSlice";
import { useQuery } from "@tanstack/react-query";
import { getRgSchedulesByParibahanId } from "../../services/schedules.service";
import ComponentLoader from "../../components/Loader/ComponentLoader";

const ProfileRegSchedule = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { paribahanAuth: user } = useSelector(paribahanAuthData);

  const { data, isLoading } = useQuery({
    queryKey: ["userRegularSchedules", { id: user.id, page, limit, search }],
    queryFn: () =>
      getRgSchedulesByParibahanId({ id: user.id, page, limit, search }),
  });

  const handleHideShowRgSchedule = () => {
    // dispatch(setRgScheduleMessageEmpty());
  };

  const calculateItemIndex = (page, limit, index) => {
    return (page - 1) * limit + index + 1;
  };
  const column = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, limit, index),
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
          <label
            onClick={() => handleHideShowRgSchedule(data.id)}
            className="relative inline-flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              checked={data.status} // Bind to status
              className="sr-only peer"
              readOnly
            />
            <div className="w-11 h-6 bg-red rounded-full peer peer-checked:bg-primary-color"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
          </label>
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
                onChange={(e) => setSearch(e.target.value)}
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
            data={data?.schedules}
            responsive
            progressPending={isLoading}
            progressComponent={
              <div className="w-full py-4">
                <ComponentLoader />
              </div>
            }
            pagination
            paginationServer
            paginationTotalRows={data?.count}
            onChangeRowsPerPage={(perPage) => setLimit(perPage)}
            onChangePage={(page) => setPage(page)}
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
