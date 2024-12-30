import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../components/Modal/Modal";
import DataTable from "react-data-table-component";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBusRegNo,
  getBusRegNo,
  updateBusRegNo,
} from "../../services/busRegNo.service";
import ComponentLoader from "../../components/Loader/ComponentLoader";
import useParibahanAuth from "../../store/useParibahanAuth";

const ProfileBusInfo = () => {
  const queryClient = useQueryClient();
  const { paribahanAuth: user } = useParibahanAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { data: busRegNo, isLoading: busRegNoLoading } = useQuery({
    queryKey: ["busRegNo", { id: user.id, page, limit, search }],
    queryFn: () => getBusRegNo({ id: user.id, page, limit, search }),
  });
  const {
    mutateAsync: createRegNo,
    data: createData,
    isSuccess: createSuccess,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: createBusRegNo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["busRegNo"] });
    },
  });
  // Update bus info
  const {
    mutateAsync: updateBusReg,
    data: updateData,
    isSuccess: updateSuccess,
    error: updateError,
    isPending: updateLoading,
  } = useMutation({
    mutationFn: updateBusRegNo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["busRegNo"] });
      setShowUpdateModal(false);
    },
  });
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
  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    if (!input.regNo || !input.type) {
      toast.error("Fields are required!");
    } else {
      await createRegNo({ id: user.id, data: input });
    }
  };

  const [id, setId] = useState();
  const [infoData, setInfoData] = useState();
  const changeInfoData = (e) => {
    const { name, value } = e.target;
    setInfoData({ ...infoData, [name]: value });
  };
  const handleOpenUpdateForm = (id) => {
    const data = busRegNo?.busInfo.find((info) => info.id === id);
    setId(data.id);
    setInfoData({
      ...data,
    });
    setShowUpdateModal(true);
  };
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (!infoData.regNo || !infoData.type) {
      toast.error("All fields are required");
    } else {
      await updateBusReg({ id, data: infoData });
    }
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
      name: "Bus Reg No",
      selector: (data) => data.regNo,
      sortable: true,
    },
    {
      name: "Type",
      selector: (data) => data.type,
      sortable: true,
    },
    // {
    //   name: "FC Expire",
    //   cell: (data) => {
    //     const currentDate = new Date();
    //     const fcExpireDate = new Date(data?.fcExpire);
    //     const isExpired = fcExpireDate < currentDate;

    //     return (
    //       <span
    //         style={{
    //           color: isExpired ? "red" : "inherit",
    //           textDecoration: isExpired ? "line-through" : "none",
    //         }}
    //       >
    //         {data.fcExpire}
    //       </span>
    //     );
    //   },
    //   sortable: true,
    // },
    // {
    //   name: "Route Permit",
    //   selector: (data) => data.comment,
    //   sortable: true,
    // },
    {
      name: "Report",
      selector: (data) => data.report,
      sortable: true,
    },
    // {
    //   name: "Entry Date",
    //   selector: (data) => formatDateTime(data.createdAt),
    //   sortable: true,
    // },
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
    if (
      createSuccess ||
      createData?.message ||
      updateData?.message ||
      updateSuccess
    ) {
      toast.success(createData?.message || updateData?.message);
      setInput({
        regNo: "",
        type: "",
        comment: "",
      });
      setShowModal(false);
      setShowUpdateModal(false);
    }
    if (createError || updateError) {
      toast.error(createError.message || updateError.message);
    }
  }, [
    createData?.message,
    createError,
    createSuccess,
    updateData?.message,
    updateError,
    updateSuccess,
  ]);
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
              <option value="Suite Class">Suite Class</option>
              <option value="Hyundai Biz Class">Hyundai Biz Class</option>
            </select>
            {/* <input
              type="text"
              name="comment"
              value={input.comment}
              onChange={changeInputValue}
              placeholder="Remark"
            /> */}
            <button
              type="submit"
              className="bg-primary-color py-1 text-base font-medium text-white rounded disabled:cursor-not-allowed disabled:opacity-80"
              disabled={createLoading}
            >
              {createLoading ? "Adding..." : "Add"}
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
              disabled={updateLoading}
            >
              {updateLoading ? "Updating..." : "Update"}
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
              onChange={(e) => setSearch(e.target.value)}
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
          data={busRegNo?.busInfo
            ?.slice() // Create a shallow copy of the array
            .sort((a, b) => a.regNo.localeCompare(b.regNo))}
          responsive
          progressPending={busRegNoLoading}
          progressComponent={
            <div className="w-full py-4">
              <ComponentLoader />
            </div>
          }
          pagination
          paginationServer
          paginationTotalRows={
            busRegNo?.totalCount ? busRegNo?.totalCount : busRegNo?.searchCount
          }
          onChangeRowsPerPage={(perRow) => setLimit(perRow)}
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
    </>
  );
};

export default ProfileBusInfo;
