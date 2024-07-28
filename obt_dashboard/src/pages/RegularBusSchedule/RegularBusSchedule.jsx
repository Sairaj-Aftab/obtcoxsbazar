import { useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader/PageHeader";
import { authData } from "../../features/auth/authSlice";

const RegularBusSchedule = () => {
  const { authUser } = useSelector(authData);
  return (
    <>
      <PageHeader title="Regular Bus Schedule" />
      <button
        data-target="#paribahanCreateModal"
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
                  {/* {schedules && schedules.length > 0 && (
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
                )} */}
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
