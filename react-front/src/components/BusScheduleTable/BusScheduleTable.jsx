import { schedulesData } from "../../features/schedules/schedulesSlice";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import TodayDate from "../TodayDate";
import scheduleColumn from "../../dataTableColumn/scheduleColumn";

const BusScheduleTable = () => {
  const navigate = useNavigate();
  const { todaySchedules, todayScheduleLoader, destinationPlaces } =
    useSelector(schedulesData);
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
  const fiveDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  // Filter schedules within the next hour
  const filteredSchedules = todaySchedules?.filter((data) => {
    const scheduleTime = new Date(data.time);
    return scheduleTime >= fifteenMinutesAgo && scheduleTime <= fiveDaysLater;
  });
  return (
    <section className="container w-full mx-auto my-8 p-4 bg-white border border-primary-color md:rounded-lg">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 items-center mb-4">
        <h3 className="text-xl font-semibold">Today&apos;s Bus Schedule</h3>
        <TodayDate className="text-base text-primary font-normal" />
      </div>
      {todayScheduleLoader && (
        <div className="w-full">
          <Skeleton height={150} />
        </div>
      )}
      {!todayScheduleLoader && todaySchedules && (
        <>
          <DataTable
            columns={scheduleColumn({ navigate, destinationPlaces })}
            data={filteredSchedules?.slice(0, 10)}
            responsive
            customStyles={{
              headCells: {
                style: {
                  fontSize: "16px",
                  fontWeight: "bold",
                },
              },
              rows: {
                style: {
                  fontSize: "16px",
                  fontWeight: "500",
                },
              },
            }}
          />
          {todaySchedules?.length > 10 && (
            <Link
              to="/all-bus-schedules"
              className="block text-end text-sm font-medium text-primary-color"
            >
              See more...
            </Link>
          )}
        </>
      )}
    </section>
  );
};

export default BusScheduleTable;
