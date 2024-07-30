import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug, slugToMainText } from "../utils/slug.js";
const prisma = new PrismaClient();

export const createSchedule = async (req, res, next) => {
  try {
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
    const { type, time, leavingPlace, destinationPlace, rent } = req.body;
    const busSchedule = await prisma.regularBusSchedule.update({
      where: {
        id: Number(id), // Convert id to number
      },
      data: {
        type,
        time,
        leavingPlace,
        destinationPlace,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const schedules = await prisma.regularBusSchedule.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        time: "asc",
      },
    });

    const count = await prisma.regularBusSchedule.count();

    if (schedules.length < 1) {
      return next(createError(400, "Cannot find any schedule!"));
    }
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
        id: Number(id),
      },
    });

    return res.status(200).json({ schedule, message: "Deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
