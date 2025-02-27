import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
const prisma = new PrismaClient();

export const getCountInfo = async (req, res, next) => {
  try {
    // Calculate the start and end of today
    const today = new Date();
    const startOfToday = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
    );
    const endOfToday = new Date(
      Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      )
    );

    // Base filter with time range
    const baseFilter = {
      time: {
        gte: startOfToday.toISOString().slice(0, 16),
        lte: endOfToday.toISOString().slice(0, 16),
      },
    };
    const todaysSchedulesCount = await prisma.busSchedule.count({
      where: baseFilter,
    });
    const totalSchedulesCount = await prisma.busSchedule.count();
    const totalRegularSchedulesCount = await prisma.regularBusSchedule.count();
    const totalParibahansCompanyCount = await prisma.paribahanUser.count();
    const totalParibahansCount = await prisma.busInfo.count();
    const totalDriverCount = await prisma.driverInfo.count();
    const totalGuideCount = await prisma.guideInfo.count();
    const totalPermissionCount = await prisma.touristBusEntryPermission.count();

    return res.status(200).json({
      todaysSchedulesCount,
      totalSchedulesCount,
      totalRegularSchedulesCount,
      totalParibahansCompanyCount,
      totalParibahansCount,
      totalDriverCount,
      totalGuideCount,
      totalPermissionCount,
    });
  } catch (error) {
    return next(error);
  }
};
