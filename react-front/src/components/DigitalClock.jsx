import { useEffect, useState } from "react";

const DigitalClock = () => {
  // For Digittal Clock
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  const hours = time.getHours() % 12 || 12; // Convert to 12-hour format and handle midnight
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  // const ampm = time.getHours() >= 12 ? "PM" : "AM";
  return (
    <div
      style={{ fontFamily: "Digital" }}
      className="flex flex-col items-center mt-3"
    >
      <div className="text-white text-6xl font-bold">
        <span>{hours}</span> : <span>{minutes}</span>
      </div>
      <span className="text-red text-4xl font-semibold">{seconds}</span>
    </div>
  );
};

export default DigitalClock;
