import { useSelector } from "react-redux";
import PageLoader from "../../components/Loader/PageLoader";
import LoginForm from "../../components/LoginForm/LoginForm";
import { paribahanAuthData } from "../../features/paribahanAuth/paribahanAuthSlice";

const Login = () => {
  const { loader } = useSelector(paribahanAuthData);
  return (
    <div className="bg-gradient-to-br to-primary-color/70 via-transparent from-yellow/70">
      {loader ? <PageLoader /> : <LoginForm />}
    </div>
  );
};

export default Login;
