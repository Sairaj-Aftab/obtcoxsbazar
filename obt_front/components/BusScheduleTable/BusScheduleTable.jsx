"use client";

import { schedulesData } from "@/lib/features/schedules/schedulesSlice";
import { formatDateTime } from "@/utils/formatDateTime";
import { useSelector } from "react-redux";

const BusScheduleTable = () => {
  const { schedules } = useSelector(schedulesData);
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Filter schedules within the next hour
  const filteredSchedules = schedules?.filter((data) => {
    const scheduleTime = new Date(data.time);
    return scheduleTime >= fifteenMinutesAgo && scheduleTime <= thirtyDaysLater;
  });
  return (
    <section className="container w-full mx-auto my-8 p-4 bg-white border border-primary-color md:rounded-lg">
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
            {/* {filteredSchedules
              ?.slice(0, 15)
              .sort((a, b) => new Date(a.time) - new Date(b.time))
              ?.map((data, index) => (
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
              ))} */}
            <tr className="text-base font-normal">
              <td>787788:pm</td>
              <td>PParriibbaaa nnaammmee</td>
              <td>NNoonn AAcc</td>
              <td>8888676</td>
              <td>8899585544</td>
              <td>fldjf kdjfsdkfj jfkds</td>
              <td>jfksdjfskdfjkdsjf</td>
              <td>৳ 8545843</td>
              <td>Available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BusScheduleTable;
