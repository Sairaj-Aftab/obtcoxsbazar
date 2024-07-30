import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader/PageHeader";
import { authData } from "../../features/auth/authSlice";
import { formatDate } from "../../utils/timeAgo";
import {
  driverInfoData,
  setDriverInfoMessageEmpty,
} from "../../features/driverInfo/driverInfoSlice";
import { getAllData } from "../../features/user/userSlice";
import { toast } from "react-hot-toast";
import {
  createDriverInfo,
  deleteDriverInfo,
  updateDriverInfo,
} from "../../features/driverInfo/driverInfoApiSlice";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import swal from "sweetalert";

const DriverInfo = () => {
  const dispatch = useDispatch();
  const { paribahanUsers } = useSelector(getAllData);
  const { authUser } = useSelector(authData);
  const { driverInfo, message, error } = useSelector(driverInfoData);

  const [input, setInput] = useState({
    id: "",
    paribahanName: "",
    name: "",
    phone: "",
    license: "",
    address: "",
    comment: "",
    report: "",
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
    if (!input.paribahanName || !input.name || !input.license) {
      toast.error("Fields are required!");
    } else {
      dispatch(createDriverInfo({ id: input.id, data: input }));
    }
  };

  const [id, setId] = useState();
  const [infoData, setInfoData] = useState();
  const changeInfoData = (e) => {
    const { name, value } = e.target;
    setInfoData({ ...infoData, [name]: value });
  };
  const handleOpenUpdateForm = (id) => {
    const data = driverInfo.find((info) => info.id === id);
    setId(data.id);
    setInfoData({
      ...data,
    });
  };
  const handleUpdateInfo = (e) => {
    e.preventDefault();
    if (!infoData.name) {
      toast.error("Name is required");
    } else {
      dispatch(updateDriverInfo({ id: Number(id), data: infoData }));
    }
  };
  const handleDeleteDriverInfo = (id) => {
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
        dispatch(deleteDriverInfo(id));
        dispatch(setDriverInfoMessageEmpty());
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      setInput({
        id: "",
        paribahanName: "",
        name: "",
        phone: "",
        license: "",
        address: "",
        comment: "",
        report: "",
      });
    }
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(setDriverInfoMessageEmpty());
    };
  }, [message, error, dispatch]);
  return (
    <>
      {/* Create  Bus Info */}
      <ModalPopup title="Create Guide Info" target="createDriverInfoModal">
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
              name="name"
              value={input.name}
              onChange={changeInputValue}
              className="form-control"
              placeholder="Driver Name"
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="phone"
              value={input.phone}
              onChange={changeInputValue}
              className="form-control"
              placeholder="Driver Phone Number"
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="license"
              value={input.license}
              onChange={changeInputValue}
              className="form-control"
              placeholder="Driver License"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="address"
              value={input.address}
              onChange={changeInputValue}
              className="form-control"
              placeholder="Address"
            />
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
          <div className="form-group">
            <input
              type="text"
              name="report"
              value={input.report}
              onChange={changeInputValue}
              className="form-control"
              placeholder="Report"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
      </ModalPopup>
      {/* Update Bus Info */}
      <ModalPopup title="Edit Guide Info" target="driverInfoEditPopup">
        <form onSubmit={handleUpdateInfo}>
          <div className="form-group mb-2">
            {/* <select
              name="id"
              id="id"
              value={infoData.id}
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
              value={infoData.paribahanName}
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
              name="name"
              value={infoData?.name}
              onChange={changeInfoData}
              className="form-control"
              placeholder="Driver Name"
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="phone"
              value={infoData?.phone}
              onChange={changeInfoData}
              className="form-control"
              placeholder="Driver Phone Number"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="license"
              value={infoData?.license}
              onChange={changeInfoData}
              className="form-control"
              placeholder="Driver License"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="address"
              value={infoData?.address}
              onChange={changeInfoData}
              className="form-control"
              placeholder="Address"
            />
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
          <div className="form-group">
            <input
              type="text"
              name="report"
              value={infoData?.report}
              onChange={changeInfoData}
              className="form-control"
              placeholder="Report"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Edit
          </button>
        </form>
      </ModalPopup>
      <PageHeader title="Driver Info" />
      <button
        data-target="#createDriverInfoModal"
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
                      <th>Name</th>
                      <th>Phone</th>
                      <th>License</th>
                      <th>Address</th>
                      <th>Remark</th>
                      <th>Report</th>
                      <th>Created At</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverInfo &&
                      driverInfo?.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.paribahanName}</td>
                          <th>{data.name}</th>
                          <td>{data?.phone}</td>
                          <td>{data?.license}</td>
                          <td>{data?.address}</td>
                          <td>{data?.comment}</td>
                          <td>{data?.report}</td>
                          <td>{formatDate(data.createdAt)}</td>
                          <td className="text-right">
                            <div className="actions">
                              <a
                                className="btn btn-sm bg-success-light mr-2"
                                data-target="#driverInfoEditPopup"
                                data-toggle="modal"
                                href="#edit_specialities_details"
                                onClick={() => handleOpenUpdateForm(data.id)}
                              >
                                <i className="fe fe-pencil"></i>
                              </a>
                              <button
                                onClick={() => handleDeleteDriverInfo(data.id)}
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

export default DriverInfo;
