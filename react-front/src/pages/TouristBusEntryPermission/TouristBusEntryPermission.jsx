import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { schedulesData } from "../../features/schedules/schedulesSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTouristBusPermission } from "../../services/touristBusPermission.service";
import { getSingleSettingByName } from "../../services/settings.service";
import ComponentLoader from "../../components/Loader/ComponentLoader";

const TouristBusEntryPermission = () => {
  const queryClient = useQueryClient();
  const { parkingPlaces } = useSelector(schedulesData);
  const [formData, setFormData] = useState({
    applicantName: "",
    phone: "",
    institutionName: "",
    arrivalDateTime: "",
    numberTourist: "",
    numberBus: "",
    transportName: "",
    vehicleRegNo: "",
    destinationName: "",
    parkingPlace: "",
    parkingPlaceMapLink: "",
    returnDateTime: "",
    description: "",
  });

  const { data: settingData, isLoading: settingLoading } = useQuery({
    queryKey: ["touristSetting", { name: "TOURIST-BUS-ENTRY-PERMISSION" }],
    queryFn: () => getSingleSettingByName("TOURIST-BUS-ENTRY-PERMISSION"),
  });

  const {
    mutateAsync: create,
    data,
    isSuccess,
    error: createError,
    isPending,
  } = useMutation({
    mutationFn: createTouristBusPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["touristBusPermissions"] });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "parkingPlace") {
      const selectedPlace = parkingPlaces.find(
        (place) => place.placeName === value
      );
      setFormData({
        ...formData,
        parkingPlace: value,
        parkingPlaceMapLink: selectedPlace ? selectedPlace.mapLink : "",
      });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      applicantName,
      phone,
      institutionName,
      arrivalDateTime,
      numberTourist,
      numberBus,
      transportName,
      vehicleRegNo,
      destinationName,
      parkingPlace,
      returnDateTime,
    } = formData;

    if (
      !applicantName ||
      !phone ||
      !institutionName ||
      !arrivalDateTime ||
      numberTourist < 1 ||
      numberBus < 1 ||
      !transportName ||
      !vehicleRegNo ||
      !destinationName ||
      !parkingPlace ||
      !returnDateTime
    ) {
      toast.error("All fields are required!");
    } else {
      await create(formData);
    }
  };

  useEffect(() => {
    if (isSuccess && data?.message) {
      toast.success(data?.message);
      setFormData({
        applicantName: "",
        phone: "",
        institutionName: "",
        arrivalDateTime: "",
        numberTourist: "",
        numberBus: "",
        transportName: "",
        vehicleRegNo: "",
        destinationName: "",
        parkingPlace: "",
        parkingPlaceMapLink: "",
        returnDateTime: "",
        description: "",
      });
    }
    if (createError) {
      toast.error(createError.message);
    }
  }, [data?.message, isSuccess, createError]);

  return (
    <div className="bg-white p-6 rounded-lg sm:shadow-lg max-w-3xl w-full mx-auto">
      {settingLoading && (
        <div className="h-[70vh]">
          <ComponentLoader />
        </div>
      )}
      {settingData?.setting?.status && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="applicantName"
              className="text-sm font-medium text-gray-600 block mb-1"
            >
              Applicant Name (আবেদনকারীর নাম)
            </label>
            <input
              type="text"
              id="applicantName"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-600 block mb-1"
            >
              Mobile No (মোবাইল নাম্বার)
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="institutionName"
              className="text-sm font-medium text-gray-600 block mb-1"
            >
              Institution/Address (প্রতিষ্ঠান/ঠিকানা)
            </label>
            <input
              name="institutionName"
              id="institutionName"
              value={formData.institutionName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="arrivalDateTime"
              className="text-sm font-medium text-gray-600 block mb-1"
            >
              Arrival Date & Time (আগমনের তারিখ ও সময়)
            </label>
            <input
              type="datetime-local"
              id="arrivalDateTime"
              name="arrivalDateTime"
              value={formData.arrivalDateTime}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="numberTourist"
              className="text-sm font-medium text-gray-600 block mb-1"
            >
              No of Tourists (পর্যটকের সংখ্যা)
            </label>
            <input
              type="number"
              id="numberTourist"
              name="numberTourist"
              value={formData.numberTourist}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="numberBus"
              className="text-sm font-medium text-gray-600 block mb-1"
            >
              No of Bus (বাসের সংখ্যা)
            </label>
            <input
              type="number"
              id="numberBus"
              name="numberBus"
              value={formData.numberBus}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="TransportName"
              className="text-sm font-medium text-gray-600 block mb-1"
            >
              Name of Transport (পরিবহনের নাম)
            </label>
            <input
              type="text"
              id="TransportName"
              name="transportName"
              value={formData.transportName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="vehicleRegNo"
              className="text-sm font-medium text-gray-600 block mb-1"
            >
              Reg No of Vehicle (গাড়ির নং)
            </label>
            <input
              type="text"
              id="vehicleRegNo"
              name="vehicleRegNo"
              value={formData.vehicleRegNo}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="destinationName"
              className="text-sm font-medium text-gray-600 block mb-1"
            >
              Destination (হোটেলের নাম)
            </label>
            <input
              type="text"
              id="destinationName"
              name="destinationName"
              value={formData.destinationName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="parkingPlace"
              className="text-sm font-medium text-gray-600 block mb-1"
            >
              Parking Place (পার্কিং এর স্থান)
            </label>
            <select
              name="parkingPlace"
              id="parkingPlace"
              value={formData.parkingPlace}
              required
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
            >
              <option value="">Select Parking Place</option>
              {parkingPlaces?.map((place, index) => (
                <option key={index} value={place?.placeName}>
                  {place?.placeName}
                </option>
              ))}
            </select>
            <select
              name="parkingPlaceMapLink"
              id="parkingPlaceMapLink"
              value={formData.parkingPlaceMapLink}
              onChange={handleChange}
              className="hidden"
            >
              <option value="">Parking Map Link</option>
              {parkingPlaces?.map((place, index) => (
                <option key={index} value={place?.mapLink}>
                  {place?.mapLink}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label
              htmlFor="returnDateTime"
              className="text-sm font-medium text-gray-600 block mb-1"
            >
              Return Date & Time (প্রস্থানের তারিখ ও সময়)
            </label>
            <input
              type="datetime-local"
              id="returnDateTime"
              name="returnDateTime"
              value={formData.returnDateTime}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-600 block mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              name="description"
              id="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
            ></textarea>
          </div>

          <div className="mb-3">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                required
                className="w-fit mt-1 mr-2 focus:ring-primary focus:outline-none peer"
              />
              <div>
                <label
                  htmlFor="agree"
                  className="text-sm font-medium text-gray-600 peer-checked:text-black"
                >
                  Terms & Condition (অবশ্যই পালনীয়)
                </label>
                <ul className="text-sm text-gray-600 list-disc list-inside mt-2">
                  <li>১) ট্রাফিক আইন মেনে চলতে হবে।</li>
                  <li>
                    ২) যাত্রী নামার সাথে সাথে বাস সুনির্দিষ্ট পার্কিং এ চলে যেতে
                    হবে।
                  </li>
                  <li>৩) সড়কের পাশে পার্কিং করা যাবে না।</li>
                  <li>৪) যত্রতত্র আবর্জনা ফেলা যাবে না।</li>
                  <li>৫) মেরিন ড্রাইভে বাস প্রবেশ করা যাবে না।</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-color text-white font-bold py-2 rounded disabled:bg-opacity-80"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
      {!settingData?.setting?.status && (
        <div className="h-[50vh] flex items-center justify-center">
          <h2 className="text-xl font-semibold text-red text-center">
            {settingData?.setting?.description}
          </h2>
        </div>
      )}
    </div>
  );
};

export default TouristBusEntryPermission;
