import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import {
  schedulesData,
  setMessageEmpty,
} from "../../features/schedules/schedulesSlice";
import {
  createSchedule,
  deleteSchedule,
  getSchedulesDataByAuthId,
  updateSchedule,
} from "../../features/schedules/schedulesApiSlice";
import { useEffect } from "react";
import { setNoticeMessageEmpty } from "../../features/notice/noticeSlice";
import Modal from "../../components/Modal/Modal";
import { getGuideInfo } from "../../features/guideInfo/guideInfoApiSlice";
import { getBusInfo } from "../../features/busInfo/busInfoApiSlice";
import { guideInfoData } from "../../features/guideInfo/guideInfoSlice";
import { paribahanAuthData } from "../../features/paribahanAuth/paribahanAuthSlice";
import { busInfoData } from "../../features/busInfo/busInfoSlice";
import { formatDateTime } from "../../utils/formatDateTime";
import Skeleton from "react-loading-skeleton";

const BusProfile = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { paribahanAuth: user } = useSelector(paribahanAuthData);

  const {
    authSchedules: schedules,
    authSchedulesCount,
    authSearchCount,
    leavingPlaces,
    destinationPlaces,
    authScheduleLoader,
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
    seatStatus: null,
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
  const [updateInput, setUpdateInput] = useState();
  const changeUpdateInputValue = (e) => {
    const { name, value } = e.target;
    setUpdateInput({ ...updateInput, [name]: value });
  };
  const handleOpenUpdateForm = (id) => {
    const data = schedules.find((schedule) => schedule.id === id);
    setId(data.id);
    setUpdateInput({
      ...data,
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
      !updateInput.rent
    ) {
      toast.error("All fields are required");
    } else {
      dispatch(updateSchedule({ id, data: updateInput }));
    }
  };

  const handleDeleteSchedule = (id) => {
    dispatch(deleteSchedule(id));
  };

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const handlePageChange = (page) => {
    setPage(page);
    dispatch(
      getSchedulesDataByAuthId({ id: user.id, page, limit: rowPage, search })
    );
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    dispatch(
      getSchedulesDataByAuthId({ id: user.id, page, limit: newPerPage, search })
    );
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(
      getSchedulesDataByAuthId({
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
      width: "40px",
    },
    {
      name: "Time",
      selector: (data) => formatDateTime(data.time),
      sortable: true,
    },
    {
      name: "Type",
      selector: (data) => data.type,
      sortable: true,
    },
    {
      name: "Reg No",
      selector: (data) => data.busNo,
      sortable: true,
    },
    {
      name: "Guide Name",
      selector: (data) => data.guideName,
      sortable: true,
    },
    {
      name: "Guide Phone",
      selector: (data) => data.guidePhone,
      sortable: true,
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
      name: "Rent",
      selector: (data) => `৳ ${data.rent ? data.rent : "--"}`,
      sortable: true,
    },
    {
      name: "Seat Status",
      selector: (data) => (data.seatStatus ? "Available" : "Booked"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (data) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => handleOpenUpdateForm(data.id)}
            className="bg-primary-color py-1 px-2 text-sm font-medium text-white rounded w-full"
          >
            <FaPencilAlt />
          </button>
          <button
            onClick={() => handleDeleteSchedule(data.id)}
            className="bg-red py-1 px-2 text-sm font-medium text-white rounded w-full"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      ),
      right: true, // Align the column to the right
    },
  ];

  useEffect(() => {
    if (user) {
      dispatch(getSchedulesDataByAuthId({ id: user.id, page: 1, limit: 100 }));
      dispatch(getBusInfo({ id: user.id, page: 1, limit: 100 }));
      dispatch(getGuideInfo({ id: user.id, page: 1, limit: 100 }));
    }
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
  }, [dispatch, message, error, user]);

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
                Add schedule
              </button>
            </div>
          </div>
          <DataTable
            columns={column}
            data={schedules}
            responsive
            progressPending={authScheduleLoader}
            progressComponent={
              <div className="w-full">
                <Skeleton height={200} />
              </div>
            }
            pagination
            paginationServer
            paginationTotalRows={
              authSchedulesCount ? authSchedulesCount : authSearchCount
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

export default BusProfile;
