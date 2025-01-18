import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader/PageHeader";
import { authData } from "../../features/auth/authSlice";
import { getAllData } from "../../features/user/userSlice";
import { formatDate } from "../../utils/timeAgo";
import { useEffect, useState } from "react";
import {
  createGuideInfo,
  deleteGuideInfo,
  getAllGuideInfo,
  updateGuideInfo,
} from "../../features/guideInfo/guideInfoApiSlice";
import { toast } from "react-hot-toast";
import {
  guideInfoData,
  setGuideInfoMessageEmpty,
} from "../../features/guideInfo/guideInfoSlice";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import swal from "sweetalert";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading/Loading";

const GuideInfo = () => {
  const dispatch = useDispatch();
  const { paribahanUsers } = useSelector(getAllData);
  const { authUser } = useSelector(authData);
  const { guideInfo, count, loader, message, error } =
    useSelector(guideInfoData);

  const [input, setInput] = useState({
    id: "",
    paribahanName: "",
    name: "",
    phone: "",
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
    if (!input.paribahanName || !input.name || !input.phone) {
      toast.error("Fields are required!");
    } else {
      dispatch(createGuideInfo({ id: input.id, data: input }));
    }
  };

  const [id, setId] = useState();
  const [infoData, setInfoData] = useState();
  const changeInfoData = (e) => {
    const { name, value } = e.target;
    setInfoData({ ...infoData, [name]: value });
  };
  const handleOpenUpdateForm = (id) => {
    const data = guideInfo.find((info) => info.id === id);
    setId(data.id);
    setInfoData({
      ...data,
    });
  };
  const handleUpdateInfo = (e) => {
    e.preventDefault();
    if (!infoData.name || !infoData.phone) {
      toast.error("All fields are required");
    } else {
      dispatch(updateGuideInfo({ id, data: infoData }));
    }
  };

  const handleDeleteInfo = (id) => {
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
        dispatch(deleteGuideInfo(id));
        dispatch(setGuideInfoMessageEmpty());
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
    dispatch(getAllGuideInfo({ page, limit: rowPage, search }));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setRowPage(newPerPage);
    dispatch(getAllGuideInfo({ page, limit: newPerPage, search }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(getAllGuideInfo({ page, limit: rowPage, search: e.target.value })); // Fetch schedules with the search term
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
      name: "Paribahan",
      selector: (data) => data.paribahanName,
      sortable: true,
    },
    {
      name: "Name",
      selector: (data) => data.name,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (data) => data.phone,
      sortable: true,
    },
    {
      name: "Address",
      selector: (data) => data.address,
      sortable: true,
    },
    {
      name: "Remark",
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
            data-target="#guideInfoEditPopup"
            data-toggle="modal"
            href="#edit_specialities_details"
            onClick={() => handleOpenUpdateForm(data.id)}
          >
            <i className="fe fe-pencil"></i>
          </a>
          <button
            onClick={() => handleDeleteInfo(data.id)}
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
    if (message) {
      toast.success(message);
      setInput({
        id: "",
        paribahanName: "",
        name: "",
        phone: "",
        address: "",
        comment: "",
        report: "",
      });
    }
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(setGuideInfoMessageEmpty());
    };
  }, [message, loader, error, dispatch]);
  return (
    <>
      {/* Create  Bus Info */}
      <ModalPopup title="Create Guide Info" target="createGuideInfoModal">
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
              placeholder="Guide Name"
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="phone"
              value={input.phone}
              onChange={changeInputValue}
              className="form-control"
              placeholder="Guide Phone Number"
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
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              authUser?.role?.name === "VIEWER" || loader ? true : false
            }
          >
            Create
          </button>
        </form>
      </ModalPopup>
      {/* Update Bus Info */}
      <ModalPopup title="Edit Guide Info" target="guideInfoEditPopup">
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
              placeholder="Guide Name"
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="phone"
              value={infoData?.phone}
              onChange={changeInfoData}
              className="form-control"
              placeholder="Guide Phone Number"
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
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              authUser?.role?.name === "VIEWER" || loader ? true : false
            }
          >
            Edit
          </button>
        </form>
      </ModalPopup>
      <PageHeader title="Guide Info" />
      <button
        data-target="#createGuideInfoModal"
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
        columns={columns}
        data={guideInfo}
        responsive
        progressPending={loader}
        progressComponent={<Loading />}
        pagination
        paginationServer
        paginationTotalRows={count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
    </>
  );
};

export default GuideInfo;
