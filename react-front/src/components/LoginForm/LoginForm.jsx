import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const LoginForm = () => {
  const [paribahanName, setParibahanName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    if (!paribahanName || !password) {
      toast.error("All fields are required!");
    }
    try {
      const res = signIn("credentials", {
        redirect: false,
        paribahanName,
        password,
        callbackUrl: "/profile",
      }).then((res) => {
        console.log(res);
      });
      if (res.error) {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  return (
    <>
      <Toaster />
      <div
        className="flex justify-center items-center"
        style={{ height: "calc(100vh - 66px)" }}
      >
        <div className="bg-white p-8 rounded-lg sm:shadow-lg max-w-sm w-full">
          <div className="flex justify-center mb-4">
            <img
              src="https://via.placeholder.com/100"
              alt="Logo"
              className="h-20 w-20"
            />
          </div>
          <h2 className="text-2xl text-black font-bold text-center mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmitLogin}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="appearance-none border border-primary-color rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                id="username"
                type="paribahanName"
                placeholder="Username"
                value={paribahanName}
                onChange={(e) => setParibahanName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="appearance-none border border-primary-color rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none"
                id="password"
                type="password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-primary-color hover:bg-secondary-color text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
