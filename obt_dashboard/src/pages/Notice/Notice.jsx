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
  deleteParibahanNotice,
  updateAdminNotice,
  updateParibahanNotice,
} from "../../features/notice/noticeApiSlice";
import swal from "sweetalert";
import ModalPopup from "../../components/ModalPopup/ModalPopup";

const Notice = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(authData);
  const { authNotices, paribahanNotices, loader, message, error } =
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

  const [editNotice, setEditNotice] = useState({
    id: "",
    title: "",
    status: "",
  });
  const handleEditShowModal = (id) => {
    const noticeToEdit = (authNotices || [])
      .concat(paribahanNotices || [])
      .find((notice) => notice.id === id);
    if (noticeToEdit) {
      setEditNotice({
        id: noticeToEdit.id,
        title: noticeToEdit.title,
        status: noticeToEdit.status,
      });
    }
  };

  const handleEditNoticecSubmit = (e) => {
    e.preventDefault();
    const { id, title, status } = editNotice;

    if (!title) {
      toast.warning("Field is required!");
      return;
    }

    const validStatuses = [
      "Passenger",
      "Display",
      "Paribahan",
      "Tourist-Bus-Permission",
    ];

    if (validStatuses.includes(status)) {
      dispatch(updateAdminNotice({ id, title }));
    } else {
      dispatch(updateParibahanNotice({ id, title }));
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
        swal("Poof! Successfully deleted", {
          icon: "success",
        });
        // Check in both notices and dispatch the corresponding delete action
        const noticeToDelete = authNotices.find((notice) => notice.id === id)
          ? deleteAuthNotice
          : deleteParibahanNotice;

        dispatch(noticeToDelete(id));
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
          <option value="Tourist-Bus-Permission">Tourist Bus Permission</option>
        </select>
        <button
          disabled={authUser?.role?.name === "VIEWER" && true}
          className="btn btn-primary"
          type="submit"
        >
          Submit
        </button>
      </form>
      <ModalPopup title="Edit Notice" target="noticeEditPopup">
        <form onSubmit={handleEditNoticecSubmit}>
          <textarea
            id="editTitle"
            rows={5}
            className="form-control mb-3"
            value={editNotice?.title}
            onChange={(e) =>
              setEditNotice({ ...editNotice, title: e.target.value })
            }
          ></textarea>
          <button
            disabled={authUser?.role?.name === "VIEWER" && true}
            type="submit"
            className="btn btn-primary"
          >
            {loader ? "Editing..." : "Edit"}
          </button>
        </form>
      </ModalPopup>

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
                                data-target="#noticeEditPopup"
                                className="btn btn-sm bg-primary-light mr-1"
                                disabled={authUser?.role?.name === "VIEWER"}
                                onClick={() => handleEditShowModal(data.id)}
                              >
                                <i className="fe fe-pencil"></i>
                              </button>
                              <button
                                data-toggle="modal"
                                className="btn btn-sm bg-danger-light"
                                disabled={authUser?.role?.name === "VIEWER"}
                                onClick={() => handleDelete(data.id)}
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
