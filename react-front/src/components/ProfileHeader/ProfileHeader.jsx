/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NoticeFromAdmin from "../NoticeFromAdmin";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useNotice from "../../store/useNotice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createParibahanNotice,
  deleteNotice,
} from "../../services/notice.service";
import useParibahanAuth from "../../store/useParibahanAuth";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Loader2, LogOut } from "lucide-react";

const ProfileHeader = () => {
  const queryClient = useQueryClient();
  const {
    paribahanAuth: user,
    setLogout,
    loader,
    error,
    message,
  } = useParibahanAuth();
  const navigate = useNavigate();
  const { pathname: pathName } = useLocation();
  const { paribahanNotices } = useNotice();
  const [notice, setNotice] = useState("");
  const {
    mutateAsync: createNotice,
    data: createData,
    isSuccess: createSuccess,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: createParibahanNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paribahanNotices"] });
    },
  });
  const { mutateAsync: deleteNoticeData } = useMutation({
    mutationFn: deleteNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["paribahanNotices"],
      });
    },
  });
  const handleSubmitNotice = async (e) => {
    e.preventDefault();
    if (!notice) {
      toast.error("All field is required");
    } else {
      await createNotice({ id: user.id, data: { title: notice } });
    }
  };

  // handle logout
  const handleLogout = async () => {
    await setLogout();
  };

  const [paribahanNotice, setParibahanNotice] = useState(null);

  useEffect(() => {
    const getParibahanNotice = () => {
      return paribahanNotices?.notices?.find(
        (notice) => notice.paribahanUserId === user.id
      );
    };

    const notice = getParibahanNotice();
    setParibahanNotice(notice);
  }, [paribahanNotices, user]);

  const deleteSingleNotice = async () => {
    await deleteNoticeData(paribahanNotice.id);
  };

  useEffect(() => {
    if (createError || error) {
      toast.error(createError?.message || error);
    }
    if (createSuccess || createData || message) {
      toast.success(createData?.message || message);
    }
    if (!user) {
      navigate("/login");
    }
  }, [createData, createError, createSuccess, error, message, navigate, user]);

  return (
    <>
      <Card className="container mx-auto bg-white p-5 my-5 shadow-md">
        {/* Profile Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              {user?.paribahanName}
            </h1>
            <div className="flex items-center mt-1">
              <span className="text-muted-foreground">Sales Number:</span>
              <Badge variant="outline" className="ml-2">
                {user?.salesNumber}
              </Badge>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            disabled={loader}
          >
            {loader ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            Logout
          </Button>
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
              <Button
                type="submit"
                className="bg-primary-color text-white"
                disabled={createLoading}
              >
                {createLoading ? "Submiting..." : "Submit"}
              </Button>
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
              to="/profile/schedule-logs"
              className={`${
                pathName === "/profile/schedule-logs"
                  ? "bg-primary-color text-white"
                  : "bg-gray-200 text-primary-color"
              } border border-primary-color text-sm sm:text-base font-medium py-1 px-1 sm:px-2 rounded-md`}
            >
              Schedule Logs
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
      </Card>
      <Outlet />
    </>
  );
};

export default ProfileHeader;
