"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getDestinationPlace,
  getLeavingPlace,
  getSchedulesDataByLimit,
} from "@/lib/features/schedules/schedulesApiSlice";
import { getAllBusServices } from "@/lib/features/bus/busApiSlice";
import {
  getAllParibahanNotice,
  getNoticeFromAdmin,
} from "@/lib/features/notice/noticeApiSlice";
import socket from "@/utils/socket";
import {
  addScheduleSocket,
  deleteScheduleSocket,
  updateScheduleSocket,
} from "@/lib/features/schedules/schedulesSlice";

const GloballyDispatch = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSchedulesDataByLimit(500));
    dispatch(getLeavingPlace());
    dispatch(getDestinationPlace());
    dispatch(getAllBusServices());
    dispatch(getNoticeFromAdmin());
    dispatch(getAllParibahanNotice());
    // Listen for updates
    socket.on("data-updated", (updatedData) => {
      dispatch(updateScheduleSocket(updatedData));
    });

    // Listen for new data
    socket.on("data-created", (newData) => {
      dispatch(addScheduleSocket(newData));
    });

    // Listen for deletions
    socket.on("data-deleted", (deletedId) => {
      dispatch(deleteScheduleSocket(deletedId));
    });

    // Clean up socket listeners on component unmount
    return () => {
      socket.off("data-updated");
      socket.off("data-created");
      socket.off("data-deleted");
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default GloballyDispatch;
