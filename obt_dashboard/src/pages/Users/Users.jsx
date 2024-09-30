import { useEffect, useState } from "react";
import DataTables from "datatables.net-dt";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import PageHeader from "../../components/PageHeader/PageHeader";
import FormInputValue from "../../hooks/formInputValue";
import { useDispatch, useSelector } from "react-redux";
import { getAllData, setMessageEmpty } from "../../features/user/userSlice";
import {
  formatDate,
  formatDateAndTime,
  formatDateTime,
} from "../../utils/timeAgo";
import swal from "sweetalert";
import {
  createAuthUser,
  deleteAuthUser,
  updateAuthUser,
} from "../../features/user/userApiSllice";
import { generateRandomPassword } from "../../utils/generateRandomPassword";
import toast from "react-hot-toast";
import { authData } from "../../features/auth/authSlice";

const Users = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(authData);
  const { users, roles, success, message, error } = useSelector(getAllData);
  const { input, handleChangeValue, formReset, setInput } = FormInputValue({
    userName: "",
    phone: "",
    password: "",
    roleId: "",
  });

  const handleGenRanPassword = () => {
    const ranPass = generateRandomPassword();
    setInput((prev) => ({ ...prev, password: ranPass }));
  };

  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    if (!input.userName || !input.password || !input.roleId) {
      toast.error("All fields are required");
    } else {
      dispatch(createAuthUser(input));
      dispatch(setMessageEmpty());
    }
  };

  const [findUser, setFindUser] = useState({});

  const handleChangeEditValue = (e) => {
    setFindUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditShowModal = (id) => {
    const user = users.find((user) => user.id === id);
    setFindUser(user);
  };

  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    if (!findUser.userName || !findUser.plainPassword || !findUser.roleId) {
      toast.error("All fields are required");
    } else {
      dispatch(
        updateAuthUser({
          id: findUser.id,
          data: {
            userName: findUser.userName,
            phone: findUser.phone,
            plainPassword: findUser.plainPassword,
            roleId: findUser.roleId,
          },
        })
      );
      dispatch(setMessageEmpty());
    }
  };

  // const handleDeleteUser = (id) => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "Once deleted, you will not be able to recover this imaginary file!",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       swal(`Poof! Successfully deleted`, {
  //         icon: "success",
  //       });
  //       dispatch(deleteAuthUser(id));
  //       dispatch(setMessageEmpty());
  //     } else {
  //       swal("Your imaginary file is safe!");
  //     }
  //   });
  // };

  useEffect(() => {
    new DataTables(".datatable");
    if (success) {
      formReset();
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
  }, [success, message, error, formReset, dispatch]);
  return (
    <>
      <ModalPopup title="Create User" target="userModalPopup">
        <form onSubmit={handleCreateUserSubmit}>
          <div className="form-group mb-2">
            <input
              type="text"
              name="userName"
              value={input.userName}
              onChange={handleChangeValue}
              className="form-control"
              placeholder="User Name"
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="phone"
              value={input.phone}
              onChange={handleChangeValue}
              className="form-control"
              placeholder="Phone Number (Optional)"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="password"
              value={input.password}
              onChange={handleChangeValue}
              className="form-control"
              placeholder="Password"
            />
            <a
              onClick={handleGenRanPassword}
              className="badge badge-info text-light"
            >
              Generate random password
            </a>
          </div>
          <div className="form-group">
            <select
              name="roleId"
              onChange={handleChangeValue}
              className="form-control inputstl"
            >
              <option value="">--Select--</option>
              {roles?.map((item, index) => {
                return (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            disabled={authUser?.role?.name === "VIEWER" && true}
            type="submit"
            className="btn btn-primary"
          >
            Create
          </button>
        </form>
      </ModalPopup>
      <ModalPopup title="Edit User" target="userEditModalPopup">
        <form onSubmit={handleEditUserSubmit}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="userName" className="mb-1">
                User Name
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={findUser.userName}
                onChange={handleChangeEditValue}
                className="form-control"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="phone" className="mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={findUser.phone}
                onChange={handleChangeEditValue}
                className="form-control"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="plainPassword" className="mb-1">
                Password
              </label>
              <input
                type="text"
                id="plainPassword"
                name="plainPassword"
                value={findUser.plainPassword}
                onChange={handleChangeEditValue}
                className="form-control"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="roleId" className="mb-1">
                Role
              </label>
              <select
                name="roleId"
                id="roleId"
                onChange={handleChangeEditValue}
                className="form-control inputstl"
              >
                {roles?.map((item, index) => {
                  return (
                    <option
                      selected={findUser.roleId === item.id}
                      key={index}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <button
            disabled={
              authUser?.role?.name === "VIEWER" ||
              (authUser?.role?.name !== "ADMIN" && true)
            }
            type="submit"
            className="btn btn-primary"
          >
            Edit
          </button>
        </form>
      </ModalPopup>

      <PageHeader title="Users" />
      <button
        data-target="#userModalPopup"
        data-toggle="modal"
        className="btn btn-primary btn-sm mb-2"
      >
        Add new user
      </button>
      <div className="row">
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                {users && (
                  <table className="datatable table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User Name</th>
                        <th>Role</th>
                        <th>Last Login</th>
                        <th>Last Login IP</th>
                        <th>Phone</th>
                        {authUser?.role?.name === "SUPER-ADMIN" && (
                          <th>Password</th>
                        )}
                        <th>Created At</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        ?.filter((data) => data.role?.name !== "SUPER-ADMIN")
                        ?.map((data, index) => (
                          <tr key={data.id}>
                            <td>{index + 1}</td>
                            <td>{data.userName}</td>
                            <td>{data.role?.name}</td>
                            <td>{formatDateTime(data?.lastLoginTime)}</td>
                            <td>{data?.lastLoginIp}</td>
                            <td>{data?.phone}</td>
                            {authUser?.role?.name === "SUPER-ADMIN" && (
                              <td>{data?.plainPassword}</td>
                            )}
                            <td>{formatDate(data.createdAt)}</td>
                            <td className="text-right">
                              <div className="actions">
                                <a
                                  className="btn btn-sm bg-success-light mr-1"
                                  data-toggle="modal"
                                  href="#userEditModalPopup"
                                  onClick={() => handleEditShowModal(data.id)}
                                >
                                  <i className="fe fe-pencil"></i>
                                </a>
                                {/* <button
                                onClick={() => handleDeleteUser(data.id)}
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
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                {users && (
                  <table className="datatable table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User Name</th>
                        <th>Role</th>
                        <th>Last Login</th>
                        <th>Last Login IP</th>
                        <th>Phone</th>
                        {authUser?.role?.name === "SUPER-ADMIN" && (
                          <th>Password</th>
                        )}
                        <th>Created At</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        ?.filter((data) => data.role?.name === "SUPER-ADMIN")
                        ?.map((data, index) => (
                          <tr key={data.id}>
                            <td>{index + 1}</td>
                            <td>{data.userName}</td>
                            <td>{data.role?.name}</td>
                            <td>{formatDateTime(data?.lastLoginTime)}</td>
                            <td>{data?.lastLoginIp}</td>
                            <td>{data?.phone}</td>
                            {authUser?.role?.name === "SUPER-ADMIN" && (
                              <td>{data?.plainPassword}</td>
                            )}
                            <td>{formatDate(data.createdAt)}</td>
                            <td className="text-right">
                              <div className="actions">
                                <a
                                  className="btn btn-sm bg-success-light mr-1"
                                  data-toggle="modal"
                                  href="#userEditModalPopup"
                                  onClick={() => handleEditShowModal(data.id)}
                                >
                                  <i className="fe fe-pencil"></i>
                                </a>
                                {/* <button
                                onClick={() => handleDeleteUser(data.id)}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
