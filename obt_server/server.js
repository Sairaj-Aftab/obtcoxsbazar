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
import places from "./routes/places.js";
import permission from "./routes/permission.js";
import role from "./routes/role.js";
import notice from "./routes/notice.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const server = createServer(app);
const io = new Server(server);
// dotenv config
env.config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/v1/auth", auth);
app.use("/api/v1/paribahan", paribahanUser);
app.use("/api/v1/schedule", schedule);
app.use("/api/v1/place", places);
app.use("/api/v1/permission", permission);
app.use("/api/v1/role", role);
app.use("/api/v1/notice", notice);

// Error Handler
app.use(errorHandler);

// Socket Connection
io.on("connection", (socket) => {
  console.log("a user connected");
});

// App listen
server.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
