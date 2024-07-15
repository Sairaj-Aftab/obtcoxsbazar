"use client";
// import { getLogedInUser } from "@/lib/features/busAuth/busAuthApiSlice";
import { store } from "@/lib/store";
import { Provider } from "react-redux";

const StoreProvider = ({ children }) => {
  //   const dispatch = useDispatch();
  //   useEffect(() => {
  //     if (localStorage.getItem("busAuth")) {
  //       dispatch(getLogedInUser());
  //     }
  //   }, [dispatch]);
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
