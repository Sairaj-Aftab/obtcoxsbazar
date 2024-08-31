import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import UAParser from "ua-parser-js";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import PageLoader from "../../components/Loader/PageLoader";

// Function to get rating comment
const getRatingComment = (rating) => {
  switch (rating) {
    case "1":
      return "Very Bad";
    case "2":
      return "Bad";
    case "3":
      return "Good";
    case "4":
      return "Very Good";
    case "5":
      return "Excellent";
    default:
      return "";
  }
};

const BusComReviewByQR = () => {
  const { id } = useParams();
  const [busInfo, setBusInfo] = useState(null);
  const [totalReview, setTotalReview] = useState(0);
  const [averageReview, setAverageReview] = useState(0);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [input, setInput] = useState({
    paribahanName: "",
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

  // Device Info
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

  // get Bus Information
  useEffect(() => {
    const fetchBusInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/paribahan/getreviewbyqr/${id}`
        );

        setInput((prevInput) => ({
          ...prevInput,
          paribahanName: response.data.paribahanUser.paribahanName,
        }));

        setTotalReview(response.data.totalReviewCount);
        setAverageReview(response.data.averageRating);
        setBusInfo(response.data.paribahanUser);
      } catch (err) {
        setError("Failed to fetch bus info");
      }
    };

    fetchBusInfo();
  }, [id]);

  // Get IP Address
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
        setError("Failed to fetch IP address.");
      }
    };

    fetchIP();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!input.rating || !input.name) {
      toast.error("Rating & name are required!");
    } else if (message) {
      toast.error("Review already submitted!");
    } else {
      try {
        setLoader(true);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/review/create/${id}`,
          input,
          { withCredentials: true }
        );
        toast.success(response.data.message);
        setMessage("Review submitted successfully.");
      } catch (err) {
        toast.error("Please try again!");
      } finally {
        setInput({
          name: "",
          phoneNumber: "",
          comment: "",
          tripTime: "",
          destination: "",
        });
        setLoader(false);
      }
    }
  };

  if (!busInfo)
    return (
      <div>
        <PageLoader />
      </div>
    );
  return (
    <section className="p-3 rounded-lg max-w-3xl w-full mx-auto sm:my-5">
      <div className="bg-white rounded-md p-3 shadow-md">
        <h1 className="text-center text-primary-color text-xl font-medium mb-2">
          {busInfo.paribahanName}
        </h1>
        <table>
          <tbody>
            <tr className="p-0.5">
              <td className="text-base text-gray-800 font-bold flex justify-between gap-1">
                <span>Average rating</span> <span>:</span>
              </td>
              <td className="text-base font-bold pl-1 text-primary-color">
                <div className="flex gap-2">
                  <div className="flex items-center text-primary-color">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`${
                          index < Math.round(averageReview)
                            ? "text-primary-color"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span>({totalReview})</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {/* Add more fields if needed */}
      </div>
      {/* Review Section */}
      <div className="bg-white rounded-md p-3 shadow-md mt-3">
        <form onSubmit={handleReviewSubmit} className="mb-4">
          <label className="block text-lg font-semibold text-primary-color text-center">
            🌟 Your Rating 🌟
          </label>
          <p className="text-center text-sm font-medium text-gray-800">
            {"-"}
            {getRatingComment(input.rating)}
            {"-"}
          </p>
          <div className="flex justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((ratingValue) => (
              <label key={ratingValue} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onChange={changeInputValue}
                  className="hidden"
                />
                <FaStar
                  size={25}
                  className={`${
                    input.rating >= ratingValue
                      ? "text-primary-color"
                      : "text-gray-300"
                  } transition duration-200`}
                />
              </label>
            ))}
          </div>
          <div>
            <label
              htmlFor="tripTime"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Trip Time
            </label>
            <input
              type="datetime-local"
              id="tripTime"
              name="tripTime"
              value={input.tripTime}
              onChange={changeInputValue}
              className="border p-2 mb-3 w-full rounded text-base font-medium text-gray-700"
            />
          </div>
          <input
            type="text"
            required
            placeholder="Your Name"
            name="name"
            value={input.name}
            onChange={changeInputValue}
            className="border p-2 mb-3 w-full text-base font-medium text-gray-700"
          />

          <input
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            value={input.phoneNumber}
            onChange={changeInputValue}
            className="border p-2 mb-3 w-full text-base font-medium text-gray-700"
          />
          <input
            type="text"
            placeholder="Destination"
            name="destination"
            value={input.destination}
            onChange={changeInputValue}
            className="border p-2 mb-3 w-full text-base font-medium text-gray-700"
          />

          <textarea
            placeholder="Comment..."
            name="comment"
            value={input.comment}
            onChange={changeInputValue}
            className="border border-gray-300 outline-primary-color p-2 mb-3 w-full rounded text-base font-medium text-gray-700"
          ></textarea>
          <button
            type="submit"
            className="bg-primary-color text-white text-base font-medium py-2 px-4 rounded disabled:bg-opacity-80"
            disabled={loader}
          >
            Submit Review
          </button>
        </form>
      </div>
    </section>
  );
};

export default BusComReviewByQR;
