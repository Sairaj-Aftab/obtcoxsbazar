"use client";
import localFont from "next/font/local";
import { useEffect, useRef, useState } from "react";
import "./display.css";
import { useSelector } from "react-redux";
import { schedulesData } from "@/lib/features/schedules/schedulesSlice";
import { formatDateTime } from "@/utils/formatDateTime";
import NoticeFromAdmin from "@/components/NoticeFromAdmin";
import DigitalClock from "@/components/DigitalClock";
import Image from "next/image";
import logoImg2 from "@/public/image/white_yellow.png";

// Font files can be colocated inside of `app`
const myFont = localFont({
  src: "../../public/fonts/digital-7.ttf",
  display: "swap",
});
const Display = () => {
  const { schedules } = useSelector(schedulesData);

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
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const [disSchedules, setDisSchedules] = useState(null);
  useEffect(() => {
    const filteredSchedules = schedules?.filter((data) => {
      const scheduleTime = new Date(data.time);
      return scheduleTime >= fifteenMinutesAgo && scheduleTime <= oneHourLater;
    });
    setDisSchedules(filteredSchedules);
  }, [fifteenMinutesAgo, oneHourLater]);

  // Filter schedules within the next hour

  return (
    <div className="display bg-black h-screen w-full flex items-center justify-center fixed -z-10">
      <div className="w-full flex flex-col gap-8">
        <div className="flex justify-between items-center w-[90%] mx-auto">
          <div className="w-40 text-white">
            <Image
              src={logoImg2}
              alt="OBT"
              width={0}
              height={0}
              sizes="100vw"
              className="w-48"
            />
          </div>
          <div className="basis-2/4 text-white flex flex-col items-center">
            <h1 className="text-white text-3xl font-bold"></h1>
            <div className="head_text_parent">
              <h1 className="head_text text-3xl md:text-5xl">
                Online Bus Terminal
              </h1>
              <h1 className="head_text text-3xl md:text-5xl">
                Online Bus Terminal
              </h1>
            </div>

            <span className="text-white text-3xl font-semibold">
              Cox's Bazar
            </span>
          </div>

          <div
            className={`${myFont.className} w-40 h-40 flex flex-col justify-center items-center border border-red border-double rounded-full`}
          >
            <DigitalClock />
          </div>
        </div>

        <div className="block">
          <div className="flex border-b border-white text-white bg-primary-color">
            <span className="basis-1/4">Time</span>
            <span className="basis-1/4 border-x border-white">Paribahan</span>
            <span className="basis-1/4">Reg No</span>
            <span className="basis-1/4 border-x border-white">
              Departure Place
            </span>
            <span className="basis-1/4">Destination</span>
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
                    <span className="basis-1/4">
                      {formatDateTime(data.time)}
                    </span>
                    <span className="basis-1/4 border-x border-white">
                      {data.busName?.toUpperCase()}
                    </span>
                    <span className="basis-1/4">{data.busNo}</span>
                    <span className="basis-1/4 border-x border-white">
                      {data.leavingPlace?.toUpperCase()}
                    </span>
                    <span className="basis-1/4">
                      {data.destinationPlace?.toUpperCase()}
                    </span>
                  </div>
                ))
            ) : (
              <h1 className="text-white text-2xl font-semibold flex justify-center items-center h-full w-full">
                No schedules
              </h1>
            )}
          </div>
        </div>
        <div className="text-white w-[90%] mx-auto text-3xl font-semibold">
          <NoticeFromAdmin status="Display" />
        </div>
      </div>
    </div>
  );
};

export default Display;