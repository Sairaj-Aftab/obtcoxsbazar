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
  getAllBusInfo,
  updateBusInfo,
} from "../../features/busInfo/busInfoApiSlice";
import { toast } from "react-hot-toast";
import { getAllData } from "../../features/user/userSlice";
import swal from "sweetalert";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading/Loading";

const BusInfo = () => {
  const dispatch = useDispatch();
  const { paribahanUsers } = useSelector(getAllData);
  const { authUser } = useSelector(authData);
  const { busInfo, totalCount, searchCount, loader, message, error } =
    useSelector(busInfoData);

  const [input, setInput] = useState({
    id: "",
    paribahanName: "",
    regNo: "",
    type: "",
    comment: "",
    report: "",
    fcExpire: "",
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

  const [infoDetails, setInfoDetails] = useState({});

  const handleShowBusInfo = (id) => {
    const selectedDetails = busInfo?.find((det) => det.id === id);
    if (selectedDetails) {
      setInfoDetails(selectedDetails);
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

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const handlePageChange = (page) => {
    setPage(page);
    dispatch(getAllBusInfo({ page, limit: rowPage, search }));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    dispatch(getAllBusInfo({ page, limit: newPerPage, search }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(getAllBusInfo({ page, limit: rowPage, search: e.target.value })); // Fetch schedules with the search term
  };

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
      width: "60px",
    },
    {
      name: "View",
      cell: (data) => (
        <a
          data-target="#showdetails"
          data-toggle="modal"
          href="#edit_specialities_details"
          rel="noreferrer"
          onClick={() => handleShowBusInfo(data.id)}
        >
          <i
            className="fa fa-eye"
            style={{ color: "#00d0f1", fontSize: "17px" }}
          ></i>
        </a>
      ),
      width: "60px",
    },
    {
      name: "Paribahan",
      selector: (data) => data.paribahanName,
      sortable: true,
    },
    {
      name: "Reg No",
      selector: (data) => data.regNo,
      sortable: true,
    },
    {
      name: "Type",
      selector: (data) => data.type,
      sortable: true,
    },
    {
      name: "QR Code",
      selector: (data) => data,
      cell: (data) => {
        return <img src={data.qrCode} alt="" style={{ width: "100px" }} />;
      },
      width: "110px",
    },
    {
      name: "FC Expire",
      selector: (data) => data.fcExpire,
      sortable: true,
      cell: (data) => {
        const currentDate = new Date();
        const fcExpireDate = new Date(data?.fcExpire);
        const isExpired = fcExpireDate < currentDate;

        return (
          <span
            style={{
              color: isExpired ? "red" : "inherit",
              textDecoration: isExpired ? "line-through" : "none",
            }}
          >
            {data.fcExpire}
          </span>
        );
      },
    },
    {
      name: "R. Permit",
      selector: (data) => data.comment,
      sortable: true,
    },
    {
      name: "Report",
      selector: (data) => data.report,
      sortable: true,
    },

    {
      name: "Entry Date",
      selector: (data) => formatDate(data.createdAt),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (data) => (
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
            disabled={authUser?.role?.name === "VIEWER" && true}
          >
            <i className="fe fe-trash"></i>
          </button>
        </div>
      ),
      right: true, // Align the column to the right
    },
  ];

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
      <ModalPopup title={infoDetails.paribahanName} target="showdetails">
        <div>
          {infoDetails?.regNo && (
            <p>
              <b>Registration No : </b> {infoDetails?.regNo}
            </p>
          )}
          {infoDetails?.type && (
            <p>
              <b>Type : </b> {infoDetails?.type}
            </p>
          )}
          {infoDetails?.fcExpire && (
            <p>
              <b>Fitness Expire : </b>
              <span
                style={{
                  color:
                    new Date(infoDetails.fcExpire) < new Date()
                      ? "red"
                      : "inherit",
                  textDecoration:
                    new Date(infoDetails.fcExpire) < new Date()
                      ? "line-through"
                      : "none",
                }}
              >
                {infoDetails.fcExpire}
              </span>
            </p>
          )}
          {infoDetails?.comment && (
            <p>
              <b>Route Permit : </b> {infoDetails?.comment}
            </p>
          )}
          {infoDetails?.report && (
            <p>
              <b>Report : </b> {infoDetails?.report}
            </p>
          )}
        </div>
      </ModalPopup>
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
              placeholder="Remark"
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
          <div className="form-group">
            <label htmlFor="fcExpire">Fitness Certificate Expire</label>
            <input
              type="date"
              id="fcExpire"
              name="fcExpire"
              value={input.fcExpire}
              onChange={changeInputValue}
              className="form-control"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              authUser?.role?.name === "VIEWER" || loader ? true : false
            }
          >
            {loader ? "Creating..." : "Create"}
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
              placeholder="Remark"
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
          <div className="form-group">
            <label htmlFor="fcExpire">Fitness Certificate Expire</label>
            <input
              type="date"
              id="fcExpire"
              name="fcExpire"
              value={infoData?.fcExpire ? infoData?.fcExpire : ""}
              onChange={changeInfoData}
              className="form-control"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              authUser?.role?.name === "VIEWER" || loader ? true : false
            }
          >
            {loader ? "Editing..." : "Edit"}
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
      <input
        type="text"
        placeholder="Search"
        className="form-control table-search-box"
        onChange={handleSearchChange}
      />

      <DataTable
        // title="Regular Schedules"
        columns={columns}
        data={busInfo}
        responsive
        progressPending={loader}
        progressComponent={<Loading />}
        pagination
        paginationServer
        paginationTotalRows={searchCount ? searchCount : totalCount}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
    </>
  );
};

export default BusInfo;
