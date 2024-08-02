import { createBrowserRouter } from "react-router-dom";
import publicRoutes from "./publicRouter";
import privateRoutes from "./privateRoutes";

const router = createBrowserRouter([...publicRoutes, ...privateRoutes]);

export default router;
