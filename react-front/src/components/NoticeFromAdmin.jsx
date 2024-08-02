"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { noticeData } from "../features/notice/noticeSlice";

const NoticeFromAdmin = ({ status }) => {
  const { adminNotices } = useSelector(noticeData);
  const [findNotice, setFindNotice] = useState(null);

  useEffect(() => {
    const getNotice = () => {
      return adminNotices?.find((notice) => notice.status === status);
    };

    const notice = getNotice();
    setFindNotice(notice);
  }, [adminNotices]);
  return (
    <>
      {findNotice && (
        <marquee behavior="" direction="left">
          {findNotice?.title}
        </marquee>
      )}
    </>
  );
};

export default NoticeFromAdmin;
