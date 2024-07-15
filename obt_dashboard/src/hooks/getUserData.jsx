import { useSelector } from "react-redux";
import { userData } from "../features/auth/authSlice";

const GetUserData = () => {
  const { user } = useSelector(userData);
  return { user };
};

export default GetUserData;
