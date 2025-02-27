import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "react-hot-toast";
import router from "./routes/router";
import { useQuery } from "@tanstack/react-query";
import { getDataCount } from "./services/info.service";
import useDataCount from "./store/useDataCount";
import "./App.css";
import useAuth from "./store/useAuth";

function App() {
  const { setLogedInUser } = useAuth();
  const { setDataCount } = useDataCount();
  const { data: dataCount, isLoading } = useQuery({
    queryKey: ["dataCount"],
    queryFn: getDataCount,
  });
  // Set Data Count
  useEffect(() => {
    setDataCount({
      data: dataCount,
      isLoading,
    });
  }, [dataCount, isLoading, setDataCount]);

  useEffect(() => {
    setLogedInUser();
  }, [setLogedInUser]);

  return (
    <div>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
