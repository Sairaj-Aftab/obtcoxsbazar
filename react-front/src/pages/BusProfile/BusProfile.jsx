import { useState } from "react";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import locationIcon from "../../assets/icon/location.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Modal from "../../components/Modal/Modal";
import { formatDateTime } from "../../utils/formatDateTime";
import {
  createSchedule,
  deleteSchedule,
  getSchedulesDataByAuthId,
  updateSchedule,
} from "../../services/schedules.service";
import { getBusRegNo } from "../../services/busRegNo.service";
import { getGuideInfo } from "../../services/guideInfo.service";
import ComponentLoader from "../../components/Loader/ComponentLoader";
import { getDriverInfo } from "../../services/driverInof.service";
import usePlaces from "../../store/usePlaces";
import useParibahanAuth from "../../store/useParibahanAuth";

const BusProfile = () => {
  const queryClient = useQueryClient();
  const { paribahanAuth: user } = useParibahanAuth();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const { leavingPlaces, destinationPlaces } = usePlaces();
  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ["authSchedules", { id: user.id, page, limit, search }],
    queryFn: () =>
      getSchedulesDataByAuthId({ id: user.id, page, limit, search }),
  });

  const { data: busRegNo } = useQuery({
    queryKey: ["busRegNo", { id: user.id, page, limit }],
    queryFn: () => getBusRegNo({ id: user.id, page: 1, limit: 200 }),
  });
  const { data: guide } = useQuery({
    queryKey: ["guide", { id: user.id, page, limit }],
    queryFn: () => getGuideInfo({ id: user.id, page: 1, limit: 200 }),
  });
  const { data: driver } = useQuery({
    queryKey: ["driverInfo", { id: user.id, page: 1, limit: 200 }],
    queryFn: () => getDriverInfo({ id: user.id, page: 1, limit: 200 }),
  });

  const {
    mutateAsync: create,
    data: createData,
    isSuccess: createSuccess,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: createSchedule,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["authSchedules", { id: user.id, page, limit, search }],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: [data?.busSchedule, ...oldData.schedules],
        })
      );
      queryClient.setQueryData(
        ["schedules"],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: [data?.busSchedule, ...oldData.schedules],
        })
      );
    },
  });
  const {
    mutateAsync: updateData,
    data: updatedData,
    isSuccess: updateSuccess,
    isPending: updateLoading,
    error: updateError,
  } = useMutation({
    mutationFn: updateSchedule,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["authSchedules", { id: user.id, page, limit, search }],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: oldData.schedules.map((item) =>
            item.id === data?.busSchedule.id ? data?.busSchedule : item
          ),
        })
      );
      queryClient.setQueryData(
        ["schedules"],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: oldData.schedules.map((item) =>
            item.id === data?.busSchedule.id ? data?.busSchedule : item
          ),
        })
      );
      setShowUpdateModal(false);
    },
  });

  const { mutateAsync: deleteData } = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["authSchedules", { id: user.id, page, limit, search }],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: oldData.schedules.filter(
            (item) => item.id !== data?.schedule.id
          ),
        })
      );
      queryClient.setQueryData(
        ["schedules"],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: oldData.schedules.filter(
            (item) => item.id !== data?.schedule.id
          ),
        })
      );
    },
  });

  const [input, setInput] = useState({
    busName: user?.paribahanName,
    time: "",
    busNo: "",
    type: "",
    leavingPlace: "",
    leavingMapLink: "",
    destinationPlace: "",
    destinationMapLink: "",
    guideName: "",
    guidePhone: "",
    driverName: "",
    driverPhone: "",
    rent: "",
    discountRent: "",
    seatStatus: null,
  });

  const changeInputValue = (e) => {
    const { name, value } = e.target;

    if (name === "guideName") {
      const selectedGuide = guide?.guideInfo.find(
        (guide) => guide.name === value
      );
      if (selectedGuide) {
        setInput({
          ...input,
          guideName: selectedGuide.name,
          guidePhone: selectedGuide.phone,
        });
      } else {
        setInput({ ...input, guideName: value, guidePhone: "" });
      }
    } else if (name === "driverName") {
      const selectedDriver = driver?.driverInfo.find(
        (driver) => driver.name === value
      );
      if (selectedDriver) {
        setInput({
          ...input,
          driverName: selectedDriver.name,
          driverPhone: selectedDriver.phone,
        });
      } else {
        setInput({ ...input, driverName: value, driverPhone: "" });
      }
    } else if (name === "leavingPlace") {
      const selectedPlace = leavingPlaces?.places?.find(
        (place) => place.placeName === value
      );
      setInput({
        ...input,
        leavingPlace: value,
        leavingMapLink: selectedPlace ? selectedPlace.mapLink : "",
      });
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const handleSubmitSchedule = async (e) => {
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
      await create({ id: user.id, data: input });
    }
  };

  const [id, setId] = useState();
  const [updateInput, setUpdateInput] = useState();
  const changeUpdateInputValue = (e) => {
    const { name, value } = e.target;

    if (name === "leavingPlace") {
      const selectedPlace = leavingPlaces?.places?.find(
        (place) => place.placeName === value
      );
      setUpdateInput({
        ...updateInput,
        leavingPlace: value,
        leavingMapLink: selectedPlace ? selectedPlace.mapLink : "",
      });
    } else {
      setUpdateInput({ ...updateInput, [name]: value });
    }
  };

  const handleOpenUpdateForm = (id) => {
    const data = schedules?.schedules?.find((schedule) => schedule.id === id);
    setId(data.id);
    setUpdateInput({
      ...data,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSchedule = async (e) => {
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
      await updateData({ id, data: updateInput });
    }
  };

  const handleDeleteSchedule = async (id) => {
    await deleteData(id);
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
      width: "125px",
      sortable: true,
    },
    {
      name: "Driver Name",
      selector: (data) => data.driverName,
      sortable: true,
    },
    {
      name: "Driver Phone",
      selector: (data) => data.driverPhone,
      width: "125px",
      sortable: true,
    },
    {
      name: "Departure Place",
      // selector: (data) => data,
      cell: (data) => {
        return (
          <a
            href={data.leavingMapLink}
            className="w-full flex items-center gap-1 text-primary-color"
          >
            {data.leavingMapLink && (
              <img src={locationIcon} alt="" className="w-6" />
            )}
            <span>{data.leavingPlace}</span>
          </a>
        );
      },
      width: "180px",
    },
    {
      name: "Destination",
      selector: (data) => data.destinationPlace,
      sortable: true,
    },
    {
      name: "Fare",
      cell: (data) => (
        <p className="w-full flex flex-col text-center">
          <span>{`৳ ${
            data.discountRent ? data.discountRent : data.rent
          }`}</span>
          {data.discountRent > 0 && data.discountRent !== data.rent && (
            <div className="text-red -mt-2">
              ৳ <span className="line-through text-xs">{data.rent}</span>
            </div>
          )}
        </p>
      ),
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
    if (createSuccess && createData?.message) {
      toast.success(createData?.message);
      setInput({
        busName: user?.paribahanName,
        time: "",
        busNo: "",
        type: "",
        leavingPlace: "",
        leavingMapLink: "",
        destinationPlace: "",
        destinationMapLink: "",
        guideName: "",
        guidePhone: "",
        driverName: "",
        driverPhone: "",
        rent: "",
        discountRent: "",
        seatStatus: "",
      });
      setShowUpdateModal(false);
    }
    if (updateSuccess && updatedData?.message) {
      toast.success(updatedData?.message);
    }
    if (createError || updateError) {
      toast.error(createError?.message || updateError?.message);
    }
  }, [
    user,
    createData?.message,
    createError,
    createSuccess,
    updatedData?.message,
    updateSuccess,
    updateError,
  ]);

  return (
    <>
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
              {busRegNo?.busInfo?.map((data, index) => (
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
              {guide?.guideInfo?.map((data, index) => (
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
              {guide?.guideInfo?.map((data, index) => (
                <option key={index} value={data.phone}>
                  {data.phone}
                </option>
              ))}
            </select>
            <select
              name="driverName"
              id="driverName"
              value={input.driverName}
              onChange={changeInputValue}
            >
              <option value="">Driver Name</option>
              {driver?.driverInfo?.map((data, index) => (
                <option key={index} value={data.name}>
                  {data.name}
                </option>
              ))}
            </select>
            <select
              name="driverPhone"
              id="driverPhone"
              value={input.driverPhone}
              disabled
            >
              <option value="">Driver Phone</option>
              {driver?.driverInfo?.map((data, index) => (
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
              <option value="Double Decker">Double Decker</option>
              <option value="Suite Class">Suite Class</option>
              <option value="Hyundai Biz Class">Hyundai Biz Class</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
            </select>
            <select
              name="leavingPlace"
              id="leavingPlace"
              value={input.leavingPlace}
              onChange={changeInputValue}
            >
              <option value="">Departure Place</option>
              {leavingPlaces?.places?.map((place, index) => (
                <option key={index} value={place?.placeName}>
                  {place?.placeName}
                </option>
              ))}
            </select>
            <select
              name="leavingMapLink"
              id="leavingPlace"
              value={input.leavingMapLink}
              onChange={changeInputValue}
              className="hidden"
            >
              <option value="">Leaving Map Link</option>
              {leavingPlaces?.places?.map((place, index) => (
                <option key={index} value={place?.mapLink}>
                  {place?.mapLink}
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
              {destinationPlaces?.places?.map((place, index) => (
                <option key={index} value={place?.placeName}>
                  {place?.placeName}
                </option>
              ))}
            </select>
            {/* For desktop view */}
            <div className="hidden sm:flex gap-2">
              <input
                type="number"
                name="rent"
                value={input.rent}
                onChange={changeInputValue}
                placeholder="৳ Regular Price"
                onInput={(e) => {
                  if (e.target.value.length > 4)
                    e.target.value = e.target.value.slice(0, 4); // Restrict input to 4 digits
                }}
              />
              <input
                type="number"
                name="discountRent"
                value={input.discountRent}
                onChange={changeInputValue}
                placeholder="৳ Discount Price (Optional)"
                onInput={(e) => {
                  if (e.target.value.length > 4)
                    e.target.value = e.target.value.slice(0, 4); // Restrict input to 4 digits
                }}
              />
            </div>
            {/* For Mobile view */}
            <div className="flex sm:hidden gap-2">
              <input
                type="number"
                name="rent"
                value={input.rent}
                onChange={changeInputValue}
                placeholder="৳ Reg. Price"
                onInput={(e) => {
                  if (e.target.value.length > 4)
                    e.target.value = e.target.value.slice(0, 4); // Restrict input to 4 digits
                }}
              />
              <input
                type="number"
                name="discountRent"
                value={input.discountRent}
                onChange={changeInputValue}
                placeholder="৳ Dis. Price (Optional)"
                onInput={(e) => {
                  if (e.target.value.length > 4)
                    e.target.value = e.target.value.slice(0, 4); // Restrict input to 4 digits
                }}
              />
            </div>
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
              disabled={createLoading}
            >
              {createLoading ? "Loading..." : "Submit"}
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
                  <option value="Double Decker">Double Decker</option>
                  <option value="Suite Class">Suite Class</option>
                  <option value="Hyundai Biz Class">Hyundai Biz Class</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
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
                <label htmlFor="driverName">Driver Name</label>
                <input
                  type="text"
                  name="driverName"
                  value={updateInput.driverName}
                  onChange={changeUpdateInputValue}
                  placeholder="Driver Name"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="driverPhone">Driver Phone</label>
                <input
                  type="text"
                  name="driverPhone"
                  value={updateInput.driverPhone}
                  onChange={changeUpdateInputValue}
                  placeholder="Driver Phone"
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
                  {leavingPlaces?.places?.map((place, index) => (
                    <option key={index} value={place?.placeName}>
                      {place?.placeName}
                    </option>
                  ))}
                </select>
                <select
                  name="leavingMapLink"
                  id="leavingMapLink"
                  value={updateInput.leavingMapLink}
                  onChange={changeUpdateInputValue}
                  className="hidden"
                >
                  <option value="">Leaving Map Link</option>
                  {leavingPlaces?.places?.map((place, index) => (
                    <option key={index} value={place?.mapLink}>
                      {place?.mapLink}
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
                  {destinationPlaces?.places?.map((place, index) => (
                    <option key={index} value={place?.placeName}>
                      {place?.placeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-between items-center">
              <div className="w-1/2">
                <label htmlFor="rent" className="hidden sm:block">
                  ৳ Regular Price
                </label>
                <label htmlFor="rent" className="sm:hidden">
                  ৳ Reg. Price
                </label>
                <input
                  type="number"
                  name="rent"
                  value={updateInput.rent}
                  onChange={changeUpdateInputValue}
                  placeholder="৳ Regular Price"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="rent" className="hidden sm:block">
                  ৳ Discount Price
                </label>
                <label htmlFor="rent" className="sm:hidden">
                  ৳ Dis. Price
                </label>
                <input
                  type="number"
                  name="discountRent"
                  value={updateInput.discountRent}
                  onChange={changeUpdateInputValue}
                  placeholder="৳ Discount Price (Optional)"
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
              disabled={updateLoading}
            >
              {updateLoading ? "Updating..." : "Update"}
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
                onChange={(e) => setSearch(e.target.value)}
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
            data={schedules?.schedules}
            responsive
            progressPending={schedulesLoading}
            progressComponent={
              <div className="w-full py-4">
                <ComponentLoader />
              </div>
            }
            pagination
            paginationServer
            paginationTotalRows={
              schedules?.count ? schedules?.count : schedules?.searchCount
            }
            onChangeRowsPerPage={(rowsPerPage) => setLimit(rowsPerPage)}
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

export default BusProfile;
