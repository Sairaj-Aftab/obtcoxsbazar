import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PageLoader from "../../components/Loader/PageLoader";

const BusInfo = () => {
  const { id } = useParams(); // Get the ID from URL params
  const [busInfo, setBusInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/businfo/getbusinfo/${id}`
        );
        setBusInfo(response.data.busInfo);
      } catch (err) {
        setError("Failed to fetch bus info");
      }
    };

    fetchBusInfo();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!busInfo)
    return (
      <div>
        <PageLoader />
      </div>
    );
  return (
    <>
      <div>
        <h1>{busInfo.paribahanName}</h1>
        <p>Registration Number: {busInfo.regNo}</p>
        <p>Type: {busInfo.type}</p>
        {/* Add more fields if needed */}
      </div>
    </>
  );
};

export default BusInfo;
