import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  createBusInfo,
  getBusInfo,
  updateBusInfo,
} from "../../features/busInfo/busInfoApiSlice";
import Modal from "../../components/Modal/Modal";
import { formatDateTime } from "../../utils/formatDateTime";
import {
  busInfoData,
  setBusInfoMessageEmpty,
} from "../../features/busInfo/busInfoSlice";
import { paribahanAuthData } from "../../features/paribahanAuth/paribahanAuthSlice";
import DataTable from "react-data-table-component";

const ProfileBusInfo = () => {
  const { paribahanAuth: user } = useSelector(paribahanAuthData);
  const dispatch = useDispatch();
  const { busInfo, totalCount, searchCount, loader, message, error } =
    useSelector(busInfoData);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [input, setInput] = useState({
    paribahanName: user?.paribahanName,
    regNo: "",
    type: "",
    comment: "",
  });
  const changeInputValue = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (!input.regNo || !input.type) {
      toast.error("Fields are required!");
    } else {
      dispatch(createBusInfo({ id: user.id, data: input }));
    }
  };

  const [id, setId] = useState();
  const [infoData, setInfoData] = useState();
  const changeInfoData = (e) => {
    const { name, value } = e.target;
    setInfoData({ ...infoData, [name]: value });
  };
  const handleOpenUpdateForm = (id) => {
    const data = busInfo.find((info) => info.id === id);
    setId(data.id);
    setInfoData({
      ...data,
    });
    setShowUpdateModal(true);
  };
  const handleUpdateInfo = (e) => {
    e.preventDefault();
    if (!infoData.regNo || !infoData.type) {
      toast.error("All fields are required");
    } else {
      dispatch(updateBusInfo({ id, data: infoData }));
    }
  };

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const handlePageChange = (page) => {
    setPage(page);
    dispatch(getBusInfo({ id: user.id, page, limit: rowPage, search }));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    dispatch(getBusInfo({ id: user.id, page, limit: newPerPage, search }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(
      getBusInfo({
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
      name: "Bus Reg No",
      selector: (data) => data.regNo,
      sortable: true,
    },
    {
      name: "Type",
      selector: (data) => data.type,
      sortable: true,
    },
    {
      name: "Road Permit",
      selector: (data) => data.comment,
      sortable: true,
    },
    {
      name: "Entry Date",
      selector: (data) => formatDateTime(data.createdAt),
      sortable: true,
    },
    // {
    //   name: "Actions",
    //   cell: (data) => (
    //     <div className="flex justify-end gap-1">
    //       <button
    //         onClick={() => handleOpenUpdateForm(data.id)}
    //         className="bg-primary-color py-1 px-2 text-sm font-medium text-white rounded"
    //       >
    //         Edit
    //       </button>
    //     </div>
    //   ),
    //   right: true, // Align the column to the right
    // },
  ];

  useEffect(() => {
    dispatch(getBusInfo({ id: user?.id, page: 1, limit: 100 }));
    if (message) {
      toast.success(message);
      setInput({
        regNo: "",
        type: "",
        comment: "",
      });
      setShowUpdateModal(false);
    }
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(setBusInfoMessageEmpty());
    };
  }, [dispatch, message, loader, error, user?.id]);
  return (
    <>
      {showModal && (
        <Modal title="Add Bus Info" close={() => setShowModal(false)}>
          <form
            onSubmit={handleSubmitInfo}
            className="flex flex-col gap-2 w-full p-2"
          >
            <input
              type="text"
              name="regNo"
              value={input.regNo}
              onChange={changeInputValue}
              placeholder="Reg No"
            />
            <select
              name="type"
              id="type"
              value={input.type}
              onChange={changeInputValue}
            >
              <option value="">Bus Type</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
              <option value="Sleeper Coach">Sleeper Coach</option>
              <option value="Double-decker">Double-decker</option>
            </select>
            <input
              type="text"
              name="comment"
              value={input.comment}
              onChange={changeInputValue}
              placeholder="Remark"
            />
            <button
              type="submit"
              className="bg-primary-color py-1 text-base font-medium text-white rounded"
              disabled={loader}
            >
              {loader ? "Adding..." : "Add"}
            </button>
          </form>
        </Modal>
      )}
      {showUpdateModal && (
        <Modal title="Edit Bus Info" close={() => setShowUpdateModal(false)}>
          <form
            onSubmit={handleUpdateInfo}
            className="flex flex-col gap-2 w-full p-2"
          >
            <input
              type="text"
              name="regNo"
              value={infoData.regNo}
              onChange={changeInfoData}
              placeholder="Reg No"
            />
            <select
              name="type"
              id="type"
              value={infoData.type}
              onChange={changeInfoData}
            >
              <option value="">Bus Type</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
              <option value="Sleeper Coach">Sleeper Coach</option>
              <option value="Double-decker">Double-decker</option>
            </select>
            <input
              type="text"
              name="comment"
              value={infoData.comment}
              onChange={changeInfoData}
              placeholder="Remark"
            />
            <button
              type="submit"
              className="bg-primary-color py-1 text-base font-medium text-white rounded"
              disabled={loader}
            >
              {loader ? "Editing..." : "Edit"}
            </button>
          </form>
        </Modal>
      )}
      <div className="container mx-auto bg-white p-5 my-5 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-lg font-semibold text-gray-700">Bus Info</h1>
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
              Add bus info
            </button>
          </div>
        </div>
        <DataTable
          columns={column}
          data={busInfo
            ?.slice() // Create a shallow copy of the array
            .sort((a, b) => a.regNo.localeCompare(b.regNo))}
          responsive
          // progressPending={todayLoader}
          // progressComponent={<Loading />}
          pagination
          paginationServer
          paginationTotalRows={totalCount ? totalCount : searchCount}
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
        {/* <div className="overflow-x-auto">
          <table className="mt-5 border border-gray-300 rounded-lg">
            <thead>
              <tr className="text-sm font-semibold bg-primary-color text-white">
                <th>#</th>
                <th>Bus Reg No</th>
                <th>Type</th>
                <th>Remark</th>
                <th>Entry Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {busInfo
                ?.slice()
                .sort((a, b) => a.regNo.localeCompare(b.regNo))
                ?.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.regNo}</td>
                    <td>{data.type}</td>
                    <td>{data?.comment}</td>
                    <td>{formatDateTime(data.createdAt)}</td>
                    <td className="flex justify-end gap-1">
                      <button
                        onClick={() => handleOpenUpdateForm(data.id)}
                        className="bg-primary-color py-1 px-2 text-sm font-medium text-white rounded"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </>
  );
};

export default ProfileBusInfo;
