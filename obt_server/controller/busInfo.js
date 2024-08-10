import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug } from "../utils/slug.js";
const prisma = new PrismaClient();

export const createBusInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paribahanName, regNo, type, comment, report } = req.body;

    const existingInfo = await prisma.busInfo.findUnique({
      where: {
        regNo,
      },
    });
    if (existingInfo) {
      return next(createError(400, "Already exist!"));
    }

    // Create
    const busInfo = await prisma.busInfo.create({
      data: {
        paribahanName,
        slug: createSlug(paribahanName),
        regNo,
        type,
        comment,
        report,
        paribahanUserId: String(id),
      },
      include: {
        paribahanUser: true,
      },
    });

    return res.status(200).json({ busInfo, message: "Created successfully" });
  } catch (error) {
    return next(error);
  }
};

export const updateBusInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { regNo, type, comment, report } = req.body;
    const existingInfo = await prisma.busInfo.findFirst({
      where: {
        regNo,
        id: {
          not: String(id),
        },
      },
    });
    if (existingInfo) {
      return next(createError(400, "Already exist!"));
    }
    const busInfo = await prisma.busInfo.update({
      where: {
        id: String(id),
      },
      data: {
        regNo,
        type,
        comment,
        report,
      },
      include: {
        paribahanUser: true,
      },
    });
    return res.status(200).json({ busInfo, message: "Updated successfully" });
  } catch (error) {
    return next(error);
  }
};

export const getAllBusInfo = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search;

    const where = searchQuery
      ? {
          OR: [
            { paribahanName: { contains: searchQuery, mode: "insensitive" } },
            { regNo: { contains: searchQuery, mode: "insensitive" } },
            { type: { contains: searchQuery, mode: "insensitive" } },
            { comment: { contains: searchQuery, mode: "insensitive" } },
            { report: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {};

    const busInfo = await prisma.busInfo.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: {
        paribahanName: "asc",
      },
      include: {
        paribahanUser: true,
      },
    });

    const totalCount = await prisma.busInfo.count();
    const searchCount = await prisma.busInfo.count({
      where,
    });

    if (busInfo.length < 1) {
      return next(createError(400, "Cannot find any info!"));
    }
    return res.status(200).json({ busInfo, totalCount, searchCount });
  } catch (error) {
    return next(error);
  }
};
export const getBusInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search;

    const whereClause = {
      paribahanUserId: String(id),
    };

    if (searchQuery) {
      whereClause.OR = [
        { regNo: { contains: searchQuery, mode: "insensitive" } },
        { type: { contains: searchQuery, mode: "insensitive" } },
        { comment: { contains: searchQuery, mode: "insensitive" } },
        { report: { contains: searchQuery, mode: "insensitive" } },
      ];
    }
    const busInfo = await prisma.busInfo.findMany({
      skip: offset,
      take: limit,
      where: whereClause,
      orderBy: {
        regNo: "asc",
      },
      include: {
        paribahanUser: true,
      },
    });

    const count = await prisma.busInfo.count({
      where: {
        paribahanUserId: String(id),
      },
    });
    const searchCount = await prisma.busInfo.count({
      where: whereClause,
    });

    if (busInfo.length < 1) {
      return next(createError(400, "Cannot find any info!"));
    }
    return res.status(200).json({ busInfo, count, searchCount });
  } catch (error) {
    return next(error);
  }
};

export const deleteBusInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const busInfo = await prisma.busInfo.delete({
      where: {
        id: String(id),
      },
    });
    return res.status(200).json({ busInfo, message: "Deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
