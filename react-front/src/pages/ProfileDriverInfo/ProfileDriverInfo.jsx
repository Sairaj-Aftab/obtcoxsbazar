import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  driverInfoData,
  setDriverInfoMessageEmpty,
} from "../../features/driverInfo/driverInfoSlice";
import {
  createDriverInfo,
  getDriverInfo,
  updateDriverInfo,
} from "../../features/driverInfo/driverInfoApiSlice";
import Modal from "../../components/Modal/Modal";
import { formatDateTime } from "../../utils/formatDateTime";
import { paribahanAuthData } from "../../features/paribahanAuth/paribahanAuthSlice";

const ProfileDriverInfo = () => {
  const { paribahanAuth: user } = useSelector(paribahanAuthData);
  const dispatch = useDispatch();
  const { driverInfo, message, error } = useSelector(driverInfoData);

  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [input, setInput] = useState({
    paribahanName: user?.paribahanName,
    name: "",
    phone: "",
    license: "",
    address: "",
    comment: "",
  });
  const changeInputValue = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (!input.name) {
      toast.error("Name is required!");
    } else {
      dispatch(createDriverInfo({ id: user.id, data: input }));
    }
  };

  const [id, setId] = useState();
  const [infoData, setInfoData] = useState();
  const changeInfoData = (e) => {
    const { name, value } = e.target;
    setInfoData({ ...infoData, [name]: value });
  };
  const handleOpenUpdateForm = (id) => {
    const data = driverInfo.find((info) => info.id === id);
    setId(data.id);
    setInfoData({
      ...data,
    });
    setShowUpdateModal(true);
  };
  const handleUpdateInfo = (e) => {
    e.preventDefault();
    if (!infoData.name) {
      toast.error("Name is required");
    } else {
      dispatch(updateDriverInfo({ id, data: infoData }));
    }
  };
  useEffect(() => {
    dispatch(getDriverInfo({ id: user?.id, limit: 100 }));
    if (message) {
      toast.success(message);
      setInput({
        name: "",
        phone: "",
        license: "",
        address: "",
        comment: "",
      });
    }
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(setDriverInfoMessageEmpty());
    };
  }, [message, error, dispatch]);
  return (
    <>
      <Toaster />
      {showModal && (
        <Modal title="Add Driver Info" close={() => setShowModal(false)}>
          <form
            onSubmit={handleSubmitInfo}
            className="flex flex-col gap-2 w-full p-2"
          >
            <input
              type="text"
              name="name"
              value={input.name}
              onChange={changeInputValue}
              placeholder="Driver Name"
            />
            <input
              type="text"
              name="phone"
              value={input.phone}
              onChange={changeInputValue}
              placeholder="Driver Phone Number"
            />
            <input
              type="text"
              name="license"
              value={input.license}
              onChange={changeInputValue}
              placeholder="DL No"
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
              placeholder="Driver Name"
            />
            <input
              type="text"
              name="phone"
              value={infoData.phone}
              onChange={changeInfoData}
              placeholder="Driver Phone Number"
            />
            <input
              type="text"
              name="license"
              value={infoData.license}
              onChange={changeInfoData}
              placeholder="DL No"
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
          <h1 className="text-lg font-semibold text-gray-700">Driver Info</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-color py-1 px-2 text-base font-medium text-white rounded"
          >
            Add driver info
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="mt-5 border border-gray-300 rounded-lg">
            <thead>
              <tr className="text-sm font-semibold bg-primary-color text-white">
                <th>#</th>
                <th>Driver Name</th>
                <th>Phone Number</th>
                <th>Driving License No</th>
                <th>Address</th>
                <th>Remark</th>
                <th>Entry Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {driverInfo
                ?.slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                ?.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data?.phone}</td>
                    <td>{data?.license}</td>
                    <td>{data?.address}</td>
                    <td>{data?.comment}</td>
                    <td>{formatDateTime(data.createdAt)}</td>
                    <td className="flex justify-end gap-1">
                      <button
                        onClick={() => handleOpenUpdateForm(data.id)}
                        className="bg-primary-color py-1 px-2 text-sm font-medium text-white rounded"
                      >
                        Edit
                      </button>
                      {/* <button
                      onClick={() => handleDeleteSchedule(data.id)}
                      className="bg-red py-1 px-2 text-sm font-medium text-white rounded"
                    >
                      Delete
                    </button> */}
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

export default ProfileDriverInfo;
