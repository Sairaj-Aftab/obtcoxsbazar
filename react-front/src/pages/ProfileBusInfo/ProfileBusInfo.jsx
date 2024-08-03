import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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

const ProfileBusInfo = () => {
  const { paribahanAuth: user } = useSelector(paribahanAuthData);
  const dispatch = useDispatch();
  const { busInfo, message, error } = useSelector(busInfoData);
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
      dispatch(updateBusInfo({ id: Number(id), data: infoData }));
    }
  };

  useEffect(() => {
    dispatch(getBusInfo({ id: user?.id, limit: 100 }));
    if (message) {
      toast.success(message);
      setInput({
        regNo: "",
        type: "",
        comment: "",
      });
    }
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(setBusInfoMessageEmpty());
    };
  }, [dispatch, message, error]);
  return (
    <>
      <Toaster />
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
              placeholder="Comment"
            />
            <button
              type="submit"
              className="bg-primary-color py-1 text-base font-medium text-white rounded"
            >
              Submit
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
              placeholder="Comment"
            />
            <button
              type="submit"
              className="bg-primary-color py-1 text-base font-medium text-white rounded"
            >
              Submit
            </button>
          </form>
        </Modal>
      )}
      <div className="container mx-auto bg-white p-5 my-5 rounded-lg">
        <div className="flex justify-between items-start">
          <h1 className="text-lg font-semibold text-gray-700">Bus Info</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-color py-1 px-2 text-base font-medium text-white rounded"
          >
            Add bus info
          </button>
        </div>
        <div className="overflow-x-auto">
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
        </div>
      </div>
    </>
  );
};

export default ProfileBusInfo;
