import { useState } from "react";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading/Loading";
import { formatDateTime } from "../../utils/timeAgo";
import PageHeader from "../../components/PageHeader/PageHeader";
import useAuth from "@/store/useAuth";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useGetAllSchedules } from "@/services/schedule.service";
import { Input } from "@/components/ui/input";

const DailyBusScheduleList = () => {
  const { authUser } = useAuth();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const { data, isLoading } = useGetAllSchedules({
    page,
    limit: rowPage,
    search,
  });

  const handleDeleteSchedule = () => {};

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
      width: "60px",
    },
    {
      name: "Time",
      selector: (data) => formatDateTime(data.time),
      sortable: true,
    },
    {
      name: "Paribahan",
      selector: (data) => data.busName,
      sortable: true,
    },
    {
      name: "Bus Type",
      selector: (data) => data.type,
      sortable: true,
    },
    {
      name: "Reg No",
      selector: (data) => data.busNo,
      sortable: true,
    },
    {
      name: "Guide Name",
      selector: (data) => data.guideName,
      sortable: true,
    },
    {
      name: "Guide Phone",
      selector: (data) => data.guidePhone,
      sortable: true,
    },
    {
      name: "Driver Name",
      selector: (data) => data.driverName,
      sortable: true,
    },
    {
      name: "Driver Phone",
      selector: (data) => data.driverPhone,
      sortable: true,
    },
    {
      name: "Departure Place",
      selector: (data) => data.leavingPlace,
      sortable: true,
    },
    {
      name: "Destination",
      selector: (data) => data.destinationPlace,
      sortable: true,
    },
    {
      name: "Entry Date",
      selector: (data) => formatDateTime(data.createdAt),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (data) => (
        <Button
          className="bg-red-500"
          onClick={() => handleDeleteSchedule(data.id)}
          disabled={authUser?.role?.name === "VIEWER" && true}
        >
          <Trash className="mr-1 h-4 w-4" /> Delete
        </Button>
      ),
      right: true, // Align the column to the right
    },
  ];
  return (
    <div>
      <PageHeader title="Schedule Log Book" />
      <Input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="my-3"
      />
      <DataTable
        columns={columns}
        data={data?.schedules || []}
        responsive
        progressPending={isLoading}
        progressComponent={
          <div className="h-96 flex justify-center items-center">
            <Loading />
          </div>
        }
        pagination
        paginationServer
        paginationTotalRows={
          data?.searchCount ? data?.searchCount : data?.totalScheduleCount
        }
        onChangeRowsPerPage={(newPerPage) => setRowPage(newPerPage)}
        onChangePage={(page) => setPage(page)}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
    </div>
  );
};

export default DailyBusScheduleList;
