import { useEffect, useState } from "react";
import DataTables from "datatables.net-dt";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { getAllData, setMessageEmpty } from "../../features/user/userSlice";
import FormInputValue from "../../hooks/formInputValue";
import {
  createParibahanUser,
  deleteParibahanUser,
  updateParibahanUser,
} from "../../features/user/userApiSllice";
import { generateRandomNumberPassword } from "../../utils/generateRandomPassword";
import { formatDate } from "../../utils/timeAgo";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { placeData } from "../../features/place/placeSlice";
import { authData } from "../../features/auth/authSlice";

const ParibahanUsers = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(authData);

  const { paribahanUsers, success, loader, message, error } =
    useSelector(getAllData);
  const { destinationPlaces } = useSelector(placeData);

  const [selected, setSelected] = useState([]);

  const handleChangeCheckbox = (e) => {
    const select = String(e.target.value);

    const selectedItem = [...selected];

    if (selected.includes(select)) {
      selectedItem.splice(selected.indexOf(select), 1);
    } else {
      selectedItem.push(select);
    }

    setSelected(selectedItem);
    paribahanSetInput((prevState) => ({
      ...prevState,
      destinationId: selectedItem,
    }));
  };

  const [type, setType] = useState("");

  const handleChangeType = (e) => {
    const select = e.target.value;

    let selectedItem = type;

    if (type.includes(select)) {
      // Remove the selected item from the string
      selectedItem = selectedItem.split(select).join("");
    } else {
      // Add the selected item to the string
      selectedItem += select;
    }

    setType(selectedItem);
    paribahanSetInput((prevState) => ({
      ...prevState,
      type: selectedItem,
    }));
  };

  const {
    input: paribahanInput,
    handleChangeValue: paribahanHandleChangeValue,
    formReset: paribahanFormReset,
    setInput: paribahanSetInput,
  } = FormInputValue({
    paribahanName: "",
    contactPerson: "",
    contactNumber: "",
    salesPerson: "",
    salesNumber: "",
    password: "",
    type: "",
    counterLocation: "",
    counterLocationMap: "",
    destinationId: [],
  });

  const handleGenRanNumPasswordParibahan = () => {
    const ranPass = generateRandomNumberPassword();
    paribahanSetInput((prev) => ({ ...prev, password: ranPass }));
  };

  const handleCreateParibahanUserSubmit = (e) => {
    e.preventDefault();
    if (
      !paribahanInput.paribahanName ||
      !paribahanInput.password ||
      !paribahanInput.type
    ) {
      toast.error("All fields are required");
    } else {
      dispatch(
        createParibahanUser({ authUserId: authUser.id, data: paribahanInput })
      );
      dispatch(setMessageEmpty());
    }
  };

  const [findUser, setFindUser] = useState({});

  const handleChangeEditValue = (e) => {
    setFindUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditUser = (id) => {
    const user = paribahanUsers.find((data) => data.id == id);
    setFindUser(user);
    setSelected(user.destination.map((destination) => destination.id));
    setType(user?.type?.toString());
  };

  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateParibahanUser({
        id: findUser.id,
        data: {
          paribahanName: findUser.paribahanName,
          contactPerson: findUser.contactPerson,
          contactNumber: findUser.contactNumber,
          salesPerson: findUser.salesPerson,
          salesNumber: findUser.salesNumber,
          plainPassword: findUser.plainPassword,
          counterLocation: findUser.counterLocation,
          counterLocationMap: findUser.counterLocationMap,
          type: type,
          destinationId: selected,
        },
      })
    );
    dispatch(setMessageEmpty());
  };

  const handleDeleteParibahanUser = (id) => {
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
        dispatch(deleteParibahanUser(id));
        dispatch(setMessageEmpty());
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };

  useEffect(() => {
    new DataTables(".datatable");
    if (success) {
      paribahanFormReset();
    }
    if (error) {
      toast.error(error);
    }

    if (message) {
      toast.success(message);
    }

    if (success || error || message) {
      dispatch(setMessageEmpty());
    }
  }, [dispatch, success, message, error, paribahanFormReset]);
  return (
    <>
      {/* Create Paribahan User */}
      <ModalPopup
        size="modal-lg"
        title="Create Paribahan User"
        target="paribahanCreateModal"
      >
        <form onSubmit={handleCreateParibahanUserSubmit}>
          <div className="form-group mb-2">
            <input
              type="text"
              name="paribahanName"
              value={paribahanInput.paribahanName}
              onChange={paribahanHandleChangeValue}
              className="form-control"
              placeholder="Paribahan Name"
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="contactPerson"
              value={paribahanInput.contactPerson}
              onChange={paribahanHandleChangeValue}
              className="form-control"
              placeholder="Contact Name (Optional)"
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="contactNumber"
              value={paribahanInput.contactNumber}
              onChange={paribahanHandleChangeValue}
              className="form-control"
              placeholder="Contact Phone Number (Optional)"
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="salesPerson"
              value={paribahanInput.salesPerson}
              onChange={paribahanHandleChangeValue}
              className="form-control"
              placeholder="Sales Name (Optional)"
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="salesNumber"
              value={paribahanInput.salesNumber}
              onChange={paribahanHandleChangeValue}
              className="form-control"
              placeholder="Sales Phone Number (Optional)"
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="password"
              value={paribahanInput.password}
              onChange={paribahanHandleChangeValue}
              maxLength={5}
              className="form-control"
              placeholder="Password (Only 5 digit number)"
            />
            <a
              onClick={handleGenRanNumPasswordParibahan}
              className="badge badge-info text-light"
            >
              Generate random password
            </a>
          </div>
          <div>
            <p className="my-2">*Types</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
              }}
            >
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={1}
                  onChange={handleChangeType}
                  checked={type.includes("1")}
                />{" "}
                Non-AC
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={2}
                  onChange={handleChangeType}
                  checked={type.includes("2")}
                />{" "}
                AC
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={3}
                  onChange={handleChangeType}
                  checked={type.includes("3")}
                />{" "}
                Sleeper Coach
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={4}
                  onChange={handleChangeType}
                  checked={type.includes("4")}
                />{" "}
                Double-decker
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={5}
                  onChange={handleChangeType}
                  checked={type.includes("5")}
                />{" "}
                Suite Class
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={6}
                  onChange={handleChangeType}
                  checked={type.includes("6")}
                />{" "}
                Hyundai Biz Class
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={7}
                  onChange={handleChangeType}
                  checked={type.includes("7")}
                />{" "}
                Mercedes-Benz
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={8}
                  onChange={handleChangeType}
                  checked={type.includes("8")}
                />{" "}
                Local Service
              </label>
            </div>
          </div>
          {destinationPlaces && (
            <div>
              <p className="my-2">*Destination Places</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                }}
              >
                {destinationPlaces.map((data, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      name="destinationId"
                      value={data.id}
                      onChange={handleChangeCheckbox}
                      checked={selected.includes(data.id)}
                    />{" "}
                    {data.placeName}
                  </label>
                ))}
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
      </ModalPopup>
      {/* Update Paribahan User */}
      <ModalPopup
        size="modal-lg"
        title="Edit Paribahan User"
        target="ruleEditPopup"
      >
        <form onSubmit={handleEditUserSubmit}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="paribahanName" className="mb-1">
                Paribahan Name
              </label>
              <input
                type="text"
                id="paribahanName"
                name="paribahanName"
                value={findUser.paribahanName}
                onChange={handleChangeEditValue}
                className="form-control"
                placeholder="Paribahan Name"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="contactPerson" className="mb-1">
                Contact Name
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={findUser.contactPerson}
                onChange={handleChangeEditValue}
                className="form-control"
                placeholder="Contact Name (Optional)"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="contactNumber" className="mb-1">
                Contact Number
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={findUser.contactNumber}
                onChange={handleChangeEditValue}
                className="form-control"
                placeholder="Contact Phone Number (Optional)"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="salesPerson" className="mb-1">
                Sales Person
              </label>
              <input
                type="text"
                id="salesPerson"
                name="salesPerson"
                value={findUser.salesPerson}
                onChange={handleChangeEditValue}
                className="form-control"
                placeholder="Sales Name (Optional)"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6 mb-1">
              <label htmlFor="salesNumber" className="mb-1">
                Sales Number
              </label>
              <input
                type="text"
                id="salesNumber"
                name="salesNumber"
                value={findUser.salesNumber}
                onChange={handleChangeEditValue}
                className="form-control"
                placeholder="Sales Phone Number (Optional)"
              />
            </div>
            <div className="form-group col-md-6 mb-1">
              <label htmlFor="plainPassword" className="mb-1">
                Password (Only 5 digit number)
              </label>
              <input
                type="number"
                id="plainPassword"
                name="plainPassword"
                value={findUser.plainPassword}
                onChange={handleChangeEditValue}
                maxLength={5}
                className="form-control"
                placeholder="Password (Only 5 digit number)"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6 mb-1">
              <label htmlFor="counterLocation" className="mb-1">
                Counter Location
              </label>
              <input
                type="text"
                id="counterLocation"
                name="counterLocation"
                value={findUser.counterLocation}
                onChange={handleChangeEditValue}
                className="form-control"
                placeholder="Counter Location (Optional)"
              />
            </div>
            <div className="form-group col-md-6 mb-1">
              <label htmlFor="counterLocationMap" className="mb-1">
                Counter Location Map Link
              </label>
              <input
                type="text"
                id="counterLocationMap"
                name="counterLocationMap"
                value={findUser.counterLocationMap}
                onChange={handleChangeEditValue}
                className="form-control"
                placeholder="Counter Location Map Link (Optional)"
              />
            </div>
          </div>
          <div>
            <p className="my-2">*Types</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
              }}
            >
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={1}
                  onChange={handleChangeType}
                  checked={type.includes("1")}
                />{" "}
                Non-AC
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={2}
                  onChange={handleChangeType}
                  checked={type.includes("2")}
                />{" "}
                AC
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={3}
                  onChange={handleChangeType}
                  checked={type.includes("3")}
                />{" "}
                Sleeper Coach
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={4}
                  onChange={handleChangeType}
                  checked={type.includes("4")}
                />{" "}
                Double-decker
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={5}
                  onChange={handleChangeType}
                  checked={type.includes("5")}
                />{" "}
                Suite Class
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={6}
                  onChange={handleChangeType}
                  checked={type.includes("6")}
                />{" "}
                Hyundai Biz Class
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={7}
                  onChange={handleChangeType}
                  checked={type.includes("7")}
                />{" "}
                Mercedes-Benz
              </label>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value={8}
                  onChange={handleChangeType}
                  checked={type.includes("8")}
                />{" "}
                Local Service
              </label>
            </div>
          </div>
          {destinationPlaces && (
            <div>
              <p className="my-2">*Destination Places</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                }}
              >
                {destinationPlaces.map((data, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      name="destinationId"
                      value={data.id}
                      onChange={handleChangeCheckbox}
                      checked={selected.includes(data.id)}
                    />{" "}
                    {data.placeName}
                  </label>
                ))}
              </div>
            </div>
          )}
          <button
            disabled={(authUser?.role?.name === "VIEWER" || loader) && true}
            type="submit"
            className="btn btn-primary"
          >
            {loader ? "Loading..." : "Update"}
          </button>
        </form>
      </ModalPopup>
      <PageHeader title="Paribahan Users" />
      <button
        data-target="#paribahanCreateModal"
        data-toggle="modal"
        className="btn btn-primary btn-sm mb-2"
        disabled={authUser?.role?.name === "VIEWER" && true}
      >
        Add new user
      </button>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="datatable table table-hover table-center mb-0 w-100">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Paribahan</th>
                      <th>Contact Person</th>
                      <th>Sales Name</th>
                      <th>Destinations</th>
                      <th>Password</th>
                      <th>QR Code</th>
                      <th>Counter Location</th>
                      <th>Created by & At</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paribahanUsers &&
                      paribahanUsers?.map((data, index) => (
                        <tr key={data.id}>
                          <td>{index + 1}</td>
                          <td>{data.paribahanName}</td>
                          <th>
                            <p>{data?.contactPerson}</p>
                            <p>
                              <a href={`tel:+88${data?.contactNumber}`}>
                                {data?.contactNumber}
                              </a>
                            </p>
                          </th>
                          <th>
                            <p>{data?.salesPerson}</p>
                            <p>
                              <a href={`tel:+88${data?.salesNumber}`}>
                                {data?.salesNumber}
                              </a>
                            </p>
                          </th>
                          <td>
                            <ul>
                              {data?.destination?.map((data) => (
                                <li key={data?.id}>{data?.placeName}</li>
                              ))}
                            </ul>
                          </td>
                          <td>{data?.plainPassword}</td>
                          <td>
                            <img
                              src={data?.qrCode}
                              alt={data?.paribahanName}
                              style={{ width: "100px" }}
                            />
                          </td>
                          <td>
                            <p>{data?.counterLocation}</p>
                            <a href={data?.counterLocationMap}>
                              {data?.counterLocationMap}
                            </a>
                          </td>
                          <td>
                            <p>
                              {data.authUser?.userName} .{" "}
                              {data?.authUser?.role?.name}
                            </p>
                            <p>{formatDate(data.createdAt)}s</p>
                          </td>
                          <td className="text-right">
                            <div className="actions">
                              <a
                                className="btn btn-sm bg-success-light mr-2"
                                data-target="#ruleEditPopup"
                                data-toggle="modal"
                                href="#edit_specialities_details"
                                onClick={() => handleEditUser(data.id)}
                              >
                                <i className="fe fe-pencil"></i>
                              </a>
                              <button
                                onClick={() =>
                                  handleDeleteParibahanUser(data.id)
                                }
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParibahanUsers;
