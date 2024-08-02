"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/components/Modal/Modal";
import {
  createSchedule,
  deleteSchedule,
  getSchedulesDataByAuthId,
  updateSchedule,
} from "@/lib/features/schedules/schedulesApiSlice";
import {
  schedulesData,
  setMessageEmpty,
} from "@/lib/features/schedules/schedulesSlice";
import { formatDateTime } from "@/utils/formatDateTime";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setNoticeMessageEmpty } from "@/lib/features/notice/noticeSlice";
import { busInfoData } from "@/lib/features/busInfo/busInfoSlice";
import { guideInfoData } from "@/lib/features/guideInfo/guideInfoSlice";
import { getGuideInfo } from "@/lib/features/guideInfo/guideInfoApiSlice";
import { getBusInfo } from "@/lib/features/busInfo/busInfoApiSlice";

const BusProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const {
    authSchedules: schedules,
    leavingPlaces,
    destinationPlaces,
    message,
    error,
  } = useSelector(schedulesData);
  const { busInfo } = useSelector(busInfoData);
  const { guideInfo } = useSelector(guideInfoData);
  const [input, setInput] = useState({
    busName: user?.paribahanName,
    time: "",
    busNo: "",
    type: "",
    leavingPlace: "",
    destinationPlace: "",
    guideName: "",
    guidePhone: "",
    rent: "",
    seatStatus: "",
  });
  const [updateInput, setUpdateInput] = useState({
    time: "",
    busNo: "",
    type: "",
    leavingPlace: "",
    destinationPlace: "",
    guideName: "",
    guidePhone: "",
    rent: "",
    seatStatus: "",
  });
  const changeInputValue = (e) => {
    const { name, value } = e.target;

    if (name === "guideName") {
      const selectedGuide = guideInfo.find((guide) => guide.name === value);
      if (selectedGuide) {
        setInput({
          ...input,
          guideName: selectedGuide.name,
          guidePhone: selectedGuide.phone,
        });
      } else {
        setInput({ ...input, guideName: value, guidePhone: "" });
      }
    } else {
      setInput({ ...input, [name]: value });
    }
  };
  const changeUpdateInputValue = (e) => {
    const { name, value } = e.target;
    setUpdateInput({ ...updateInput, [name]: value });
  };

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    if (
      !input.busName ||
      !input.time ||
      !input.busNo ||
      !input.type ||
      !input.leavingPlace ||
      !input.destinationPlace ||
      !input.guideName ||
      !input.guidePhone ||
      !input.rent ||
      !input.seatStatus
    ) {
      toast.error("All fields are required");
    } else {
      dispatch(createSchedule({ id: user.id, data: input }));
    }
  };

  const [id, setId] = useState();
  const handleOpenUpdateForm = (id) => {
    const data = schedules.find((schedule) => schedule.id === id);
    setId(data.id);
    setUpdateInput({
      time: data.time,
      busNo: data.busNo,
      type: data.type,
      leavingPlace: data.leavingPlace,
      destinationPlace: data.destinationPlace,
      guideName: data.guideName,
      guidePhone: data.guidePhone,
      rent: data.rent,
      seatStatus: data.seatStatus,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSchedule = (e) => {
    e.preventDefault();
    if (
      !updateInput.time ||
      !updateInput.busNo ||
      !updateInput.type ||
      !updateInput.leavingPlace ||
      !updateInput.destinationPlace ||
      !updateInput.guideName ||
      !updateInput.guidePhone ||
      !updateInput.rent ||
      !updateInput.seatStatus
    ) {
      toast.error("All fields are required");
    } else {
      dispatch(updateSchedule({ id: Number(id), data: updateInput }));
    }
  };

  const handleDeleteSchedule = (id) => {
    dispatch(deleteSchedule(id));
  };

  useEffect(() => {
    if (user) {
      dispatch(getSchedulesDataByAuthId({ id: user.id, limit: 100 }));
    }
    dispatch(getBusInfo({ id: user.id, limit: 100 }));
    dispatch(getGuideInfo({ id: user.id, limit: 100 }));
    if (message) {
      toast.success(message);
      setInput({
        busName: user?.paribahanName,
        time: "",
        busNo: "",
        type: "",
        leavingPlace: "",
        destinationPlace: "",
        guideName: "",
        guidePhone: "",
        rent: "",
        seatStatus: "",
      });
      setShowUpdateModal(false);
    }
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(setMessageEmpty());
      dispatch(setNoticeMessageEmpty());
    };
  }, [dispatch, message, error]);

  return (
    <>
      <Toaster />
      {showModal && (
        <Modal title="Add Schedule" close={() => setShowModal(false)}>
          <form
            onSubmit={handleSubmitSchedule}
            className="flex flex-col gap-2 w-full p-2"
          >
            <input
              type="text"
              name="busName"
              value={user?.paribahanName}
              // onChange={changeInputValue}
              placeholder="Paribahan Name"
            />
            <select
              name="busNo"
              id="busNo"
              value={input.busNo}
              onChange={changeInputValue}
            >
              <option value="">Reg No.</option>
              {busInfo?.map((data, index) => (
                <option key={index} value={data.regNo}>
                  {data.regNo}
                </option>
              ))}
            </select>
            <select
              name="guideName"
              id="guideName"
              value={input.guideName}
              onChange={changeInputValue}
            >
              <option value="">Guide Name</option>
              {guideInfo?.map((data, index) => (
                <option key={index} value={data.name}>
                  {data.name}
                </option>
              ))}
            </select>
            <select
              name="guidePhone"
              id="guidePhone"
              value={input.guidePhone}
              disabled
            >
              <option value="">Guide Phone</option>
              {guideInfo?.map((data, index) => (
                <option key={index} value={data.phone}>
                  {data.phone}
                </option>
              ))}
            </select>

            <div>
              <label htmlFor="time">Starting Time</label>
              <input
                id="time"
                type="datetime-local"
                name="time"
                value={input.time}
                min={new Date().toISOString().slice(0, 16)}
                onChange={changeInputValue}
                placeholder="Starting Time"
              />
            </div>
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
            </select>
            <select
              name="leavingPlace"
              id="leavingPlace"
              value={input.leavingPlace}
              onChange={changeInputValue}
            >
              <option value="">Departure Place</option>
              {leavingPlaces?.map((place, index) => (
                <option key={index} value={place?.placeName}>
                  {place?.placeName}
                </option>
              ))}
            </select>
            <select
              name="destinationPlace"
              id="destinationPlace"
              value={input.destinationPlace}
              onChange={changeInputValue}
            >
              <option value="">Destination</option>
              {destinationPlaces?.map((place, index) => (
                <option key={index} value={place?.placeName}>
                  {place?.placeName}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="rent"
              value={input.rent}
              onChange={changeInputValue}
              placeholder="Rent ৳"
            />
            <select
              name="seatStatus"
              id="seatStatus"
              value={input.seatStatus}
              onChange={changeInputValue}
            >
              <option value="">Seat Status</option>
              <option value={true}>Available</option>
              <option value={false}>Booked</option>
            </select>
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
        <Modal title="Edit Schedule" close={() => setShowUpdateModal(false)}>
          <form
            onSubmit={handleUpdateSchedule}
            className="flex flex-col gap-2 w-full p-2"
          >
            <div>
              <label htmlFor="time">Starting Time</label>
              <input
                id="time"
                type="datetime-local"
                name="time"
                value={updateInput.time}
                min={new Date().toISOString().slice(0, 16)}
                onChange={changeUpdateInputValue}
                placeholder="Starting Time"
              />
            </div>
            <div className="flex gap-3 justify-between items-center">
              <div className="w-1/2">
                <label htmlFor="busNo">Reg No.</label>
                <input
                  type="text"
                  id="busNo"
                  name="busNo"
                  value={updateInput.busNo}
                  onChange={changeUpdateInputValue}
                  placeholder="Bus No."
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="type">Bus Type</label>
                <select
                  name="type"
                  id="type"
                  value={updateInput.type}
                  onChange={changeUpdateInputValue}
                >
                  <option value="">Bus Type</option>
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                  <option value="Sleeper Coach">Sleeper Coach</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-between items-center">
              <div className="w-1/2">
                <label htmlFor="guideName">Guide Name</label>
                <input
                  type="text"
                  name="guideName"
                  value={updateInput.guideName}
                  onChange={changeUpdateInputValue}
                  placeholder="Guide Name"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="guidePhone">Guide Phone</label>
                <input
                  type="text"
                  name="guidePhone"
                  value={updateInput.guidePhone}
                  onChange={changeUpdateInputValue}
                  placeholder="Guide Phone"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-between items-center">
              <div className="w-1/2">
                <label htmlFor="leavingPlace">Departure Place</label>
                <select
                  name="leavingPlace"
                  id="leavingPlace"
                  value={updateInput.leavingPlace}
                  onChange={changeUpdateInputValue}
                >
                  <option value="">Leaving Place</option>
                  {leavingPlaces?.map((place, index) => (
                    <option key={index} value={place?.placeName}>
                      {place?.placeName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label htmlFor="destinationPlace">Destination Place</label>
                <select
                  name="destinationPlace"
                  id="destinationPlace"
                  value={updateInput.destinationPlace}
                  onChange={changeUpdateInputValue}
                >
                  <option value="">Destination</option>
                  {destinationPlaces?.map((place, index) => (
                    <option key={index} value={place?.placeName}>
                      {place?.placeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-between items-center">
              <div className="w-1/2">
                <label htmlFor="rent">৳ Rent</label>
                <input
                  type="number"
                  name="rent"
                  value={updateInput.rent}
                  onChange={changeUpdateInputValue}
                  placeholder="Rent ৳"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="seatStatus">Seat Status</label>
                <select
                  name="seatStatus"
                  id="seatStatus"
                  value={updateInput.seatStatus}
                  onChange={changeUpdateInputValue}
                >
                  <option value="">Seat Status</option>
                  <option value={true}>Available</option>
                  <option value={false}>Booked</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary-color py-1 text-base font-medium text-white rounded"
            >
              Edit
            </button>
          </form>
        </Modal>
      )}
      <div className="container mx-auto bg-white p-5 my-5 rounded-lg">
        {/* Table Body */}
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-lg font-semibold text-gray-700">
              Schedule List
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-color py-1 px-2 text-base font-medium text-white rounded"
            >
              Add schedule
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="mt-5 border border-gray-300 rounded-lg">
              <thead>
                <tr className="text-sm font-semibold bg-primary-color text-white">
                  <th>#</th>
                  <th>Time</th>
                  <th>Bus Type</th>
                  <th>Bus No</th>
                  <th>Departure Place</th>
                  <th>Destination</th>
                  <th>Rent</th>
                  <th>Guide Name</th>
                  <th>Guide Mobile No</th>
                  <th>Seat Status</th>
                  <th>Entry Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules?.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{formatDateTime(data.time)}</td>
                    <td>{data.type}</td>
                    <td>{data.busNo}</td>
                    <td>{data.leavingPlace}</td>
                    <td>{data.destinationPlace}</td>
                    <td>৳ {data.rent}</td>
                    <td>{data.guideName}</td>
                    <td>{data.guidePhone}</td>

                    <td>{data.seatStatus ? "Available" : "Booked"}</td>
                    <td>{formatDateTime(data.createdAt)}</td>
                    <td className="flex justify-end gap-1">
                      <button
                        onClick={() => handleOpenUpdateForm(data.id)}
                        className="bg-primary-color py-1 px-2 text-sm font-medium text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(data.id)}
                        className="bg-red py-1 px-2 text-sm font-medium text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusProfile;
