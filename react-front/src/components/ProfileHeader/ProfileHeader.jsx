/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import NoticeFromAdmin from "../NoticeFromAdmin";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  noticeData,
  setNoticeMessageEmpty,
} from "../../features/notice/noticeSlice";
import {
  createParibahanNotice,
  deleteNotice,
} from "../../features/notice/noticeApiSlice";
import { paribahanAuthData } from "../../features/paribahanAuth/paribahanAuthSlice";
import { logoutAuthUser } from "../../features/paribahanAuth/paribahanAuthApiSlice";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { paribahanAuth: user } = useSelector(paribahanAuthData);
  const { pathname: pathName } = useLocation();
  const dispatch = useDispatch();
  const { paribahanNotices, loader, error, message } = useSelector(noticeData);
  const [notice, setNotice] = useState("");
  const handleSubmitNotice = (e) => {
    e.preventDefault();
    if (!notice) {
      toast.error("All field is required");
    } else {
      dispatch(createParibahanNotice({ id: user.id, data: { title: notice } }));
    }
  };

  // handle logout
  const handleLogout = () => {
    dispatch(logoutAuthUser());
  };

  const [paribahanNotice, setParibahanNotice] = useState(null);

  useEffect(() => {
    const getParibahanNotice = () => {
      return paribahanNotices?.find(
        (notice) => notice.paribahanUserId === user.id
      );
    };

    const notice = getParibahanNotice();
    setParibahanNotice(notice);
  }, [paribahanNotices, user]);

  const deleteSingleNotice = () => {
    dispatch(deleteNotice(paribahanNotice.id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
    }
    if (!user) {
      navigate("/login");
    }
    if (error || message) {
      dispatch(setNoticeMessageEmpty());
    }
  }, [user, dispatch, error, message, navigate]);

  return (
    <>
      <div className="container mx-auto bg-white p-5 my-5 rounded-lg">
        {/* Profile Header Section */}
        <div className="flex justify-between items-start ">
          <div>
            <h1 className="text-2xl font-medium text-gray-700">
              <span className="text-primary-color">{user?.paribahanName}</span>
            </h1>
            <p className="text-lg font-medium text-gray-700">
              Sales Number:{" "}
              <span className="text-primary-color">{user?.salesNumber}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-primary-color py-1 px-2 text-base font-medium text-white rounded"
          >
            Logout
          </button>
        </div>

        <div className="text-base font-semibold pb-5 sm:flex gap-1">
          <p className="sm:basis-4/12 lg:basis-2/12 hidden sm:block">
            Notice from Traffic Police :
          </p>
          <p className="sm:basis-8/12 lg:basis-10/12">
            <NoticeFromAdmin status="Paribahan" />
          </p>
        </div>
        <div className="pt-5 border-t border-gray  mb-2">
          {paribahanNotice ? (
            <div className="flex gap-1 items-center justify-between">
              <p className="w-full">
                <marquee behavior="" direction="">
                  {paribahanNotice?.title}
                </marquee>
              </p>
              <button
                onClick={deleteSingleNotice}
                className="bg-red py-1 px-2 text-base font-medium text-white rounded"
              >
                Delete
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitNotice} className="flex gap-1">
              <input
                type="text"
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
                placeholder="Notice to Passenger"
              />
              <button
                type="submit"
                className="bg-primary-color py-1 px-2 rounded text-white text-base font-medium"
                disabled={loader}
              >
                {loader ? "Submiting..." : "Submit"}
              </button>
            </form>
          )}
        </div>
        {/* Menu */}
        <ul className="flex gap-3 justify-between md:justify-center flex-wrap mt-3">
          <li>
            <Link
              to="/profile"
              className={`${
                pathName === "/profile"
                  ? "bg-primary-color text-white"
                  : "bg-gray-200 text-primary-color"
              } border border-primary-color text-sm sm:text-base font-medium py-1 px-1 sm:px-2 rounded-md`}
            >
              Schedule
            </Link>
          </li>
          <li>
            <Link
              to="/profile/regular-schedules"
              className={`${
                pathName === "/profile/regular-schedules"
                  ? "bg-primary-color text-white"
                  : "bg-gray-200 text-primary-color"
              } border border-primary-color text-sm sm:text-base font-medium py-1 px-1 sm:px-2 rounded-md`}
            >
              Reg. Schedule
            </Link>
          </li>
          <li>
            <Link
              to="/profile/bus-info"
              className={`${
                pathName === "/profile/bus-info"
                  ? "bg-primary-color text-white"
                  : "bg-gray-200 text-primary-color"
              } border border-primary-color text-sm sm:text-base font-medium py-1 px-1 sm:px-2 rounded-md`}
            >
              Bus Info
            </Link>
          </li>
          <li>
            <Link
              to="/profile/guide-info"
              className={`${
                pathName === "/profile/guide-info"
                  ? "bg-primary-color text-white"
                  : "bg-gray-200 text-primary-color"
              } border border-primary-color text-sm sm:text-base font-medium py-1 px-1 sm:px-2 rounded-md`}
            >
              Guide Info
            </Link>
          </li>
          <li>
            <Link
              to="/profile/driver-info"
              className={`${
                pathName === "/profile/driver-info"
                  ? "bg-primary-color text-white"
                  : "bg-gray-200 text-primary-color"
              } border border-primary-color text-sm sm:text-base font-medium py-1 px-1 sm:px-2 rounded-md`}
            >
              Driver Info
            </Link>
          </li>
          <li>
            <Link
              to="/profile/reviews"
              className={`${
                pathName === "/profile/reviews"
                  ? "bg-primary-color text-white"
                  : "bg-gray-200 text-primary-color"
              } border border-primary-color text-sm sm:text-base font-medium py-1 px-1 sm:px-2 rounded-md`}
            >
              Reviews
            </Link>
          </li>
        </ul>
      </div>
      <Outlet />
    </>
  );
};

export default ProfileHeader;
