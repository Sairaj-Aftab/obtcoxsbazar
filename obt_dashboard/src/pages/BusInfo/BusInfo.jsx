import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader/PageHeader";
import { authData } from "../../features/auth/authSlice";
import {
  busInfoData,
  setBusInfoMessageEmpty,
} from "../../features/busInfo/busInfoSlice";
import { formatDate } from "../../utils/timeAgo";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import { useEffect, useState } from "react";
import {
  createBusInfo,
  deleteBusInfo,
  updateBusInfo,
} from "../../features/busInfo/busInfoApiSlice";
import { toast } from "react-hot-toast";
import { getAllData } from "../../features/user/userSlice";
import swal from "sweetalert";

const BusInfo = () => {
  const dispatch = useDispatch();
  const { paribahanUsers } = useSelector(getAllData);
  const { authUser } = useSelector(authData);
  const { busInfo, message, error } = useSelector(busInfoData);

  const [input, setInput] = useState({
    id: "",
    paribahanName: "",
    regNo: "",
    type: "",
    comment: "",
  });
  const changeInputValue = (e) => {
    const { name, value } = e.target;
    if (name === "paribahanName") {
      const selectedParibahan = paribahanUsers.find(
        (paribahan) => paribahan.paribahanName === value
      );
      if (selectedParibahan) {
        setInput({
          ...input,
          paribahanName: selectedParibahan.paribahanName,
          id: selectedParibahan.id,
        });
      } else {
        setInput({ ...input, paribahanName: value, id: "" });
      }
    } else {
      setInput({ ...input, [name]: value });
    }
  };
  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (!input.paribahanName || !input.regNo || !input.type) {
      toast.error("Fields are required!");
    } else {
      dispatch(createBusInfo({ id: input.id, data: input }));
    }
  };
  const [id, setId] = useState();
  const [infoData, setInfoData] = useState();
  const changeInfoData = (e) => {
    const { name, value } = e.target;
    if (name === "paribahanName") {
      const selectedParibahan = paribahanUsers.find(
        (paribahan) => paribahan.paribahanName === value
      );
      if (selectedParibahan) {
        setInfoData({
          ...infoData,
          paribahanName: selectedParibahan.paribahanName,
          id: selectedParibahan.id,
        });
      } else {
        setInfoData({ ...infoData, paribahanName: value, id: "" });
      }
    } else {
      setInfoData({ ...infoData, [name]: value });
    }
  };
  const handleOpenUpdateForm = (id) => {
    const data = busInfo.find((info) => info.id === id);
    setId(data.id);
    setInfoData({
      ...data,
    });
  };
  const handleUpdateInfo = (e) => {
    e.preventDefault();
    if (!infoData.paribahanName || !infoData.regNo || !infoData.type) {
      toast.error("All fields are required");
    } else {
      dispatch(updateBusInfo({ id, data: infoData }));
    }
  };
  const handleDeleteBusInfo = (id) => {
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
        dispatch(deleteBusInfo(id));
        dispatch(setBusInfoMessageEmpty());
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
      dispatch(setBusInfoMessageEmpty());
    };
  }, [dispatch, error, message]);
  return (
    <>
      {/* Create  Bus Info */}
      <ModalPopup title="Create Bus Info" target="createBusInfoModal">
        <form onSubmit={handleSubmitInfo}>
          <div className="form-group mb-2">
            <select
              name="id"
              id="id"
              value={input.id}
              onChange={changeInputValue}
              className="form-control d-none"
            >
              <option value="">Paribahan Id</option>
              {paribahanUsers?.map((data, index) => (
                <option key={index} value={data.id}>
                  {data.id}
                </option>
              ))}
            </select>
            <select
              name="paribahanName"
              id="paribahanName"
              value={input.paribahanName}
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
            <input
              type="text"
              name="regNo"
              value={input.regNo}
              onChange={changeInputValue}
              className="form-control"
              placeholder="Reg No"
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
              <option value="Double-decker">Double-decker</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="comment"
              value={input.comment}
              onChange={changeInputValue}
              className="form-control"
              placeholder="Comment"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
      </ModalPopup>
      {/* Update Bus Info */}
      <ModalPopup title="Edit Bus Info" target="busInfoEditPopup">
        <form onSubmit={handleUpdateInfo}>
          <div className="form-group mb-2">
            {/* <select
              name="id"
              id="id"
              value={infoData?.id}
              onChange={changeInfoData}
              className="form-control d-none"
            >
              <option value="">Paribahan Id</option>
              {paribahanUsers?.map((data, index) => (
                <option key={index} value={data.id}>
                  {data.id}
                </option>
              ))}
            </select>
            <select
              name="paribahanName"
              id="paribahanName"
              value={infoData?.paribahanName}
              onChange={changeInfoData}
              className="form-control"
            >
              <option value="">Paribahan Name</option>
              {paribahanUsers?.map((data, index) => (
                <option key={index} value={data.paribahanName}>
                  {data.paribahanName}
                </option>
              ))}
            </select> */}
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="regNo"
              value={infoData?.regNo}
              onChange={changeInfoData}
              className="form-control"
              placeholder="Reg No"
            />
          </div>
          <div className="form-group mb-2">
            <select
              name="type"
              id="type"
              value={infoData?.type}
              onChange={changeInfoData}
              className="form-control"
            >
              <option value="">Bus Type</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
              <option value="Sleeper Coach">Sleeper Coach</option>
              <option value="Double-decker">Double-decker</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="comment"
              value={infoData?.comment}
              onChange={changeInfoData}
              className="form-control"
              placeholder="Comment"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Edit
          </button>
        </form>
      </ModalPopup>
      <PageHeader title="Bus Info" />
      <button
        data-target="#createBusInfoModal"
        data-toggle="modal"
        className="btn btn-primary btn-sm mb-2"
        disabled={authUser?.role?.name === "VIEWER" && true}
      >
        Add new
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
                      <th>Reg No</th>
                      <th>Type</th>
                      <th>Remark</th>
                      <th>Created At</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {busInfo &&
                      busInfo?.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.paribahanName}</td>
                          <th>{data.regNo}</th>
                          <td>{data.type}</td>
                          <td>{data?.comment}</td>
                          <td>{formatDate(data.createdAt)}</td>
                          <td className="text-right">
                            <div className="actions">
                              <a
                                className="btn btn-sm bg-success-light mr-2"
                                data-target="#busInfoEditPopup"
                                data-toggle="modal"
                                href="#edit_specialities_details"
                                onClick={() => handleOpenUpdateForm(data.id)}
                              >
                                <i className="fe fe-pencil"></i>
                              </a>
                              <button
                                onClick={() => handleDeleteBusInfo(data.id)}
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

export default BusInfo;
