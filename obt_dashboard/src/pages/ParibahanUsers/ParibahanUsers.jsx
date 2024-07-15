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

  const { paribahanUsers, success, message, error } = useSelector(getAllData);
  const { destinationPlaces } = useSelector(placeData);

  const [selected, setSelected] = useState([]);

  const handleChangeCheckbox = (e) => {
    const select = parseInt(e.target.value);

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
    destinationId: [],
  });

  const handleGenRanNumPasswordParibahan = () => {
    const ranPass = generateRandomNumberPassword();
    paribahanSetInput((prev) => ({ ...prev, password: ranPass }));
  };

  const handleCreateParibahanUserSubmit = (e) => {
    e.preventDefault();
    if (!paribahanInput.paribahanName || !paribahanInput.password) {
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

    return () => {
      dispatch(setMessageEmpty());
    };
  }, [success, message, error]);
  return (
    <>
      {/* Create Paribahan User */}
      <ModalPopup title="Create Paribahan User" target="paribahanCreateModal">
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
      <ModalPopup title="Edit Paribahan User" target="ruleEditPopup">
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
            disabled={authUser?.role?.name === "VIEWER" && true}
            type="submit"
            className="btn btn-primary"
          >
            Update
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
                      <th>Contact No.</th>
                      <th>Sales Name</th>
                      <th>Sales No.</th>
                      <th>Destinations</th>
                      <th>Password</th>
                      <th>Created by</th>
                      <th>Created At</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paribahanUsers &&
                      paribahanUsers?.map((data, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{data.paribahanName}</td>
                          <th>{data?.contactPerson}</th>
                          <th>
                            <a href={`tel:+88${data?.contactNumber}`}>
                              {data?.contactNumber}
                            </a>
                          </th>
                          <th>{data?.salesPerson}</th>
                          <th>
                            <a href={`tel:+88${data?.salesNumber}`}>
                              {data?.salesNumber}
                            </a>
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
                            {data.authUser.userName} .{" "}
                            {data?.authUser?.role?.name}
                          </td>
                          <td>{formatDate(data.createdAt)}</td>
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
                              {/* <button
                                onClick={() =>
                                  handleDeleteParibahanUser(data.id)
                                }
                                className="btn btn-sm bg-danger-light"
                                disabled={
                                  authUser?.role?.name === "VIEWER" && true
                                }
                              >
                                <i className="fe fe-trash"></i>
                              </button> */}
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
