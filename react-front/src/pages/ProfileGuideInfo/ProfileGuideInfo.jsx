"use client";

import Modal from "@/components/Modal/Modal";
import {
  createGuideInfo,
  getGuideInfo,
  updateGuideInfo,
} from "@/lib/features/guideInfo/guideInfoApiSlice";
import {
  guideInfoData,
  setGuideInfoMessageEmpty,
} from "@/lib/features/guideInfo/guideInfoSlice";
import { formatDateTime } from "@/utils/formatDateTime";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const ProfileGuideInfo = ({ user }) => {
  const dispatch = useDispatch();
  const { guideInfo, message, error } = useSelector(guideInfoData);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [input, setInput] = useState({
    paribahanName: user.paribahanName,
    name: "",
    phone: "",
    address: "",
    comment: "",
  });
  const changeInputValue = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (!input.name || !input.phone) {
      toast.error("Name & Phone is required!");
    } else {
      dispatch(createGuideInfo({ id: user.id, data: input }));
    }
  };

  const [id, setId] = useState();
  const [infoData, setInfoData] = useState();
  const changeInfoData = (e) => {
    const { name, value } = e.target;
    setInfoData({ ...infoData, [name]: value });
  };
  const handleOpenUpdateForm = (id) => {
    const data = guideInfo.find((info) => info.id === id);
    setId(data.id);
    setInfoData({
      ...data,
    });
    setShowUpdateModal(true);
  };
  const handleUpdateInfo = (e) => {
    e.preventDefault();
    if (!infoData.name || !infoData.phone) {
      toast.error("All fields are required");
    } else {
      dispatch(updateGuideInfo({ id: Number(id), data: infoData }));
    }
  };

  useEffect(() => {
    dispatch(getGuideInfo({ id: user.id, limit: 100 }));
    if (message) {
      toast.success(message);
      setInput({
        name: "",
        phone: "",
        address: "",
        comment: "",
      });
    }
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(setGuideInfoMessageEmpty());
    };
  }, [message, error, dispatch]);
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
          <h1 className="text-lg font-semibold text-gray-700">Guide Info</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-color py-1 px-2 text-base font-medium text-white rounded"
          >
            Add guide info
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="mt-5 border border-gray-300 rounded-lg">
            <thead>
              <tr className="text-sm font-semibold bg-primary-color text-white">
                <th>#</th>
                <th>Guide Name</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Remark</th>
                <th>Entry Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guideInfo
                ?.slice()
                ?.sort((a, b) => a.name.localeCompare(b.name))
                ?.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.phone}</td>
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

export default ProfileGuideInfo;
