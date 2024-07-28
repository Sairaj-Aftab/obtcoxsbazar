import { useEffect, useState } from "react";
import { loginAuthUser } from "../../features/auth/authApiSlice";
import { authData, setMessageEmpty } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import WhiteLogo from "../../components/Logo/WhiteLogo";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, message, authUser } = useSelector(authData);
  const [input, setInput] = useState({
    userName: "",
    password: "",
  });

  const handleChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!input.userName || !input.password) {
      toast.error("All fields are required");
    } else {
      dispatch(
        loginAuthUser({ userName: input.userName, password: input.password })
      );
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
      setInput({
        userName: "",
        password: "",
      });
    }
    if (authUser) {
      navigate("/");
    }
    return () => {
      dispatch(setMessageEmpty());
    };
  }, [dispatch, error, message]);
  return (
    <div className="main-wrapper login-body">
      <div className="login-wrapper">
        <div className="container">
          <div className="loginbox">
            <div className="login-left">
              {/* <h1 className="text-light">OBTCOXSBAZAR</h1> */}
              <WhiteLogo />
            </div>
            <div className="login-right">
              <div className="login-right-wrap">
                <h1>Login</h1>
                <p className="account-subtitle">Access to our dashboard</p>

                <form onSubmit={handleSubmitForm}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      name="userName"
                      placeholder="Username"
                      value={input.userName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      name="password"
                      placeholder="Password"
                      value={input.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary btn-block" type="submit">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
