import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import UAParser from "ua-parser-js";
import axios from "axios";
import PageLoader from "../../components/Loader/PageLoader";
import { Star } from "lucide-react";
import { ReviewForm } from "@/components/ReviewForm";
import { EmergencyAlarmForm } from "@/components/EmergencyAlarmForm";

const EmergencyAlarm = () => {
  const { id, emergency, lon, lat } = useParams();
  const [busInfo, setBusInfo] = useState(null);
  const [totalReview, setTotalReview] = useState(0);
  const [averageReview, setAverageReview] = useState(0);
  const [error, setError] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const [deviceInfo, setDeviceInfo] = useState({
    phoneName: "Unknown Vendor",
    phoneModel: "Unknown Model",
  });

  // Device Info
  useEffect(() => {
    const fetchDeviceInfo = () => {
      const userAgentString = navigator.userAgent;
      const parser = new UAParser();
      parser.setUA(userAgentString);
      const result = parser.getResult();

      setDeviceInfo({
        phoneName: result.device.vendor || "Unknown Vendor",
        phoneModel: result.device.model || "Unknown Model",
      });
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
        setIpAddress(data.ip);
      } catch (error) {
        setError("Failed to fetch IP address.");
      }
    };

    fetchIP();
  }, []);

  if (!busInfo)
    return (
      <div>
        <PageLoader />
      </div>
    );

  if (error || !busInfo) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">
            {error || "Bus information not found"}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="container max-w-3xl mx-auto py-4 px-3 sm:px-6">
      <div className="space-y-3">
        {/* Bus Info Card */}
        <div className="bg-card rounded-lg shadow-md p-2 border">
          <h1 className="text-center text-primary text-2xl font-bold mb-4">
            {busInfo.paribahanName}
          </h1>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-base font-medium">Average Rating:</span>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < Math.round(averageReview)
                        ? "fill-primary text-primary"
                        : "text-muted stroke-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">({totalReview})</span>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <EmergencyAlarmForm
          busId={id}
          lon={lon}
          lat={lat}
          paribahanName={busInfo.paribahanName}
          deviceInfo={deviceInfo}
          ipAddress={ipAddress}
        />
      </div>
    </div>
  );
};

export default EmergencyAlarm;
