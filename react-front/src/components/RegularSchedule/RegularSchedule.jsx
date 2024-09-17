import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

// eslint-disable-next-line react/prop-types
const RegularSchedule = ({ data, loader }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const scheduleColumn = [
    {
      name: "#",
      selector: (_row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Time",
      selector: (row) => row.time,
      sortable: true,
    },
    {
      name: "Paribahan",
      selector: (row) => row.busName,
      cell: (row) => {
        return (
          <p
            onClick={() =>
              navigate(`/all-bus-services/${row.slug}/${row.paribahanUserId}`)
            }
            className="w-full flex items-center gap-1 text-primary-color cursor-pointer"
          >
            {row.busName}
          </p>
        );
      },
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Destination",
      selector: (row) => row.destinationPlace,
      sortable: true,
    },
  ];
  return (
    <section className="container w-full mx-auto my-8 p-4 bg-white border border-primary-color md:rounded-lg">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl text-center sm:text-left font-semibold">
          Regular Bus Schedule from Cox&apos;s Bazar
        </h3>
        {pathname !== "/all-regular-schedules" && (
          <Link
            to="/all-regular-schedules"
            className="hidden sm:block bg-primary-color text-center px-2 py-1 rounded-sm sm:rounded-md text-white text-sm font-medium"
          >
            See All
          </Link>
        )}
      </div>
      {loader && !data && (
        <div className="w-full">
          <Skeleton height={150} />
        </div>
      )}
      {!loader && data && (
        <>
          <DataTable
            columns={scheduleColumn}
            data={data}
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
          {pathname !== "/all-regular-schedules" && (
            <Link
              to="/all-regular-schedules"
              className="block w-24 sm:w-auto text-center sm:text-end text-sm font-medium text-white sm:text-primary-color bg-primary-color sm:bg-transparent rounded-sm sm:rounded-none py-1 sm:py-0"
            >
              See more...
            </Link>
          )}
        </>
      )}
    </section>
  );
};

export default RegularSchedule;
