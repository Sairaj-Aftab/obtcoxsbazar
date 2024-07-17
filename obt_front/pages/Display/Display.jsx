"use client";
import localFont from "next/font/local";
import { useEffect, useRef, useState } from "react";
import "./display.css";
import { useSelector } from "react-redux";
import { schedulesData } from "@/lib/features/schedules/schedulesSlice";
import { formatDateTime } from "@/utils/formatDateTime";

// Font files can be colocated inside of `app`
const myFont = localFont({
  src: "../../public/fonts/digital-7.ttf",
  display: "swap",
});
const Display = () => {
  const { schedules } = useSelector(schedulesData);

  const scrollRef = useRef(null);

  // useEffect(() => {
  //   const scrollElement = scrollRef.current;
  //   let scrollAmount = 0;
  //   let scrollInterval = null;

  //   const startScrolling = () => {
  //     if (!scrollElement) return;

  //     scrollElement.scrollTop = scrollAmount;
  //     scrollAmount += 1;

  //     if (scrollAmount >= scrollElement.scrollHeight / 2) {
  //       scrollAmount = 0;
  //       scrollElement.scrollTop = 0; // Reset to top to create a continuous loop
  //     }
  //   };

  //   const startScrollLoop = () => {
  //     scrollInterval = setInterval(startScrolling, 100); // Adjust the speed here
  //   };

  //   const stopScrollLoop = () => {
  //     clearInterval(scrollInterval);
  //   };

  //   startScrollLoop();

  //   return () => stopScrollLoop();
  // }, []);
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  // Filter schedules within the next hour
  const filteredSchedules = schedules?.filter((data) => {
    const scheduleTime = new Date(data.time);
    return scheduleTime >= fifteenMinutesAgo && scheduleTime <= oneHourLater;
  });

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
    <div className="display bg-black h-screen w-full flex items-center justify-center fixed -z-10">
      <div className="w-full flex flex-col gap-10">
        <div className="flex justify-between items-center w-[90%] mx-auto">
          <div className="basis-1/4 text-white">Logo Here</div>
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
            <div className="text-white text-6xl font-bold">
              <span>{hours}</span> : <span>{minutes}</span>
            </div>
            <span className="text-red text-4xl font-semibold">{seconds}</span>
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
            {schedules?.length > 0 ? (
              schedules
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
                      {data.busName}
                    </span>
                    <span className="basis-1/4">{data.busNo}</span>
                    <span className="basis-1/4 border-x border-white">
                      {data.leavingPlace}
                    </span>
                    <span className="basis-1/4">{data.destinationPlace}</span>
                  </div>
                ))
            ) : (
              <h1 className="text-white text-2xl font-semibold flex justify-center items-center h-full w-full">
                No schedules
              </h1>
            )}
          </div>
        </div>
        <div className="text-white w-[90%] mx-auto text-xl font-semibold">
          <marquee behavior="" direction="">
            অনলাইন বাস টার্মিনালে আপনাকে স্বাগতম। কক্সবাজার থেকে সকল বাসের
            শিডিউল, টিকিট বুকিং, ভাড়া, গাইডের মোবাইল নাম্বার ও যাত্রার স্থান
            জানতে ভিজিট করুন:{" "}
            <span className="text-yellow text-2xl font-bold">
              www.obtcoxsbazar.com
            </span>
          </marquee>
        </div>
      </div>
    </div>
  );
};

export default Display;
