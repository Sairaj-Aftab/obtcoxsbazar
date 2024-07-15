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

const GloballyDispatch = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSchedulesDataByLimit(100));
    dispatch(getLeavingPlace());
    dispatch(getDestinationPlace());
    dispatch(getAllBusServices());
    dispatch(getNoticeFromAdmin());
    dispatch(getAllParibahanNotice());
  }, [dispatch]);

  return <>{children}</>;
};

export default GloballyDispatch;
