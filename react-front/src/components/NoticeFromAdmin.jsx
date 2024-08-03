import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { noticeData } from "../features/notice/noticeSlice";

// eslint-disable-next-line react/prop-types
const NoticeFromAdmin = ({ status }) => {
  const { adminNotices } = useSelector(noticeData);
  const [findNotice, setFindNotice] = useState(null);

  useEffect(() => {
    const getNotice = () => {
      return adminNotices?.find((notice) => notice.status === status);
    };

    const notice = getNotice();
    setFindNotice(notice);
  }, [adminNotices, status]);
  return (
    <>
      {findNotice && (
        // eslint-disable-next-line react/no-unknown-property
        <marquee behavior="" direction="left">
          {findNotice?.title}
        </marquee>
      )}
    </>
  );
};

export default NoticeFromAdmin;
