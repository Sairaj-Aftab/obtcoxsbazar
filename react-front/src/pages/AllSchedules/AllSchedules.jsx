import { useSelector } from "react-redux";
import { schedulesData } from "../../features/schedules/schedulesSlice";
import DataTable from "react-data-table-component";
import scheduleColumn from "../../dataTableColumn/scheduleColumn";
import TodayDate from "../../components/TodayDate";

const AllSchedules = () => {
  const { todaySchedules } = useSelector(schedulesData);
  return (
    <div className="container w-full mx-auto my-8 p-4 bg-white border border-primary-color md:rounded-lg">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 items-center mb-4">
        <h3 className="text-xl font-semibold">All Schedule</h3>
        <TodayDate className="text-base text-primary font-normal" />
      </div>
      <DataTable
        columns={scheduleColumn}
        data={todaySchedules
          ?.slice()
          .sort((a, b) => new Date(a.time) - new Date(b.time))}
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
        // progressPending={todayLoader}
        // progressComponent={<Loading />}
        // pagination
        // paginationServer
        // paginationTotalRows={
        //   authSchedulesCount ? authSchedulesCount : authSearchCount
        // }
        // onChangeRowsPerPage={handlePerRowsChange}
        // onChangePage={handlePageChange}
        // paginationRowsPerPageOptions={[100, 150, 200]}
      />
    </div>
  );
};

export default AllSchedules;
