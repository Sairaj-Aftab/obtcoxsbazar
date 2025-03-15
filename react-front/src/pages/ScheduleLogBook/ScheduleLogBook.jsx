import { useState } from "react";
import locationIcon from "../../assets/icon/location.png";
import { getSchedulesDataByAuthId } from "@/services/schedules.service";
import { useQuery } from "@tanstack/react-query";
import useParibahanAuth from "@/store/useParibahanAuth";
import DataTable from "react-data-table-component";
import { formatDateTime } from "@/utils/formatDateTime";
import ComponentLoader from "@/components/Loader/ComponentLoader";

const ScheduleLogBook = () => {
  const { paribahanAuth: user } = useParibahanAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ["authSchedules", { id: user.id, page, limit, search }],
    queryFn: () =>
      getSchedulesDataByAuthId({ id: user.id, page, limit, search }),
  });

  const calculateItemIndex = (page, limit, index) => {
    return (page - 1) * limit + index + 1;
  };
  const column = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, limit, index),
      width: "60px",
    },
    {
      name: "Time",
      selector: (data) => formatDateTime(data.time),
      sortable: true,
    },
    {
      name: "Type",
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
      width: "125px",
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
      width: "125px",
      sortable: true,
    },
    {
      name: "Departure Place",
      // selector: (data) => data,
      cell: (data) => {
        return (
          <a
            href={data.leavingMapLink}
            className="w-full flex items-center gap-1 text-primary-color"
          >
            {data.leavingMapLink && (
              <img src={locationIcon} alt="" className="w-6" />
            )}
            <span>{data.leavingPlace}</span>
          </a>
        );
      },
      width: "180px",
    },
    {
      name: "Destination",
      selector: (data) => data.destinationPlace,
      sortable: true,
    },
    {
      name: "Fare",
      cell: (data) => (
        <p className="w-full flex flex-col text-center">
          <span>{`৳ ${
            data.discountRent ? data.discountRent : data.rent
          }`}</span>
          {data.discountRent > 0 && data.discountRent !== data.rent && (
            <div className="text-red -mt-2">
              ৳ <span className="line-through text-xs">{data.rent}</span>
            </div>
          )}
        </p>
      ),
      sortable: true,
    },
    {
      name: "Seat Status",
      selector: (data) => (data.seatStatus ? "Available" : "Booked"),

      sortable: true,
    },
  ];
  return (
    <div>
      <div className="container mx-auto bg-white p-5 my-5 rounded-lg">
        {/* Table Body */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-lg font-semibold text-gray-700">
              Schedule logs book
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-40 sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                className="w-full sm:w-60"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <DataTable
            columns={column}
            data={schedules?.schedules}
            responsive
            progressPending={schedulesLoading}
            progressComponent={
              <div className="w-full py-4">
                <ComponentLoader />
              </div>
            }
            pagination
            paginationServer
            paginationTotalRows={
              schedules?.count ? schedules?.count : schedules?.searchCount
            }
            onChangeRowsPerPage={(rowsPerPage) => setLimit(rowsPerPage)}
            onChangePage={(page) => setPage(page)}
            paginationRowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200]}
            customStyles={{
              headCells: {
                style: {
                  fontSize: "14px",
                  fontWeight: "bold",
                },
              },
              rows: {
                style: {
                  fontSize: "14px",
                  fontWeight: "400",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleLogBook;
