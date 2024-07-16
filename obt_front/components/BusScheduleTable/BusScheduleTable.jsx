"use client";

import { schedulesData } from "@/lib/features/schedules/schedulesSlice";
import { formatDateTime } from "@/utils/formatDateTime";
import { useSelector } from "react-redux";

const BusScheduleTable = () => {
  const { schedules } = useSelector(schedulesData);
  return (
    <section className="container w-full mx-auto my-8 p-4 bg-white border border-primary-color rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Recent Bus Schedule</h3>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr className="bg-primary-color text-white text-base font-medium">
              <th>Time</th>
              <th>Paribahan</th>
              <th>Type</th>
              <th>Reg No</th>
              <th>Guide No.</th>
              <th>Starting Point</th>
              <th>Destination</th>
              <th>Rent</th>
              <th>Seat Status</th>
            </tr>
          </thead>
          <tbody>
            {schedules?.map((data, index) => (
              <tr key={index} className="text-base font-normal">
                <td>{formatDateTime(data.time)}</td>
                <td>{data.busName}</td>
                <td>{data.type}</td>
                <td>{data.busNo}</td>
                <td>{data.guidePhone}</td>
                <td>{data.leavingPlace}</td>
                <td>{data.destinationPlace}</td>
                <td>৳ {data.rent ? data.rent : "--"}</td>
                {data.seatStatus ? <td>Available</td> : <td>Booked</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BusScheduleTable;
