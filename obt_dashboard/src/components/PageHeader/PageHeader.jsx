import { useSelector } from "react-redux";
import { authData } from "../../features/auth/authSlice";

const PageHeader = ({ title }) => {
  const { authUser } = useSelector(authData);
  return (
    <div className="page-header">
      <div className="row">
        <div className="col-sm-12">
          <h3 className="page-title">Welcome {authUser?.userName}</h3>
          <ul className="breadcrumb">
            <li className="breadcrumb-item active">{title}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
