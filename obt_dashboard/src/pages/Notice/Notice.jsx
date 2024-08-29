import { useEffect, useState } from "react";
import DataTables from "datatables.net-dt";
import PageHeader from "../../components/PageHeader/PageHeader";
import { authData } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  noticeData,
  setNoticeMessageEmpty,
} from "../../features/notice/noticeSlice";
import toast from "react-hot-toast";
import {
  createAuthNotice,
  deleteAuthNotice,
} from "../../features/notice/noticeApiSlice";
import swal from "sweetalert";

const Notice = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(authData);
  const { authNotices, paribahanNotices, message, error } =
    useSelector(noticeData);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !status) {
      toast.error("Please fill all the fields");
    } else {
      dispatch(createAuthNotice({ id: authUser.id, data: { title, status } }));
    }
  };

  const handleDeleteNotice = (id) => {
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
        dispatch(deleteAuthNotice(id));
      }
    });
  };

  useEffect(() => {
    new DataTables(".datatable");
    if (message) {
      toast.success(message);
      setTitle("");
      setStatus("");
    }
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(setNoticeMessageEmpty());
    };
  }, [dispatch, message, error, authNotices]);
  return (
    <>
      <PageHeader title="Notice Board" />
      <form onSubmit={handleSubmit} className="d-flex mb-2">
        <input
          className="form-control mr-2"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add Notice"
        />
        <select
          className="form-control w-25 mr-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="Paribahan">Paribahan</option>
          <option value="Passenger">Passenger</option>
          <option value="Display">Display</option>
        </select>
        <button
          disabled={authUser?.role?.name === "VIEWER" && true}
          className="btn btn-primary"
          type="submit"
        >
          Submit
        </button>
      </form>

      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="datatable table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th className="text-right">Actions</th>
                      <th>User</th>
                      <th>Title & Explanation</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(authNotices || [])
                      .concat(paribahanNotices || [])
                      .map((data, index) => (
                        <tr key={data.id || index}>
                          <td>{index + 1}</td>
                          <td className="text-right">
                            <div className="actions">
                              <button
                                data-toggle="modal"
                                className="btn btn-sm bg-danger-light"
                                disabled={authUser?.role?.name === "VIEWER"}
                                onClick={() => handleDeleteNotice(data.id)}
                              >
                                <i className="fe fe-trash"></i>
                              </button>
                            </div>
                          </td>
                          <td>
                            {data?.authUser?.userName ||
                              data?.paribahanUser?.paribahanName}
                            {data?.authUser && " To "}
                            <span className="badge badge-success">
                              {data.status}
                            </span>
                          </td>
                          <td>
                            {data.title} <br />
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

export default Notice;
