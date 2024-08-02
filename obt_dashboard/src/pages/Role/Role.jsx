import swal from "sweetalert";
import DataTables from "datatables.net-dt";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { getAllData, setMessageEmpty } from "../../features/user/userSlice";
import { timeAgo } from "../../utils/timeAgo";
import FormInputValue from "../../hooks/formInputValue";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createRole,
  deleteRole,
  editRole,
  updateRoleStatus,
} from "../../features/user/userApiSllice";
import { authData } from "../../features/auth/authSlice";

const Role = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(authData);
  const { permissions, roles, error, message } = useSelector(getAllData);
  const { input, handleChangeValue, formReset } = FormInputValue({
    name: "",
  });

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
  };

  const handleSubmitNewRole = (e) => {
    e.preventDefault();
    if (!input.name || selected.length < 1) {
      toast.error("Please fill the fields");
    } else {
      dispatch(createRole({ name: input.name, permissions: selected }));
      dispatch(setMessageEmpty());
      formReset();
      setSelected([]);
    }
  };

  const handleDeleteRule = (id) => {
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
        dispatch(deleteRole(id));
        dispatch(setMessageEmpty());
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };

  const handleUpdateStatus = (id, status) => {
    dispatch(updateRoleStatus({ id, status }));
    dispatch(setMessageEmpty());
  };

  const [findRole, setFindRole] = useState({});

  const handleChangeEditValue = (e) => {
    setFindRole((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditRole = (id) => {
    const role = roles.find((data) => data.id == id);
    setFindRole(role);
    setSelected(role.permissions.map((permission) => permission.id));
  };

  const handleEditRuleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      editRole({ id: findRole.id, name: findRole.name, permissions: selected })
    );
    dispatch(setMessageEmpty());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (message) {
      toast.success(message);
    }

    return () => {
      dispatch(setMessageEmpty());
    };
  }, [dispatch, error, message]);

  return (
    <>
      {/* Rule Adding Form inside Modal Popup */}
      <ModalPopup title="Add New Role" target="modalPopup">
        <form onSubmit={handleSubmitNewRole} className="d-flex flex-column">
          <label htmlFor="name">*Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={input.name}
            onChange={handleChangeValue}
            className="form-control"
          />
          {permissions && (
            <div>
              <p className="my-2">*Permission</p>
              {permissions?.map((data, index) => (
                <label key={index} className="d-block">
                  <input
                    type="checkbox"
                    name="permissions"
                    value={data.id}
                    onChange={handleChangeCheckbox}
                    checked={selected.includes(data.id)}
                  />{" "}
                  {data.name}
                </label>
              ))}
            </div>
          )}
          <button
            disabled={authUser?.role?.name === "VIEWER" && true}
            type="submit"
            className="btn btn-primary mt-2"
          >
            Add
          </button>
        </form>
      </ModalPopup>
      {/* Rule Adding Form inside Modal Popup */}
      {/* Rule Edit Form inside Modal Popup */}
      <ModalPopup title="Edit Role" target="ruleEditPopup">
        <form onSubmit={handleEditRuleSubmit} className="d-flex flex-column">
          <label htmlFor="name">*Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={findRole.name}
            onChange={handleChangeEditValue}
            className="form-control"
          />
          {permissions && (
            <div>
              <p className="my-2">*Permission</p>
              {permissions.map((data, index) => {
                return (
                  <>
                    <label key={index} className="d-block">
                      <input
                        type="checkbox"
                        name="permissions"
                        value={data.id}
                        onChange={handleChangeCheckbox}
                        checked={selected.includes(data.id)}
                      />{" "}
                      {data.name}
                    </label>
                  </>
                );
              })}
            </div>
          )}
          <button
            disabled={authUser?.role?.name === "VIEWER" && true}
            type="submit"
            className="btn btn-primary mt-2"
          >
            Add
          </button>
        </form>
      </ModalPopup>
      {/* Rule Edit Form inside Modal Popup */}

      <PageHeader title="User Role" />
      <button
        data-target="#modalPopup"
        data-toggle="modal"
        className="btn btn-primary mb-3"
      >
        Add new rule
      </button>
      <div className="row">
        <div className="col-md-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="table-responsive">
                <table className="dataTable table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Permissions</th>
                      <th>Created At</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  {roles && (
                    <tbody>
                      {[...roles].reverse().map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.name}</td>
                            <td>{data.slug}</td>
                            <td>
                              <ul>
                                {data?.permissions?.map((per, index) => {
                                  return <li key={index}>{per.name}</li>;
                                })}
                              </ul>
                            </td>
                            <td>{timeAgo(data.createdAt)}</td>
                            <td>
                              <div className="status-toggle">
                                <input
                                  type="checkbox"
                                  id="status_1"
                                  className="check"
                                  checked={data.status ? true : false}
                                />
                                <label
                                  htmlFor="status_1"
                                  onClick={() =>
                                    handleUpdateStatus(data.id, data.status)
                                  }
                                  className="checktoggle"
                                >
                                  checkbox
                                </label>
                              </div>
                            </td>
                            <td className="text-right">
                              <button
                                data-target="#ruleEditPopup"
                                data-toggle="modal"
                                onClick={() => handleEditRole(data.id)}
                                className="border-0 bg-success text-light mr-2"
                              >
                                <i className="fa fa-pencil-square-o" />
                              </button>
                              <button
                                onClick={() => handleDeleteRule(data.id)}
                                className="border-0 bg-danger text-light"
                                disabled={
                                  authUser?.role?.name === "VIEWER" && true
                                }
                              >
                                <i className="fa fa-trash" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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

export default Role;
