import { useSelector } from "react-redux";
import { schedulesData } from "../../features/schedules/schedulesSlice";
import DataTable from "react-data-table-component";
import scheduleColumn from "../../dataTableColumn/scheduleColumn";

const AllSchedules = () => {
  const { todaySchedules } = useSelector(schedulesData);
  return (
    <div className="container w-full mx-auto my-8 p-4 bg-white border border-primary-color md:rounded-lg">
      <h3 className="text-xl font-semibold mb-4">All Schedule</h3>
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
