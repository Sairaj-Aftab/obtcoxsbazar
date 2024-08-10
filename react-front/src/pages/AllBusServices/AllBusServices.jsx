import { LiaBusSolid } from "react-icons/lia";
import { useSelector } from "react-redux";
import { busData } from "../../features/bus/busSlice";
import { Link } from "react-router-dom";
import NoticeFromAdmin from "../../components/NoticeFromAdmin";
import { useState } from "react";
const AllBusServices = ({ title }) => {
  const { bus } = useSelector(busData);
  const [selectedDigits, setSelectedDigits] = useState([]);

  // Filter data based on selected digits
  const filteredData = bus.filter((item) =>
    selectedDigits.some((digit) => item.type.toString().includes(digit))
  );

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedDigits((prev) =>
      event.target.checked
        ? [...prev, value]
        : prev.filter((digit) => digit !== value)
    );
  };

  // Determine which data to use for mapping
  const dataToMap = filteredData.length > 0 ? filteredData : bus;

  return (
    <div className="container mx-auto bg-white rounded-lg my-5">
      <h1 className="text-lg font-semibold text-white bg-primary-color text-center py-1 rounded-t-lg mb-2">
        {title}
      </h1>
      <p className="text-base font-medium text-black mb-3">
        <NoticeFromAdmin status="Passenger" />
      </p>
      <div className="flex gap-3 flex-col sm:flex-row px-5">
        <p className="text-base font-medium sm:font-semibold hidden sm:block">
          Search with filtering:
        </p>
        <div className="grid grid-cols-2 sm:flex gap-1 sm:gap-5">
          <label
            htmlFor="non-ac"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              id="non-ac"
              value={"1"}
              className="accent-blue-600 h-4 w-4 rounded-sm"
              onChange={handleCheckboxChange}
            />
            <span className="text-sm">Non-AC</span>
          </label>
          <label
            htmlFor="ac"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              id="ac"
              value={"2"}
              className="accent-blue-600 h-4 w-4 rounded-sm"
              onChange={handleCheckboxChange}
            />
            <span className="text-sm">AC</span>
          </label>
          <label
            htmlFor="sleeper-coach"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              id="sleeper-coach"
              value={"3"}
              className="accent-blue-600 h-4 w-4 rounded-sm"
              onChange={handleCheckboxChange}
            />
            <span className="text-sm">Sleeper-Coach</span>
          </label>
          <label
            htmlFor="double-decker"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              id="double-decker"
              value={"4"}
              className="accent-blue-600 h-4 w-4 rounded-sm"
              onChange={handleCheckboxChange}
            />
            <span className="text-sm">Double Decker</span>
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-5">
        {dataToMap?.map((data, index) => (
          <Link
            to={`/all-bus-services/${data.slug}/${data.id}`}
            className="p-2 rounded shadow flex flex-col gap-1 items-center justify-center hover:shadow-lg"
            key={index}
          >
            <LiaBusSolid className="text-5xl" />
            <p className="text-lg font-semibold text-primary-color text-center">
              {data.paribahanName}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllBusServices;
