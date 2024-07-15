"use client";
import { getBusInfoData } from "@/lib/features/bus/busApiSlice";
import { busData } from "@/lib/features/bus/busSlice";
import { noticeData } from "@/lib/features/notice/noticeSlice";
import { formatDateTime } from "@/utils/formatDateTime";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const BusInformation = ({ params }) => {
  const dispatch = useDispatch();
  const { busInfo } = useSelector(busData);
  const { paribahanNotices } = useSelector(noticeData);
  const [paribahanNotice, setParibahanNotice] = useState(null);

  useEffect(() => {
    dispatch(getBusInfoData(params.id));
    const getParibahanNotice = () => {
      return paribahanNotices?.find(
        (notice) => notice.paribahanUserId === parseInt(params.id)
      );
    };

    const notice = getParibahanNotice();
    setParibahanNotice(notice);
  }, [dispatch, paribahanNotices, params.id]);
  return (
    <div className="container mx-auto bg-white rounded-lg my-5">
      {/* Heading */}
      <div className="flex justify-between items-center bg-primary-color rounded-t-lg text-white py-2 px-3">
        <h1 className="text-xl font-medium">{busInfo?.paribahanName}</h1>
        <p className="text-base font-medium">
          টিকেট এর জন্য যোগাযোগ করুন :{" "}
          <a href="tel:+8801818591572" className="font-semibold underline">
            {busInfo?.salesNumber}
          </a>
        </p>
      </div>
      {paribahanNotice && (
        <p className="text-base font-medium text-black mb-2">
          <marquee behavior="" direction="left">
            {paribahanNotice?.title}
          </marquee>
        </p>
      )}
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Time</th>
              <th>Reg No.</th>
              <th>Bus Type</th>
              <th>Guide No</th>
              <th>Departure Place</th>
              <th>Destination</th>
              <th>Rent</th>
              <th>Seat Status</th>
            </tr>
          </thead>
          <tbody>
            {busInfo?.busSchedule?.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{formatDateTime(data.time)}</td>
                <td>{data.busNo}</td>
                <td>{data.type}</td>
                <td>{data.guidePhone}</td>
                <td>{data.leavingPlace}</td>
                <td>{data.destinationPlace}</td>
                <td>৳ {data?.rent}</td>
                <td className="flex justify-start items-center">
                  {data.seatStatus ? (
                    <button className="bg-primary-color text-white px-3 py-1 rounded-lg">
                      Available
                    </button>
                  ) : (
                    <button className="bg-red text-white px-3 py-1 rounded-lg">
                      Booked
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusInformation;
