"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./display.css";
import { useSelector } from "react-redux";
import { schedulesData } from "@/lib/features/schedules/schedulesSlice";
import { formatDateTime } from "@/utils/formatDateTime";
const Display = () => {
  let socket = useRef();
  const { schedules } = useSelector(schedulesData);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_API_DOMAIN);
    // socket.current.on("getActiveUser", (data) => {
    //   setActiveUser(data);
    // });
    socket.current.emit("test", "hello test text");
  }, []);
  // const getTimeParts = (date) => {
  //   const hours = date.getHours();
  //   const minutes = date.getMinutes();
  //   const seconds = date.getSeconds();
  //   const ampm = hours >= 12 ? "PM" : "AM";
  //   return {
  //     hours: hours % 12 || 12, // Convert to 12-hour format
  //     minutes: minutes < 10 ? `0${minutes}` : minutes,
  //     seconds: seconds < 10 ? `0${seconds}` : seconds,
  //     ampm,
  //   };
  // };

  // const { hours, minutes, seconds, ampm } = getTimeParts(time);
  return (
    <div className="bg-black h-screen w-full flex items-center justify-center fixed -z-10">
      <div className="w-full flex flex-col gap-14">
        <div className="flex justify-between items-center w-[90%] mx-auto">
          <div className="basis-1/4 text-white">Logo Here</div>
          <div className="basis-2/4 text-white flex flex-col items-center">
            <h1 className="text-white text-3xl font-bold"></h1>
            <div className="head_text_parent relative w-full h-14">
              <h1 className="head_text text-3xl md:text-5xl text-center font-extrabold text-slate-400 absolute top-0 left-0 right-0 h-full">
                Online Bus Terminal
              </h1>
              <h1 className="head_text text-3xl md:text-5xl text-center font-extrabold text-slate-400 absolute top-0 left-0 right-0 h-full">
                Online Bus Terminal
              </h1>
            </div>
            <span className="text-white text-2xl font-semibold">
              Cox's Bazar
            </span>
          </div>

          {/* <div className="w-40 h-40 flex flex-col justify-center items-center border border-red border-double rounded-full">
            <div className="text-white text-5xl font-bold">
              <span className="animate-bounce">{hours}</span> :{" "}
              <span className="animate-bounce">{minutes}</span>
            </div>
            <span className="text-red text-3xl font-semibold">{seconds}</span>
          </div> */}
        </div>

        <div className="block">
          {/* <table className="table-scroll">
            <thead>
              <tr>
                <th>Time</th>
                <th>Paribahan</th>
                <th>Reg No</th>
                <th>Departure Place</th>
                <th>Destination</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10:30AM</td>
                <td>GreenLine</td>
                <td>15-2233</td>
                <td>Dolphin Mor</td>
                <td>Dampara</td>
              </tr>
              <tr>
                <td>10:30AM</td>
                <td>GreenLine</td>
                <td>15-2233</td>
                <td>Dolphin Mor</td>
                <td>Dampara</td>
              </tr>
              <tr>
                <td>10:30AM</td>
                <td>GreenLine</td>
                <td>15-2233</td>
                <td>Dolphin Mor</td>
                <td>Dampara</td>
              </tr>
              <tr>
                <td>10:30AM</td>
                <td>GreenLine</td>
                <td>15-2233</td>
                <td>Dolphin Mor</td>
                <td>Dampara</td>
              </tr>
              <tr>
                <td>10:30AM</td>
                <td>GreenLine</td>
                <td>15-2233</td>
                <td>Dolphin Mor</td>
                <td>Dampara</td>
              </tr>
              <tr>
                <td>10:30AM</td>
                <td>GreenLine</td>
                <td>15-2233</td>
                <td>Dolphin Mor</td>
                <td>Dampara</td>
              </tr>
            </tbody>
          </table> */}
          <div className="flex border-b border-white text-white">
            <span className="basis-1/4">Time</span>
            <span className="basis-1/4 border-x border-white">Paribahan</span>
            <span className="basis-1/4">Reg No</span>
            <span className="basis-1/4 border-x border-white">
              Departure Place
            </span>
            <span className="basis-1/4">Destination</span>
          </div>
          <div className="contain">
            {schedules?.length > 0 ? (
              schedules.map((data, index) => (
                <div
                  key={index}
                  className="flex border-b border-white text-white"
                >
                  <span className="basis-1/4">{formatDateTime(data.time)}</span>
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
        <div className="text-white">Heloo text</div>
      </div>
    </div>
  );
};

export default Display;
