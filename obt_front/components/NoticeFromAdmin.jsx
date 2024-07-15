"use client";

import { noticeData } from "@/lib/features/notice/noticeSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const NoticeFromAdmin = () => {
  const { adminNotices } = useSelector(noticeData);
  const [paribahanNotice, setParibahanNotice] = useState(null);

  useEffect(() => {
    const getParibahanNotice = () => {
      return adminNotices?.find((notice) => notice.status === "Passenger");
    };

    const notice = getParibahanNotice();
    setParibahanNotice(notice);
  }, [adminNotices]);
  return (
    <>
      <p className="text-base font-medium text-black mb-3">
        {paribahanNotice && (
          <marquee behavior="" direction="left">
            {paribahanNotice?.title}
          </marquee>
        )}
      </p>
    </>
  );
};

export default NoticeFromAdmin;
