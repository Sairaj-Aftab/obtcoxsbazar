import { useSelector } from "react-redux";
import { schedulesData } from "../../features/schedules/schedulesSlice";
import DataTable from "react-data-table-component";
import TodayDate from "../../components/TodayDate";
import scheduleColumn from "../../dataTableColumn/scheduleColumn";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const AllSchedules = () => {
  const navigate = useNavigate();
  const { todaySchedules, todayScheduleLoader, destinationPlaces } =
    useSelector(schedulesData);

  return (
    <div className="container w-full mx-auto my-8 p-4 bg-white border border-primary-color md:rounded-lg">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 items-center mb-4">
        <h3 className="text-xl font-semibold">All Schedule</h3>
        <TodayDate className="text-base text-primary font-normal" />
      </div>
      {todayScheduleLoader && (
        <div className="w-full">
          <Skeleton height={150} />
        </div>
      )}
      {!todayScheduleLoader && todaySchedules && (
        <DataTable
          columns={scheduleColumn({ navigate, destinationPlaces })}
          data={todaySchedules || []}
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
      )}
    </div>
  );
};

export default AllSchedules;
