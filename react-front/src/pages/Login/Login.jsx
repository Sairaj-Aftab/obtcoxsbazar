import { useSelector } from "react-redux";
import PageLoader from "../../components/Loader/PageLoader";
import LoginForm from "../../components/LoginForm/LoginForm";
import { paribahanAuthData } from "../../features/paribahanAuth/paribahanAuthSlice";

const Login = () => {
  const { loader } = useSelector(paribahanAuthData);
  return <div>{loader ? <PageLoader /> : <LoginForm />}</div>;
};

export default Login;
