import express from "express";
import colors from "colors";
import cookieParser from "cookie-parser";
import env from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import auth from "./routes/auth.js";
import info from "./routes/info.js";
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
import touristPermission from "./routes/touristBusEntryPermission.js";
import review from "./routes/review.js";
import visitor from "./routes/visitorCount.js";
import setting from "./routes/settings.js";
import errorHandler from "./middleware/errorHandler.js";
import lostAndFound from "./routes/lostAndFound.js";

const app = express();
const server = createServer(app);
// dotenv config
env.config();
const PORT = process.env.PORT || 5000;
const io = new Server(server, {
  cors: {
    origin: [
      process.env.LOCAL_DOMAIN1,
      process.env.LOCAL_DOMAIN2,
      process.env.LOCAL_DOMAIN3,
      process.env.ADMIN_DOMAIN1,
      process.env.ADMIN_DOMAIN2,
      process.env.MAIN_DOMAIN1,
      process.env.MAIN_DOMAIN2,
    ],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.LOCAL_DOMAIN1,
      process.env.LOCAL_DOMAIN2,
      process.env.LOCAL_DOMAIN3,
      process.env.ADMIN_DOMAIN1,
      process.env.ADMIN_DOMAIN2,
      process.env.MAIN_DOMAIN1,
      process.env.MAIN_DOMAIN2,
    ],
    credentials: true,
  })
);

app.use("/api/v1/auth", auth);
app.use("/api/v1/info", info);
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
app.use("/api/v1/tourist-permission", touristPermission);
app.use("/api/v1/lost-found", lostAndFound);
app.use("/api/v1/review", review);
app.use("/api/v1/visitorcount", visitor);
app.use("/api/v1/setting", setting);

// Error Handler
app.use(errorHandler);

// Socket Connection
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
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
