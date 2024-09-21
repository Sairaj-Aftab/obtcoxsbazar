import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createTouristBusPermission,
  getAllTouristBusPermission,
} from "../../features/touristBusPermission/touristBusPermissionApiSlice";
import {
  setMessageEmpty,
  touristBusPermissionsData,
} from "../../features/touristBusPermission/touristBusPermissionSlice";

const TouristBusEntryPermission = () => {
  const dispatch = useDispatch();
  const { message, error, loader } = useSelector(touristBusPermissionsData);
  const [formData, setFormData] = useState({
    applicantName: "",
    phone: "",
    institutionName: "",
    arrivalPlace: "",
    arrivalDateTime: "",
    numberTourist: "",
    numberBus: "",
    transportName: "",
    vehicleRegNo: "",
    destinationName: "",
    parkingPlace: "",
    returnDateTime: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      applicantName,
      phone,
      institutionName,
      arrivalPlace,
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
      !arrivalPlace ||
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
      dispatch(createTouristBusPermission(formData));
    }
  };

  useEffect(() => {
    dispatch(getAllTouristBusPermission({ page: 1, limit: 10 }));
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
      setFormData({
        applicantName: "",
        phone: "",
        institutionName: "",
        arrivalPlace: "",
        arrivalDateTime: "",
        numberTourist: "",
        numberBus: "",
        transportName: "",
        vehicleRegNo: "",
        destinationName: "",
        parkingPlace: "",
        returnDateTime: "",
        description: "",
      });
    }
    if (message || error) {
      dispatch(setMessageEmpty());
    }
  }, [dispatch, error, message]);

  return (
    <div className="bg-white p-6 rounded-lg sm:shadow-lg max-w-3xl w-full mx-auto sm:my-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-medium text-primary-color">
          Tourist Bus Entry Permission
        </h1>
        <Link
          to="/tourist-bus-entry-permission-list"
          className="bg-primary-color rounded-md py-1 px-2 text-white text-sm font-medium"
        >
          View recent entry list
        </Link>
      </div>
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
            Mobile No (মোবাইল নাম্বার উদাহরণস্বরূপ: 01320108413)
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
            Institution Name (প্রতিষ্ঠানের নাম)
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
            htmlFor="arrivalPlace"
            className="text-sm font-medium text-gray-600 block mb-1"
          >
            Arrival Place (আগমনের স্থান)
          </label>
          <input
            name="arrivalPlace"
            id="arrivalPlace"
            value={formData.arrivalPlace}
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
          <input
            type="text"
            id="parkingPlace"
            name="parkingPlace"
            value={formData.parkingPlace}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-color"
          />
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
                <li>১) আবেদনকারীকে অবশ্যই গাড়িতে থাকতে হবে।</li>
                <li>২) ট্রাফিক আইন মেনে চলতে হবে।</li>
                <li>
                  ৩) যাত্রী নামার সাথে সাথে বাস সুনির্দিষ্ট পার্কিং এ চলে যেতে
                  হবে।
                </li>
                <li>৪) সড়কের পাশে পার্কিং করা যাবে না।</li>
                <li>৫) যত্রতত্র আবর্জনা ফেলা যাবে না।</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-color text-white font-bold py-2 rounded disabled:bg-opacity-80"
          disabled={loader}
        >
          {loader ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default TouristBusEntryPermission;
