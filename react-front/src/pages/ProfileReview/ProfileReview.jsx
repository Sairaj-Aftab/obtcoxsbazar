import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { formatDateTime } from "../../utils/formatDateTime";
import { paribahanAuthData } from "../../features/paribahanAuth/paribahanAuthSlice";
import DataTable from "react-data-table-component";
import {
  authReviewsData,
  setMessageEmpty,
} from "../../features/authReview/authReviewSlice";
import { getAuthReviews } from "../../features/authReview/authReviewApiSlice";

const ProfileReview = () => {
  const { paribahanAuth: user } = useSelector(paribahanAuthData);
  const dispatch = useDispatch();
  const { authReviews, totalCount, searchCount, error } =
    useSelector(authReviewsData);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const handlePageChange = (page) => {
    setPage(page);
    dispatch(getAuthReviews({ id: user.id, page, limit: rowPage, search }));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    dispatch(getAuthReviews({ id: user.id, page, limit: newPerPage, search }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(
      getAuthReviews({
        id: user.id,
        page,
        limit: rowPage,
        search: e.target.value,
      })
    ); // Fetch schedules with the search term
  };

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };
  const column = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
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
                index < row.rating ? "text-primary-color" : "text-gray-300"
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

  useEffect(() => {
    dispatch(getAuthReviews({ id: user?.id, page: 1, limit: 100 }));

    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(setMessageEmpty());
    };
  }, [dispatch, error, user?.id]);
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
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <DataTable
          columns={column}
          data={authReviews}
          responsive
          // progressPending={todayLoader}
          // progressComponent={<Loading />}
          pagination
          paginationServer
          paginationTotalRows={totalCount ? totalCount : searchCount}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
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
