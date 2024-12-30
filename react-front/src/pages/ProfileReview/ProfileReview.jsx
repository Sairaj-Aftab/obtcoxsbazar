import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { formatDateTime } from "../../utils/formatDateTime";
import DataTable from "react-data-table-component";
import { useQuery } from "@tanstack/react-query";
import { getAuthReviews } from "../../services/authReview.service";
import ComponentLoader from "../../components/Loader/ComponentLoader";
import useParibahanAuth from "../../store/useParibahanAuth";

const ProfileReview = () => {
  const { paribahanAuth: user } = useParibahanAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["authReviews", { id: user.id, page, limit, search }],
    queryFn: () => getAuthReviews({ id: user.id, page, limit, search }),
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
      name: "Paribahan",
      selector: (data) => data.paribahanName,
      sortable: true,
    },
    {
      name: "Reg No",
      selector: (data) => data.regNo,
      sortable: true,
    },
    {
      name: "Type",
      selector: (data) => data.type,
    },
    {
      name: "Rating",
      selector: (data) => data.rating,
      sortable: true,
      cell: (row) => (
        <div className="flex">
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar
              key={index}
              className={`${
                index < row.rating ? "text-yellow_500" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      ),
      width: "115px",
    },
    {
      name: "Name",
      selector: (data) => data.name,
    },
    {
      name: "Comment",
      selector: (data) => data.comment,
    },
    {
      name: "Destination",
      selector: (data) => data.destination,
    },
    {
      name: "Trip time",
      selector: (data) => formatDateTime(data.tripTime),
    },
    {
      name: "Entry Date",
      selector: (data) => formatDateTime(data.createdAt),
      sortable: true,
    },
  ];

  return (
    <>
      <div className="container mx-auto bg-white p-5 my-5 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-lg font-semibold text-gray-700">All Reviews</h1>
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
          data={reviews?.reviews || []}
          responsive
          progressPending={reviewsLoading}
          progressComponent={
            <div className="w-full p-4">
              <ComponentLoader />
            </div>
          }
          pagination
          paginationServer
          paginationTotalRows={reviews?.count}
          onChangeRowsPerPage={(perRow) => setLimit(perRow)}
          onChangePage={(page) => setPage(page)}
          paginationRowsPerPageOptions={[100, 150, 200]}
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
    </>
  );
};

export default ProfileReview;
