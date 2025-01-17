import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import toast from "react-hot-toast";
import swal from "sweetalert";
import {
  placeData,
  setPlaceMessageEmpty,
} from "../../features/place/placeSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  createPlace,
  deletePlace,
  updatePlace,
} from "../../features/place/placeApiSlice";
import { authData } from "../../features/auth/authSlice";

const Destination = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(authData);
  const {
    places,
    leavingPlaces,
    destinationPlaces,
    parkingPlaces,
    message,
    success,
    error,
  } = useSelector(placeData);
  const [placeName, setPlaceName] = useState("");
  const [placeStatus, setPlaceStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!placeName || !placeStatus) {
      toast.error("Please fill all the fields");
    } else {
      dispatch(createPlace({ placeName, status: placeStatus }));
      dispatch(setPlaceMessageEmpty());
    }
  };

  const [id, setId] = useState("");
  const [plName, setPlName] = useState("");
  const [plStatus, setPlStatus] = useState("");
  const [map, setMap] = useState("");
  const [destinationKM, setDestinationKM] = useState("");
  const [bdTicketLink, setBdTicketLink] = useState("");
  const handleShowPlaceName = (id) => {
    setId(id);
    const place = places.find((pl) => pl.id === id);
    setPlName(place.placeName);
    setPlStatus(place.status);
    setMap(place?.mapLink);
    setDestinationKM(place?.destinationKM);
    setBdTicketLink(place?.bdTicketLink);
  };

  const handleUpdate = (id) => {
    if (!plName) {
      toast.error("Place is required!");
    } else {
      dispatch(
        updatePlace({
          id,
          data: {
            placeName: plName,
            status: plStatus,
            mapLink: map,
            destinationKM,
            bdTicketLink,
          },
        })
      );
      setId("");
    }
  };
  const handleDeletePlace = (id) => {
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
        dispatch(deletePlace(id));
        dispatch(setPlaceMessageEmpty());
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (success) {
      setPlaceName("");
      setPlaceStatus("");
    }
    if (error) {
      toast.error(error);
    }
    if (message || success || error) {
      dispatch(setPlaceMessageEmpty());
    }
  }, [dispatch, message, error, success]);
  return (
    <>
      <PageHeader title="Arrival & Destination Places" />
      <form
        onSubmit={handleSubmit}
        className="d-flex justify-content-between mb-3"
      >
        <input
          className="form-control mr-2"
          type="text"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          placeholder="Add Place"
        />
        <select
          name=""
          className="form-control w-25 mr-2"
          id=""
          value={placeStatus}
          onChange={(e) => setPlaceStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="leave">Departure</option>
          <option value="destination">Destination</option>
          <option value="parkingPlace">TB Parking Place</option>
        </select>
        <button
          disabled={authUser?.role?.name === "VIEWER" && true}
          type="submit"
          className="btn btn-primary"
        >
          Submit
        </button>
      </form>
      <div className="row">
        {/* Tourist Bus Parking Place */}
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <h5>TB Parking Places</h5>
              </div>
              <div className="table-responsive">
                {parkingPlaces && (
                  <table className="datatable table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Place & Map</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {parkingPlaces?.map((place, index) => (
                        <tr key={place.id}>
                          <td>{index + 1}</td>
                          {id === place?.id ? (
                            <td className="d-flex flex-column">
                              <input
                                type="text"
                                value={plName}
                                onChange={(e) => setPlName(e.target.value)}
                                className="form-control"
                              />
                              <input
                                type="text"
                                value={map}
                                onChange={(e) => setMap(e.target.value)}
                                className="form-control"
                                placeholder="Google Map Link"
                              />
                            </td>
                          ) : (
                            <td className="d-flex flex-column">
                              <span>{place.placeName}</span>
                              <a target="_blank" href={place?.mapLink}>
                                {place?.mapLink}
                              </a>
                            </td>
                          )}
                          <td className="text-right">
                            <div className="actions">
                              {id === place?.id ? (
                                <button
                                  onClick={() => handleUpdate(place?.id)}
                                  className="btn btn-sm bg-primary-light mr-1"
                                  disabled={
                                    authUser?.role?.name === "VIEWER" && true
                                  }
                                >
                                  <i className="fa fa-check-square-o"></i>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleShowPlaceName(place?.id)}
                                  className="btn btn-sm bg-primary-light mr-1"
                                  disabled={
                                    authUser?.role?.name === "VIEWER" && true
                                  }
                                >
                                  <i className="fa fa-pencil-square-o"></i>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeletePlace(place.id)}
                                className="btn btn-sm bg-danger-light"
                                disabled={
                                  authUser?.role?.name === "VIEWER" && true
                                }
                              >
                                <i className="fe fe-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {/* This is Dashboard Management Users table */}
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <h5>Destination Places</h5>
              </div>
              <div className="table-responsive">
                {destinationPlaces && (
                  <table className="datatable table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Place Name</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinationPlaces?.map((place, index) => (
                        <tr key={place.id}>
                          <td>{index + 1}</td>
                          {id === place?.id ? (
                            <td>
                              <input
                                type="text"
                                value={plName}
                                onChange={(e) => setPlName(e.target.value)}
                                className="form-control"
                              />
                              <input
                                type="number"
                                value={destinationKM}
                                onChange={(e) =>
                                  setDestinationKM(e.target.value)
                                }
                                className="form-control"
                                placeholder="Destination KM"
                              />
                              <input
                                type="text"
                                value={bdTicketLink}
                                onChange={(e) =>
                                  setBdTicketLink(e.target.value)
                                }
                                className="form-control"
                                placeholder="BD Ticket Link"
                              />
                            </td>
                          ) : (
                            <td className="d-flex flex-column">
                              <span>{place.placeName}</span>
                              {place?.destinationKM && (
                                <span>{place?.destinationKM} KM</span>
                              )}
                              {place?.bdTicketLink && (
                                <span>
                                  {place?.bdTicketLink.split("/").pop()}
                                </span>
                              )}
                            </td>
                          )}

                          <td className="text-right">
                            <div className="actions">
                              {id === place?.id ? (
                                <button
                                  onClick={() => handleUpdate(place?.id)}
                                  className="btn btn-sm bg-primary-light mr-1"
                                  disabled={
                                    authUser?.role?.name === "VIEWER" && true
                                  }
                                >
                                  <i className="fa fa-check-square-o"></i>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleShowPlaceName(place?.id)}
                                  className="btn btn-sm bg-primary-light mr-1"
                                  disabled={
                                    authUser?.role?.name === "VIEWER" && true
                                  }
                                >
                                  <i className="fa fa-pencil-square-o"></i>
                                </button>
                              )}

                              <button
                                onClick={() => handleDeletePlace(place.id)}
                                className="btn btn-sm bg-danger-light"
                                disabled={
                                  authUser?.role?.name === "VIEWER" && true
                                }
                              >
                                <i className="fe fe-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* This is Paribahan User Table */}
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <h5>Departure Places</h5>
              </div>
              <div className="table-responsive">
                {leavingPlaces && (
                  <table className="datatable table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Place & Map</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {leavingPlaces?.map((place, index) => (
                        <tr key={place.id}>
                          <td>{index + 1}</td>
                          {id === place?.id ? (
                            <td className="d-flex flex-column">
                              <input
                                type="text"
                                value={plName}
                                onChange={(e) => setPlName(e.target.value)}
                                className="form-control"
                              />
                              <input
                                type="text"
                                value={map}
                                onChange={(e) => setMap(e.target.value)}
                                className="form-control"
                                placeholder="Google Map Link"
                              />
                            </td>
                          ) : (
                            <td className="d-flex flex-column">
                              <span>{place.placeName}</span>
                              <a target="_blank" href={place?.mapLink}>
                                {place?.mapLink}
                              </a>
                            </td>
                          )}
                          <td className="text-right">
                            <div className="actions">
                              {id === place?.id ? (
                                <button
                                  onClick={() => handleUpdate(place?.id)}
                                  className="btn btn-sm bg-primary-light mr-1"
                                  disabled={
                                    authUser?.role?.name === "VIEWER" && true
                                  }
                                >
                                  <i className="fa fa-check-square-o"></i>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleShowPlaceName(place?.id)}
                                  className="btn btn-sm bg-primary-light mr-1"
                                  disabled={
                                    authUser?.role?.name === "VIEWER" && true
                                  }
                                >
                                  <i className="fa fa-pencil-square-o"></i>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeletePlace(place.id)}
                                className="btn btn-sm bg-danger-light"
                                disabled={
                                  authUser?.role?.name === "VIEWER" && true
                                }
                              >
                                <i className="fe fe-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Destination;
