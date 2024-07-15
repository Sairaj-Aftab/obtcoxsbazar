import React, { useEffect } from "react";
import DataTables from "datatables.net-dt";

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

const ScheduleTableList = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(authData);

  const { schedules, message, error } = useSelector(schedulesData);
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

  const todaysSchedules = schedules?.filter((schedule) => {
    const scheduleDate = new Date(schedule.time).toISOString().split("T")[0];
    return scheduleDate === formattedToday;
  });

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
  useEffect(() => {
    new DataTables(".datatable");
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(setMessageEmpty());
    };
  }, [dispatch, error, message]);
  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="datatable table table-hover table-center mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Time</th>
                    <th>Paribahan</th>
                    <th>Bus Type</th>
                    <th>Reg No.</th>
                    <th>Guide Name</th>
                    <th>Guide Phone</th>
                    <th>Starting Place</th>
                    <th>Destination</th>
                    <th>Seat Status</th>
                    <th>Entry Date</th>
                    {authUser?.role?.name === "VIEWER" ? (
                      ""
                    ) : (
                      <th className="text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                {schedules && schedules.length > 0 && (
                  <tbody>
                    {schedules?.map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{formatDateTime(data.time)}</td>
                        <td>
                          <h2 className="table-avatar">
                            <a href="profile.html">{data.busName}</a>
                          </h2>
                        </td>
                        <td>{data.type}</td>
                        <td>{data.busNo}</td>
                        <td>{data.guideName}</td>
                        <td>{data.guidePhone}</td>
                        <td>{data.leavingPlace}</td>
                        <td>{data.destinationPlace}</td>
                        <td>{data.seatStatus ? "Available" : "Booked"}</td>
                        <td>{formatDateTime(data.createdAt)}</td>
                        {authUser?.role?.name === "VIEWER" ? (
                          ""
                        ) : (
                          <td className="text-right">
                            <div className="actions">
                              <a
                                data-toggle="modal"
                                href="#delete_modal"
                                className="btn btn-sm bg-danger-light"
                                onClick={() => handleDeleteSchedule(data.id)}
                              >
                                <i className="fe fe-trash"></i> Delete
                              </a>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTableList;
