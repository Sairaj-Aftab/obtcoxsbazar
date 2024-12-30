import PageLoader from "../../components/Loader/PageLoader";
import LoginForm from "../../components/LoginForm/LoginForm";
import useParibahanAuth from "../../store/useParibahanAuth";

const Login = () => {
  const { loader } = useParibahanAuth();
  return (
    <div className="bg-gradient-to-br to-primary-color/70 via-transparent from-yellow/70">
      {loader ? <PageLoader /> : <LoginForm />}
    </div>
  );
};

export default Login;
