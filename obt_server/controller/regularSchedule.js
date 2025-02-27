import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug, slugToMainText } from "../utils/slug.js";
const prisma = new PrismaClient();

export const createSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { busName, type, time, leavingPlace, destinationPlace, rent } =
      req.body;

    // Hash the password
    const busSchedule = await prisma.regularBusSchedule.create({
      data: {
        busName,
        slug: createSlug(busName),
        type,
        time,
        leavingPlace,
        destinationPlace,
        rent: Number(rent),
        paribahanUserId: String(id),
      },
    });

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
      busName,
      type,
      time,
      leavingPlace,
      destinationPlace,
      paribahanId,
      rent,
    } = req.body;

    const busSchedule = await prisma.regularBusSchedule.update({
      where: {
        id: String(id),
      },
      data: {
        busName,
        type,
        time,
        leavingPlace,
        destinationPlace,
        paribahanUserId: String(paribahanId),
        rent: Number(rent),
      },
    });

    return res
      .status(200)
      .json({ busSchedule, message: "Updated successfully" });
  } catch (error) {
    return next(error);
  }
};

export const getAllSchedules = async (req, res, next) => {
  try {
    const searchQuery = req.query.search;

    const where = searchQuery
      ? {
          OR: [
            { time: { contains: searchQuery, mode: "insensitive" } },
            { busName: { contains: searchQuery, mode: "insensitive" } },
            {
              destinationPlace: { contains: searchQuery, mode: "insensitive" },
            },
            { leavingPlace: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {};

    const schedules = await prisma.regularBusSchedule.findMany({
      where,
      orderBy: {
        time: "asc",
      },
    });

    const count = await prisma.regularBusSchedule.count();
    const searchCount = await prisma.regularBusSchedule.count({
      where,
    });

    return res.status(200).json({ schedules, count, searchCount });
  } catch (error) {
    return next(error);
  }
};

export const getSchedulesByParibahanId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search;

    // Construct where clause
    const whereClause = {
      paribahanUserId: String(id),
      OR: searchQuery
        ? [
            { busName: { contains: searchQuery, mode: "insensitive" } },
            { time: { contains: searchQuery, mode: "insensitive" } },
            { type: { contains: searchQuery, mode: "insensitive" } },
            {
              destinationPlace: { contains: searchQuery, mode: "insensitive" },
            },
          ]
        : undefined,
    };

    const schedules = await prisma.regularBusSchedule.findMany({
      skip: offset,
      take: limit,
      where: whereClause,
      orderBy: {
        time: "asc",
      },
    });

    const count = await prisma.regularBusSchedule.count({
      where: whereClause,
    });
    return res.status(200).json({ schedules, count });
  } catch (error) {
    return next(error);
  }
};
export const getSchedulesByPlace = async (req, res, next) => {
  try {
    const { destination } = req.params;
    const schedules = await prisma.regularBusSchedule.findMany({
      where: {
        destinationPlace: slugToMainText(destination),
      },
      orderBy: {
        time: "asc",
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
    const schedule = await prisma.regularBusSchedule.delete({
      where: {
        id: String(id),
      },
    });

    return res.status(200).json({ schedule, message: "Deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
