import DataTable from "react-data-table-component";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  reviewsData,
  setReviewMessageEmpty,
} from "../../features/review/reviewSlice";
import { authData } from "../../features/auth/authSlice";
import swal from "sweetalert";
import {
  deleteReview,
  getAllReview,
} from "../../features/review/reviewApiSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatDateTime } from "../../utils/timeAgo";
import Loading from "../../components/Loading/Loading";
import ModalPopup from "../../components/ModalPopup/ModalPopup";

const Review = () => {
  const dispatch = useDispatch();
  const { reviews, totalCount, searchCount, loader, message, error } =
    useSelector(reviewsData);
  const { authUser } = useSelector(authData);

  const [review, setReview] = useState({});

  const handleShowReview = (id) => {
    const selectedReview = reviews.find((review) => review.id === id);
    if (selectedReview) {
      setReview(selectedReview);
    }
  };

  const handleDeleteSchedule = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`Poof! Successfully deleted`, {
          icon: "success",
        });
        dispatch(deleteReview(id));
        dispatch(setReviewMessageEmpty());
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const handlePageChange = (page) => {
    setPage(page);
    dispatch(getAllReview({ page, limit: rowPage, search }));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    dispatch(getAllReview({ page, limit: newPerPage, search }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(getAllReview({ page, limit: rowPage, search: e.target.value }));
  };
  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
    }
    return () => {
      dispatch(setReviewMessageEmpty());
    };
  }, [dispatch, message, error]);

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
      width: "60px",
    },
    {
      name: "View",
      cell: (data) => (
        <a
          data-target="#showreview"
          data-toggle="modal"
          href="#edit_specialities_details"
          rel="noreferrer"
          onClick={() => handleShowReview(data.id)}
        >
          <i
            className="fa fa-eye"
            aria-hidden="true"
            style={{ color: "#00d0f1", fontSize: "17px" }}
          ></i>
        </a>
      ),
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
        <div>
          {Array.from({ length: 5 }, (_, index) => (
            <i
              key={index}
              className={`fa ${index < row.rating ? "fa-star" : "fa-star-o"}`}
              aria-hidden="true"
              style={{ color: "gold", fontSize: "17px" }}
            ></i>
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
      name: "Phone number",
      selector: (data) => data.phoneNumber,
    },
    {
      name: "Destination",
      selector: (data) => data.destination,
    },
    {
      name: "Trip time",
      selector: (data) => formatDateTime(data.tripTime),
    },
    // {
    //   name: "Device with model",
    //   selector: (data) => data,
    //   cell: (data) => {
    //     return (
    //       <p>
    //         {data.phoneName}
    //         {"."}
    //         {data.phoneModel}
    //       </p>
    //     );
    //   },
    // },
    {
      name: "IP Address",
      selector: (data) => data.ipAddress,
    },
    {
      name: "Entry Date",
      selector: (data) => formatDateTime(data.createdAt),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (data) => (
        <div className="text-right actions">
          <button
            className="btn btn-sm bg-danger-light"
            onClick={() => handleDeleteSchedule(data.id)}
            disabled={authUser?.role?.name === "VIEWER" && true}
          >
            <i className="fe fe-trash"></i> Delete
          </button>
        </div>
      ),
      right: true, // Align the column to the right
    },
  ];
  return (
    <>
      <ModalPopup title={review.paribahanName} target="showreview">
        <div>
          {review?.regNo && (
            <p>
              <b>Registration No : </b> {review?.regNo}
            </p>
          )}
          <p>
            <b>Name : </b> {review?.name}
          </p>
          {review?.phoneNumber && (
            <p>
              <b>Phone number : </b> {review?.phoneNumber}
            </p>
          )}
          <p>
            <b>Rating : </b> {review.rating}
          </p>
          {review?.comment && (
            <p>
              <b>Comment : </b> {review?.comment}
            </p>
          )}
          {review?.tripTime && (
            <p>
              <b>Trip Time : </b> {formatDateTime(review?.tripTime)}
            </p>
          )}
          {review?.destination && (
            <p>
              <b>Destination : </b> {review?.destination}
            </p>
          )}
          <p>
            <b>Entry Date : </b> {formatDateTime(review.createdAt)}
          </p>
        </div>
      </ModalPopup>
      <PageHeader title="Reviews" />
      <input
        type="text"
        placeholder="Search"
        className="form-control table-search-box"
        onChange={handleSearchChange}
      />
      <DataTable
        columns={columns}
        data={reviews}
        responsive
        progressPending={loader}
        progressComponent={<Loading />}
        pagination
        paginationServer
        paginationTotalRows={searchCount ? searchCount : totalCount}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
    </>
  );
};

export default Review;
