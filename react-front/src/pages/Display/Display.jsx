import { useEffect, useRef, useState } from "react";
import "./display.css";
import logoImg2 from "../../assets/image/white_yellow.png";
import DigitalClock from "../../components/DigitalClock";
import { formatDateTime } from "../../utils/formatDateTime";
import NoticeFromAdmin from "../../components/NoticeFromAdmin";
import useSchedules from "../../store/useSchedules";

const Display = () => {
  const { todaySchedules } = useSchedules();

  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    let scrollAmount = 0;
    let scrollInterval = null;

    const startScrolling = () => {
      if (!scrollElement) return;

      scrollElement.scrollTop = scrollAmount;
      scrollAmount += 1;

      if (scrollAmount >= scrollElement.scrollHeight / 2) {
        scrollAmount = 0;
        scrollElement.scrollTop = 0; // Reset to top to create a continuous loop
      }
    };

    const startScrollLoop = () => {
      scrollInterval = setInterval(startScrolling, 100); // Adjust the speed here
    };

    const stopScrollLoop = () => {
      clearInterval(scrollInterval);
    };

    startScrollLoop();

    return () => stopScrollLoop();
  }, []);
  const [disSchedules, setDisSchedules] = useState([]);

  useEffect(() => {
    const updateSchedules = () => {
      const now = new Date();
      const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

      // Function to find schedules within a given range
      // const findSchedulesInRange = (startTime, endTime) => {
      //   return todaySchedules?.filter((data) => {
      //     const scheduleTime = new Date(data.time);
      //     return scheduleTime >= startTime && scheduleTime < endTime;
      //   });
      // };
      // Function to find schedules within the past 15 minutes and onward
      const findSchedulesInRange = (startTime) => {
        return todaySchedules?.schedules?.filter((data) => {
          const scheduleTime = new Date(data.time);
          return scheduleTime >= startTime;
        });
      };

      // let nextHour = new Date(now.getTime() + 60 * 60 * 1000);
      // let filteredSchedules = findSchedulesInRange(fifteenMinutesAgo, nextHour);

      // Get schedules from fifteen minutes ago onward
      const filteredSchedules = findSchedulesInRange(fifteenMinutesAgo);

      // If no schedules are found in the previous 15 minutes, check the next 24 hours
      // if (filteredSchedules?.length < 15) {
      //   for (let i = 0; i < 24; i++) {
      //     nextHour = new Date(nextHour.getTime() + 60 * 60 * 1000);
      //     filteredSchedules = findSchedulesInRange(fifteenMinutesAgo, nextHour);

      //     if (filteredSchedules?.length >= 15) break; // Stop if schedules are found
      //   }
      // }

      setDisSchedules(filteredSchedules?.slice()); // Limit to 15 schedules
    };

    updateSchedules(); // Initial update
    const intervalId = setInterval(updateSchedules, 60 * 1000); // Update every second

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [todaySchedules]);

  // Filter schedules within the next hour

  return (
    <div className="display bg-black h-screen w-full flex items-center justify-center fixed -z-10">
      <div className="w-full flex flex-col">
        <div className="flex justify-between items-center w-[90%] mx-auto">
          <div className="w-20 lg:w-28 text-white">
            <img src={logoImg2} alt="OBT" sizes="100vw" className="w-full" />
          </div>
          <div className="basis-2/4 text-white flex flex-col items-center">
            {/* <h1 className="text-white text-3xl font-bold"></h1> */}
            <div className="head_text_parent">
              <h1 className="head_text text-4xl lg:text-5xl">
                Online Bus Terminal
              </h1>
              <h1 className="head_text text-4xl lg:text-5xl">
                Online Bus Terminal
              </h1>
            </div>

            <span className="text-white text-2xl lg:text-3xl font-semibold">
              www.obtcoxsbazar.com
            </span>
          </div>

          <div
            className={`w-20 h-20 lg:w-28 lg:h-28 flex flex-col justify-center items-center border border-red border-double rounded-full`}
          >
            <DigitalClock />
          </div>
        </div>

        <div className="block">
          <div className="table-header flex border-b border-white text-white bg-primary-color">
            <p className="basis-[14%]">Time</p>
            <p className="basis-[34%] border-x border-white">Paribahan</p>
            <p className="basis-[28%] border-r border-white">Departure Place</p>
            <p className="basis-[24%]">Destination</p>
          </div>
          <div className="contain" ref={scrollRef}>
            {disSchedules?.length > 0 ? (
              disSchedules
                ?.slice()
                .sort((a, b) => new Date(a.time) - new Date(b.time))
                ?.map((data, index) => (
                  <div
                    key={index}
                    className="flex border-b border-white text-yellow"
                  >
                    <p className="basis-[14%] time">
                      {formatDateTime(data.time)}
                    </p>
                    <p className="basis-[34%] border-x border-white">
                      <span>{data.busName?.toUpperCase()}</span>
                      <span>{data.busNo}</span>
                    </p>
                    <p className="basis-[28%] border-r border-white">
                      {data.leavingPlace?.toUpperCase()}
                    </p>
                    <p className="basis-[24%]">
                      {data.destinationPlace?.toUpperCase()}
                    </p>
                  </div>
                ))
            ) : (
              <h1 className="text-white text-3xl font-bold flex justify-center items-center h-full w-full">
                Welcome to Online Bus Terminal
              </h1>
            )}
          </div>
        </div>
        <div className="text-white w-[90%] mx-auto text-2xl lg:text-3xl font-semibold">
          <NoticeFromAdmin status="Display" />
        </div>
      </div>
    </div>
  );
};

export default Display;
