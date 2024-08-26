import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import UAParser from "ua-parser-js";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import PageLoader from "../../components/Loader/PageLoader";

const BusInfo = () => {
  const { id } = useParams();
  const [busInfo, setBusInfo] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [input, setInput] = useState({
    paribahanName: "",
    regNo: "",
    type: "",
    rating: "",
    name: "",
    phoneNumber: "",
    comment: "",
    tripTime: "",
    destination: "",
    phoneName: "",
    phoneModel: "",
    ipAddress: "",
  });

  const changeInputValue = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchDeviceInfo = () => {
      const userAgentString = navigator.userAgent;
      const parser = new UAParser();
      parser.setUA(userAgentString);
      const result = parser.getResult();

      setInput((prevInput) => ({
        ...prevInput,
        phoneName: result.device.vendor || "Unknown Vendor",
        phoneModel: result.device.model || "Unknown Model",
      }));
    };

    fetchDeviceInfo();
  }, []);

  useEffect(() => {
    const fetchBusInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/businfo/getbusinfo/${id}`
        );

        setInput((prevInput) => ({
          ...prevInput,
          paribahanName: response.data.busInfo.paribahanName,
          regNo: response.data.busInfo.regNo,
          type: response.data.busInfo.type,
        }));

        setBusInfo(response.data.busInfo);
      } catch (err) {
        setError("Failed to fetch bus info");
      }
    };

    fetchBusInfo();
  }, [id]);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setInput((prevInput) => ({
          ...prevInput,
          ipAddress: data.ip,
        }));
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIP();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage(null);
      setLoader(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/review/create/${id}`,
        input,
        { withCredentials: true }
      );
      setLoader(false);
      setMessage(response.data.message);
    } catch (err) {
      setError("Failed to submit review");
    }
  };

  if (error) return <div>{error}</div>;
  if (!busInfo || loader)
    return (
      <div>
        <PageLoader />
      </div>
    );
  return (
    <section className="bg-white p-6 rounded-lg sm:shadow-lg max-w-3xl w-full mx-auto sm:my-5">
      <div>
        <p>{message}</p>
        <h1 className="text-center text-primary-color text-xl font-medium">
          {busInfo.paribahanName}
        </h1>
        <p>Registration Number: {busInfo.regNo}</p>
        <p>Type: {busInfo.type}</p>
        {/* Add more fields if needed */}
      </div>
      {/* Review Section */}
      <form onSubmit={handleReviewSubmit} className="mb-4">
        <label className="block mb-2">Your Rating:</label>
        <input
          type="text"
          name="rating"
          value={input.rating}
          onChange={changeInputValue}
          placeholder="Rating"
        />
        <input
          type="text"
          placeholder="Your Name"
          name="name"
          value={input.name}
          onChange={changeInputValue}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Phone Number"
          name="phoneNumber"
          value={input.phoneNumber}
          onChange={changeInputValue}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Destination"
          name="destination"
          value={input.destination}
          onChange={changeInputValue}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="datetime-local"
          name="tripTime"
          value={input.tripTime}
          onChange={changeInputValue}
          placeholder="Trip time"
        />
        <textarea
          placeholder="Your Comment"
          name="comment"
          value={input.comment}
          onChange={changeInputValue}
          className="border p-2 mb-2 w-full"
        ></textarea>
        <button
          type="submit"
          className="bg-primary-color text-white py-2 px-4 rounded"
        >
          Submit Review
        </button>
      </form>
    </section>
  );
};

export default BusInfo;
