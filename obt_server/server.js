import express from "express";
import colors from "colors";
import cookieParser from "cookie-parser";
import env from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import auth from "./routes/auth.js";
import paribahanUser from "./routes/paribahanUser.js";
import schedule from "./routes/schedule.js";
import regularSchedule from "./routes/regularSchedule.js";
import places from "./routes/places.js";
import permission from "./routes/permission.js";
import role from "./routes/role.js";
import notice from "./routes/notice.js";
import busInfo from "./routes/busInfo.js";
import guideInfo from "./routes/guideInfo.js";
import driverInfo from "./routes/driverInfo.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://admin.obtcoxsbazar.com",
      "https://www.admin.obtcoxsbazar.com",
<<<<<<< HEAD
      "http://obtcoxsbazar.com",
=======
>>>>>>> 8d823c24485235eac72605dee592f912579a6b5f
      "https://obtcoxsbazar.com",
      "https://www.obtcoxsbazar.com",
      "http://obtcoxsbazar.com",
    ],
    credentials: true,
  },
});
// dotenv config
env.config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://admin.obtcoxsbazar.com",
      "https://www.admin.obtcoxsbazar.com",
      "https://obtcoxsbazar.com",
<<<<<<< HEAD
=======
      "https://www.obtcoxsbazar.com",
>>>>>>> 8d823c24485235eac72605dee592f912579a6b5f
      "http://obtcoxsbazar.com",
    ],
    credentials: true,
  })
);

app.use("/api/v1/auth", auth);
app.use("/api/v1/paribahan", paribahanUser);
app.use("/api/v1/schedule", schedule);
app.use("/api/v1/rgschedule", regularSchedule);
app.use("/api/v1/place", places);
app.use("/api/v1/permission", permission);
app.use("/api/v1/role", role);
app.use("/api/v1/notice", notice);
app.use("/api/v1/businfo", busInfo);
app.use("/api/v1/guideinfo", guideInfo);
app.use("/api/v1/driverinfo", driverInfo);

// Error Handler
app.use(errorHandler);

// Socket Connection
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Make io accessible in routes
app.set("socketio", io);

// App listen
server.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
