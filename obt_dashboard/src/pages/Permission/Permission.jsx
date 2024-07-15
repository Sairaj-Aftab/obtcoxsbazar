import { useEffect, useState } from "react";
import DataTables from "datatables.net-dt";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { getAllData, setMessageEmpty } from "../../features/user/userSlice";
import { timeAgo } from "../../utils/timeAgo";
import toast from "react-hot-toast";
import swal from "sweetalert";
import {
  createPermission,
  deletePermission,
  updatePermissionStatus,
} from "../../features/user/userApiSllice";
import { authData } from "../../features/auth/authSlice";

const Permission = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(authData);

  const { permissions } = useSelector(getAllData);

  const [name, setName] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please fill the fields");
    } else {
      dispatch(createPermission(name));
      setName("");

      dispatch(setMessageEmpty());
    }
  };

  const handleDelete = (id) => {
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
        dispatch(deletePermission(id));
        dispatch(setMessageEmpty());
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };

  const handleChangeStatus = (id, status) => {
    dispatch(updatePermissionStatus({ id, status }));
    dispatch(setMessageEmpty());
  };
  useEffect(() => {
    new DataTables(".datatable");
  });
  return (
    <>
      <PageHeader title="User Permission" />
      <form onSubmit={handleCreate} className="d-flex mb-2">
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control mr-2"
          placeholder="Add new permission"
        />
        <button
          disabled={authUser?.role?.name === "VIEWER" && true}
          type="submit"
          className="btn btn-primary"
        >
          Add
        </button>
      </form>
      <div className="row">
        <div className="col-md-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="table-responsive">
                {permissions && (
                  <table className="dataTable table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissions.length > 0 &&
                        [...permissions].reverse().map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{data.name}</td>
                              <td>{data.slug}</td>
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
                                      handleChangeStatus(data.id, data.status)
                                    }
                                    className="checktoggle"
                                  >
                                    checkbox
                                  </label>
                                </div>
                              </td>
                              <td className="text-right">
                                <button
                                  onClick={() => handleDelete(data.id)}
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

export default Permission;
