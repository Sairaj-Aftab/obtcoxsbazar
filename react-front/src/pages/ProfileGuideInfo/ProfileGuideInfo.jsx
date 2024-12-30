import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../../components/Modal/Modal";
import { formatDateTime } from "../../utils/formatDateTime";
import DataTable from "react-data-table-component";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGuideInfo,
  getGuideInfo,
  updateGuideInfo,
} from "../../services/guideInfo.service";
import ComponentLoader from "../../components/Loader/ComponentLoader";
import useParibahanAuth from "../../store/useParibahanAuth";

const ProfileGuideInfo = () => {
  const queryClient = useQueryClient();
  const { paribahanAuth: user } = useParibahanAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(500);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [input, setInput] = useState({
    paribahanName: user?.paribahanName,
    name: "",
    phone: "",
    address: "",
    comment: "",
  });
  const { data: guide, isLoading: guideLoading } = useQuery({
    queryKey: ["guide", { id: user.id, page, limit, search }],
    queryFn: () => getGuideInfo({ id: user.id, page, limit, search }),
  });
  const {
    mutateAsync: createGuide,
    data: createData,
    isSuccess: createSuccess,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: createGuideInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guide"] });
    },
  });
  const {
    mutateAsync: updateGuide,
    data: updateData,
    isSuccess: updateSuccess,
    error: updateError,
    isPending: updateLoading,
  } = useMutation({
    mutationFn: updateGuideInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guide"] });
      setShowUpdateModal(false);
    },
  });

  const changeInputValue = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    if (!input.name || !input.phone) {
      toast.error("Name & Phone is required!");
    } else {
      await createGuide({ id: user.id, data: input });
    }
  };

  const [id, setId] = useState();
  const [infoData, setInfoData] = useState();
  const changeInfoData = (e) => {
    const { name, value } = e.target;
    setInfoData({ ...infoData, [name]: value });
  };
  const handleOpenUpdateForm = (id) => {
    const data = guide?.guideInfo.find((info) => info.id === id);
    setId(data.id);
    setInfoData({
      ...data,
    });
    setShowUpdateModal(true);
  };
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (!infoData.name || !infoData.phone) {
      toast.error("All fields are required");
    } else {
      await updateGuide({ id, data: infoData });
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
      name: "Name",
      selector: (data) => data.name,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (data) => data.phone,
      sortable: true,
    },
    {
      name: "Address",
      selector: (data) => data.address,
      sortable: true,
    },
    {
      name: "Remark",
      selector: (data) => data.comment,
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
        <div className="flex justify-end gap-1">
          <button
            onClick={() => handleOpenUpdateForm(data.id)}
            className="bg-primary-color py-1 px-2 text-sm font-medium text-white rounded"
          >
            Edit
          </button>
        </div>
      ),
      right: true, // Align the column to the right
    },
  ];

  useEffect(() => {
    if (createSuccess && createData?.message) {
      toast.success(createData?.message);
      setInput({
        name: "",
        phone: "",
        address: "",
        comment: "",
      });
      setShowUpdateModal(false);
    }
    if (updateSuccess && updateData?.message) {
      toast.success(updateData?.message);
    }
    if (createError || updateError) {
      toast.error(createError.message || updateError.message);
    }
  }, [
    createSuccess,
    createData?.message,
    createError,
    updateSuccess,
    updateData?.message,
    updateError,
  ]);
  return (
    <>
      <Toaster />
      {showModal && (
        <Modal title="Add Guide Info" close={() => setShowModal(false)}>
          <form
            onSubmit={handleSubmitInfo}
            className="flex flex-col gap-2 w-full p-2"
          >
            <input
              type="text"
              name="name"
              value={input.name}
              onChange={changeInputValue}
              placeholder="Guide Name"
            />
            <input
              type="text"
              name="phone"
              value={input.phone}
              onChange={changeInputValue}
              placeholder="Guide Phone Number"
            />
            <input
              type="text"
              name="address"
              value={input.address}
              onChange={changeInputValue}
              placeholder="Address"
            />
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
              disabled={createLoading}
            >
              {createLoading ? "Adding..." : "Add"}
            </button>
          </form>
        </Modal>
      )}
      {showUpdateModal && (
        <Modal title="Edit Driver Info" close={() => setShowUpdateModal(false)}>
          <form
            onSubmit={handleUpdateInfo}
            className="flex flex-col gap-2 w-full p-2"
          >
            <input
              type="text"
              name="name"
              value={infoData.name}
              onChange={changeInfoData}
              placeholder="Guide Name"
            />
            <input
              type="text"
              name="phone"
              value={infoData.phone}
              onChange={changeInfoData}
              placeholder="Guide Phone Number"
            />
            <input
              type="text"
              name="address"
              value={infoData.address}
              onChange={changeInfoData}
              placeholder="Address"
            />
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
              {updateLoading ? "Updating..." : "Edit"}
            </button>
          </form>
        </Modal>
      )}
      <div className="container mx-auto bg-white p-5 my-5 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-lg font-semibold text-gray-700">Guide Info</h1>
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
              Add guide info
            </button>
          </div>
        </div>
        <DataTable
          columns={column}
          data={guide?.guideInfo
            ?.slice()
            .sort((a, b) => a.name.localeCompare(b.name))}
          responsive
          progressPending={guideLoading}
          progressComponent={
            <div className="w-full py-4">
              <ComponentLoader />
            </div>
          }
          pagination
          paginationServer
          paginationTotalRows={guide?.count ? guide?.count : guide?.searchCount}
          onChangeRowsPerPage={(newPerPage) => setLimit(newPerPage)}
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

export default ProfileGuideInfo;
