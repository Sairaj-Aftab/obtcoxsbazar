import { useEffect, useState } from "react";
import useNotice from "../store/useNotice";

// eslint-disable-next-line react/prop-types
const NoticeFromAdmin = ({ status }) => {
  const { adminNotices } = useNotice();
  const [findNotice, setFindNotice] = useState(null);

  useEffect(() => {
    const getNotice = () => {
      return adminNotices?.notices?.find((notice) => notice.status === status);
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
