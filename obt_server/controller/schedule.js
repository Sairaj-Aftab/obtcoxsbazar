import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug, slugToMainText } from "../utils/slug.js";
const prisma = new PrismaClient();

export const createSchedule = async (req, res, next) => {
  try {
    const { paribahanUserId } = req.params;
    const {
      busName,
      type,
      time,
      busNo,
      guideName,
      guidePhone,
      leavingPlace,
      destinationPlace,
      rent,
      seatStatus,
    } = req.body;

    // Hash the password
    const busSchedule = await prisma.busSchedule.create({
      data: {
        busName,
        slug: createSlug(busName),
        type,
        time,
        busNo,
        guideName,
        guidePhone,
        leavingPlace,
        destinationPlace,
        rent: Number(rent),
        seatStatus: seatStatus === "true" ? true : false,
        paribahanUserId: String(paribahanUserId),
      },
      include: {
        paribahanUser: true,
      },
    });

    if (busSchedule) {
      const io = req.app.get("socketio");
      io.emit("data-created", busSchedule);
    }

    return res
      .status(200)
      .json({ busSchedule, message: "Created successfully" });
  } catch (error) {
    return next(error);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      type,
      time,
      busNo,
      guideName,
      guidePhone,
      leavingPlace,
      destinationPlace,
      rent,
      seatStatus,
    } = req.body;
    const busSchedule = await prisma.busSchedule.update({
      where: {
        id: String(id), // Convert id to number
      },
      data: {
        type,
        time,
        busNo,
        guideName,
        guidePhone,
        leavingPlace,
        destinationPlace,
        rent: Number(rent),
        seatStatus: seatStatus === "true" ? true : false,
      },
      include: {
        paribahanUser: true,
      },
    });

    // For Socket Io
    if (busSchedule) {
      const io = req.app.get("socketio");
      io.emit("data-updated", busSchedule);
    }

    return res
      .status(200)
      .json({ busSchedule, message: "Updated successfully" });
  } catch (error) {
    return next(error);
  }
};

export const getAllSchedules = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search;

    const where = searchQuery
      ? {
          OR: [
            { time: { contains: searchQuery, mode: "insensitive" } },
            { busName: { contains: searchQuery, mode: "insensitive" } },
            { busNo: { contains: searchQuery, mode: "insensitive" } },
            {
              destinationPlace: { contains: searchQuery, mode: "insensitive" },
            },
            { leavingPlace: { contains: searchQuery, mode: "insensitive" } },
            { guideName: { contains: searchQuery, mode: "insensitive" } },
            { guidePhone: { contains: searchQuery, mode: "insensitive" } },
            { type: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {};

    const schedules = await prisma.busSchedule.findMany({
      skip: offset,
      take: limit,
      where,
      include: {
        paribahanUser: true,
      },
      orderBy: {
        time: "desc",
      },
    });

    const count = await prisma.busSchedule.count();
    const searchCount = await prisma.busSchedule.count({
      where,
    });

    if (schedules.length < 1) {
      return next(createError(400, "Cannot find any schedule!"));
    }
    return res.status(200).json({ schedules, count, searchCount });
  } catch (error) {
    return next(error);
  }
};

export const getTodaysSchedules = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 500;
    const offset = (page - 1) * limit;

    // Calculate the start and end of today
    const now = new Date();
    const startOfDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(startOfDay.getUTCDate() + 1); // Set to midnight of the next day

    const schedules = await prisma.busSchedule.findMany({
      where: {
        time: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        paribahanUser: true,
      },
      orderBy: {
        time: "desc",
      },
      skip: offset,
      take: limit,
    });

    const count = await prisma.busSchedule.count({
      where: {
        time: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (schedules.length < 1) {
      return next(createError(400, "Cannot find any schedule!"));
    }

    console.log(schedules);

    return res.status(200).json({ schedules, count });
  } catch (error) {
    return next(error);
  }
};

export const getSchedulesByLimit = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    const schedules = await prisma.busSchedule.findMany({
      include: {
        paribahanUser: true,
      },
      orderBy: {
        time: "asc",
      },
      take: limit,
    });

    const count = await prisma.busSchedule.count();

    if (schedules.length < 1) {
      return next(createError(400, "Cannot find any schedule!"));
    }
    return res.status(200).json({ schedules, count });
  } catch (error) {
    return next(error);
  }
};
export const todaySchedule = async (req, res, next) => {
  try {
    const schedules = await prisma.busSchedule.findMany({
      include: {
        paribahanUser: true,
      },
      orderBy: {
        time: "asc",
      },
    });

    if (schedules.length < 1) {
      return next(createError(400, "Cannot find any schedule!"));
    }
    return res.status(200).json({ schedules });
  } catch (error) {
    return next(error);
  }
};

export const getSchedulesByParibahanUserId = async (req, res, next) => {
  try {
    const { paribahanUserId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    const schedules = await prisma.busSchedule.findMany({
      where: {
        paribahanUserId: String(paribahanUserId),
      },
      orderBy: {
        time: "asc",
      },
      take: limit,
      include: {
        paribahanUser: true,
      },
    });
    if (schedules.length < 1) {
      return next(createError(400, "Cannot find any schedule!"));
    }
    return res.status(200).json({ schedules });
  } catch (error) {
    return next(error);
  }
};

export const getSchedulesByPlace = async (req, res, next) => {
  try {
    const { destination } = req.params;
    const schedules = await prisma.busSchedule.findMany({
      where: {
        destinationPlace: slugToMainText(destination),
      },
      orderBy: {
        time: "asc",
      },
      include: {
        paribahanUser: true,
      },
    });
    if (!schedules) {
      return next(createError(400, "Cannot find any schedule!"));
    }
    if (schedules.length < 1) {
      return next(createError(400, "Cannot find any schedule!"));
    }
    return res.status(200).json({ schedules });
  } catch (error) {
    return next(error);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedule = await prisma.busSchedule.delete({
      where: {
        id: String(id),
      },
    });

    if (schedule) {
      const io = req.app.get("socketio");
      io.emit("data-deleted", schedule.id);
    }

    return res.status(200).json({ schedule, message: "Deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

// const formatDate = (date) => {
//   return date.toISOString().replace("T", " ").replace(/\..+/, "");
// };

// cron.schedule("* * * * *", async () => {
//   try {
//     const now = new Date();
//     const fifteenMinutesAgo = new Date(now.getTime() - 30000);

//     // Delete schedules that ended more than 15 minutes ago
//     const data = await prisma.busSchedule.deleteMany({
//       where: {
//         time: {
//           lte: formatDate(fifteenMinutesAgo),
//         },
//       },
//     });
//     console.log(data);

//     console.log("Expired schedules deleted successfully");
//   } catch (error) {
//     console.error("Error deleting expired schedules:", error);
//   }
// });
