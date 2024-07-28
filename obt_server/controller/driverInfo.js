import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug } from "../utils/slug.js";
const prisma = new PrismaClient();

export const createDriverInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paribahanName, name, phone, license, address, comment } = req.body;

    const existingPhone = await prisma.driverInfo.findUnique({
      where: {
        phone,
      },
    });
    if (existingPhone) {
      return next(createError(400, "Phone number already exist!"));
    }

    const existingDL = await prisma.driverInfo.findUnique({
      where: {
        license,
      },
    });
    if (existingDL) {
      return next(createError(400, "License No already exist!"));
    }

    // Create
    const driverInfo = await prisma.driverInfo.create({
      data: {
        paribahanName,
        slug: createSlug(paribahanName),
        name,
        phone,
        license,
        address,
        comment,
        paribahanUserId: parseInt(id),
      },
      include: {
        paribahanUser: true,
      },
    });

    return res
      .status(200)
      .json({ driverInfo, message: "Created successfully" });
  } catch (error) {
    return next(error);
  }
};

export const updateDriverInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, license, address, comment } = req.body;
    const existingDL = await prisma.driverInfo.findFirst({
      where: {
        license,
        id: {
          not: Number(id),
        },
      },
    });
    if (existingDL) {
      return next(createError(400, "License already exist!"));
    }
    const existingPhone = await prisma.driverInfo.findFirst({
      where: {
        phone,
        id: {
          not: Number(id),
        },
      },
    });
    if (existingPhone) {
      return next(createError(400, "Phone number already exist!"));
    }
    const driverInfo = await prisma.driverInfo.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        phone,
        license,
        address,
        comment,
      },
      include: {
        paribahanUser: true,
      },
    });
    return res
      .status(200)
      .json({ driverInfo, message: "Updated successfully" });
  } catch (error) {
    return next(error);
  }
};

export const getDriverInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const driverInfo = await prisma.driverInfo.findMany({
      where: {
        paribahanUserId: parseInt(id),
      },
      skip: offset,
      take: limit,
      orderBy: {
        name: "asc",
      },
      include: {
        paribahanUser: true,
      },
    });

    const count = await prisma.driverInfo.count({
      where: {
        paribahanUserId: parseInt(id),
      },
    });
    const totalCount = await prisma.driverInfo.count();

    if (driverInfo.length < 1) {
      return next(createError(400, "Cannot find any info!"));
    }
    return res.status(200).json({ driverInfo, count, totalCount });
  } catch (error) {
    return next(error);
  }
};
