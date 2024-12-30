import DataTable from "react-data-table-component";
import TodayDate from "../../components/TodayDate";
import scheduleColumn from "../../dataTableColumn/scheduleColumn";
import { useNavigate } from "react-router-dom";
import useSchedules from "../../store/useSchedules";
import ComponentLoader from "../../components/Loader/ComponentLoader";
import usePlaces from "../../store/usePlaces";

const AllSchedules = () => {
  const navigate = useNavigate();
  const { destinationPlaces } = usePlaces();
  const { todaySchedules, todayScheduleLoader } = useSchedules();

  return (
    <div className="container w-full mx-auto my-8 p-4 bg-white border border-primary-color md:rounded-lg">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 items-center mb-4">
        <h3 className="text-xl font-semibold">All Schedule</h3>
        <TodayDate className="text-base text-primary font-normal" />
      </div>
      {todayScheduleLoader && (
        <div className="w-full h-[70vh]">
          <ComponentLoader />
        </div>
      )}
      {!todayScheduleLoader && todaySchedules && (
        <DataTable
          columns={scheduleColumn({ navigate, destinationPlaces })}
          data={todaySchedules?.schedules || []}
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
