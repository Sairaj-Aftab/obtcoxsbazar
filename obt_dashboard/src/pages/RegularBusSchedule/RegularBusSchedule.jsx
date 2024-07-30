import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader/PageHeader";
import { authData } from "../../features/auth/authSlice";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import { toast } from "react-hot-toast";
import {
  rgSchedulesData,
  setRgScheduleMessageEmpty,
} from "../../features/regularSchedule/regularScheduleSlice";
import {
  createSchedule,
  deleteSchedule,
} from "../../features/regularSchedule/regularScheduleApiSlice";
import { formatDateTime } from "../../utils/timeAgo";
import { placeData } from "../../features/place/placeSlice";
import { getAllData } from "../../features/user/userSlice";
import swal from "sweetalert";

const RegularBusSchedule = () => {
  const dispatch = useDispatch();
  const { paribahanUsers } = useSelector(getAllData);
  const { authUser } = useSelector(authData);
  const { rgSchedules, message, error } = useSelector(rgSchedulesData);
  const { leavingPlaces, destinationPlaces } = useSelector(placeData);

  const [input, setInput] = useState({
    busName: "",
    time: "",
    type: "",
    leavingPlace: "",
    destinationPlace: "",
  });

  const changeInputValue = (e) => {
    const { name, value } = e.target;

    setInput({ ...input, [name]: value });
  };

  const handleCreateSchedule = (e) => {
    e.preventDefault();
    if (
      !input.busName ||
      !input.time ||
      !input.type ||
      !input.leavingPlace ||
      !input.destinationPlace
    ) {
      toast.error("All fields are required");
    } else {
      dispatch(createSchedule({ data: input }));
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
        dispatch(deleteSchedule(id));
        dispatch(setRgScheduleMessageEmpty());
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
    }
    return () => {
      dispatch(setRgScheduleMessageEmpty());
    };
  }, [dispatch, message, error]);
  return (
    <>
      <ModalPopup title="Create Regular Schedule" target="busScheduleModal">
        <form onSubmit={handleCreateSchedule}>
          <div className="form-group mb-2">
            <select
              name="busName"
              id="busName"
              value={input.busName}
              onChange={changeInputValue}
              className="form-control"
            >
              <option value="">Paribahan Name</option>
              {paribahanUsers?.map((data, index) => (
                <option key={index} value={data.paribahanName}>
                  {data.paribahanName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-2">
            <label htmlFor="time">Starting Time</label>
            <input
              id="time"
              type="time"
              name="time"
              value={input.time}
              min={new Date().toISOString().slice(0, 16)}
              onChange={changeInputValue}
              placeholder="Starting Time"
              className="form-control"
            />
          </div>
          <div className="form-group mb-2">
            <select
              name="type"
              id="type"
              value={input.type}
              onChange={changeInputValue}
              className="form-control"
            >
              <option value="">Bus Type</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
              <option value="Sleeper Coach">Sleeper Coach</option>
            </select>
          </div>
          <div className="form-group mb-2">
            <select
              name="leavingPlace"
              id="leavingPlace"
              value={input.leavingPlace}
              onChange={changeInputValue}
              className="form-control"
            >
              <option value="">Departure Place</option>
              {leavingPlaces?.map((place, index) => (
                <option key={index} value={place?.placeName}>
                  {place?.placeName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-2">
            <select
              name="destinationPlace"
              id="destinationPlace"
              value={input.destinationPlace}
              onChange={changeInputValue}
              className="form-control"
            >
              <option value="">Destination</option>
              {destinationPlaces?.map((place, index) => (
                <option key={index} value={place?.placeName}>
                  {place?.placeName}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
      </ModalPopup>
      <PageHeader title="Regular Bus Schedule" />
      <button
        data-target="#busScheduleModal"
        data-toggle="modal"
        className="btn btn-primary btn-sm mb-2"
        disabled={authUser?.role?.name === "VIEWER" && true}
      >
        Add regular schedule
      </button>
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
                      <th>Departure Place</th>
                      <th>Destination</th>
                      <th>Entry Date</th>
                      {authUser?.role?.name === "VIEWER" ? (
                        ""
                      ) : (
                        <th className="text-right">Actions</th>
                      )}
                    </tr>
                  </thead>
                  {rgSchedules && rgSchedules.length > 0 && (
                    <tbody>
                      {rgSchedules?.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.time}</td>
                          <td>
                            <h2 className="table-avatar">
                              <a href="profile.html">{data.busName}</a>
                            </h2>
                          </td>
                          <td>{data.type}</td>
                          <td>{data.leavingPlace}</td>
                          <td>{data.destinationPlace}</td>
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
    </>
  );
};

export default RegularBusSchedule;
