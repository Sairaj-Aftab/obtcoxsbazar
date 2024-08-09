import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  schedulesData,
  setMessageEmpty,
} from "../../features/schedules/schedulesSlice";
import { authData } from "../../features/auth/authSlice";
import { formatDateTime } from "../../utils/timeAgo";
import swal from "sweetalert";
import { deleteSchedule } from "../../features/schedules/schedulesApiSlice";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";

const ScheduleTableList = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(authData);

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
        dispatch(deleteSchedule(id));
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };

  const [search, setSearch] = useState("");
  const [rowPage, setRowPage] = useState(10);
  const handlePageChange = (page) => {
    // dispatch(getAllRgSchedules({ page, limit: rowPage }));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    // dispatch(getAllRgSchedules({ page, limit: newPerPage }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // dispatch(getAllRgSchedules({ search: e.target.value })); // Fetch schedules with the search term
  };

  const columns = [
    {
      name: "#",
      selector: (data, index) => index + 1,
      width: "50px",
    },
    {
      name: "Time",
      selector: (data) => data.time,
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
      name: "Seat Status",
      selector: (data) => (data.seatStatus ? "Available" : "Booked"),
      sortable: true,
    },
    {
      name: "Entry Date",
      selector: (data) => formatDateTime(data.createdAt),
      sortable: true,
    },
  ];

  if (authUser?.role?.name !== "VIEWER") {
    columns.push({
      name: "Actions",
      cell: (data) => (
        <div className="text-right actions">
          <a
            data-toggle="modal"
            href="#delete_modal"
            className="btn btn-sm bg-danger-light"
            onClick={() => handleDeleteSchedule(data.id)}
          >
            <i className="fe fe-trash"></i> Delete
          </a>
        </div>
      ),
      right: true, // Align the column to the right
    });
  }

  return (
    <>
      <DataTable
        // title="Regular Schedules"
        columns={columns}
        data={data}
        responsive
        fixedHeader
        progressPending={loader}
        progressComponent={<Loading />}
        pagination
        paginationServer
        paginationTotalRows={totalScheduleCount}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
    </>
    // <div className="row">
    //   <div className="col-sm-12">
    //     <div className="card">
    //       <div className="card-body">
    //         <div className="table-responsive">
    //           <table className="datatable table table-hover table-center mb-0">
    //             <thead>
    //               <tr>
    //                 <th>#</th>
    //                 <th>Time</th>
    //                 <th>Paribahan</th>
    //                 <th>Bus Type</th>
    //                 <th>Reg No.</th>
    //                 <th>Guide Name</th>
    //                 <th>Guide Phone</th>
    //                 <th>Departure Place</th>
    //                 <th>Destination</th>
    //                 <th>Seat Status</th>
    //                 <th>Entry Date</th>
    //                 {authUser?.role?.name === "VIEWER" ? (
    //                   ""
    //                 ) : (
    //                   <th className="text-right">Actions</th>
    //                 )}
    //               </tr>
    //             </thead>
    //             {schedules && schedules.length > 0 && (
    //               <tbody>
    //                 {schedules?.map((data, index) => (
    //                   <tr key={index}>
    //                     <td>{index + 1}</td>
    //                     <td>{formatDateTime(data.time)}</td>
    //                     <td>{data.busName}</td>
    //                     <td>{data.type}</td>
    //                     <td>{data.busNo}</td>
    //                     <td>{data.guideName}</td>
    //                     <td>{data.guidePhone}</td>
    //                     <td>{data.leavingPlace}</td>
    //                     <td>{data.destinationPlace}</td>
    //                     <td>{data.seatStatus ? "Available" : "Booked"}</td>
    //                     <td>{formatDateTime(data.createdAt)}</td>
    //                     {authUser?.role?.name === "VIEWER" ? (
    //                       ""
    //                     ) : (
    //                       <td className="text-right">
    //                         <div className="actions">
    //                           <a
    //                             data-toggle="modal"
    //                             href="#delete_modal"
    //                             className="btn btn-sm bg-danger-light"
    //                             onClick={() => handleDeleteSchedule(data.id)}
    //                           >
    //                             <i className="fe fe-trash"></i> Delete
    //                           </a>
    //                         </div>
    //                       </td>
    //                     )}
    //                   </tr>
    //                 ))}
    //               </tbody>
    //             )}
    //           </table>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ScheduleTableList;
