import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const TodayDate = ({ className }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <p className={`${className}`}>
        {currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "2-digit",
        })}
      </p>
    </>
  );
};

export default TodayDate;
