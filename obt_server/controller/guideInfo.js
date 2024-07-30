import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug } from "../utils/slug.js";
const prisma = new PrismaClient();

export const createGuideInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paribahanName, name, phone, address, comment, report } = req.body;

    const existingInfo = await prisma.guideInfo.findFirst({
      where: {
        phone,
      },
    });
    if (existingInfo) {
      return next(createError(400, "Phone number already exist!"));
    }

    // Create
    const guideInfo = await prisma.guideInfo.create({
      data: {
        paribahanName,
        slug: createSlug(paribahanName),
        name,
        phone,
        address,
        comment,
        report,
        paribahanUserId: Number(id),
      },
      include: {
        paribahanUser: true,
      },
    });

    return res.status(200).json({ guideInfo, message: "Created successfully" });
  } catch (error) {
    return next(error);
  }
};

export const updateGuideInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, address, comment, report } = req.body;
    const existingInfo = await prisma.guideInfo.findFirst({
      where: {
        phone,
        id: {
          not: Number(id),
        },
      },
    });
    if (existingInfo) {
      return next(createError(400, "Phone number already exist!"));
    }
    const guideInfo = await prisma.guideInfo.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        phone,
        address,
        comment,
        report,
      },
      include: {
        paribahanUser: true,
      },
    });
    return res.status(200).json({ guideInfo, message: "Updated successfully" });
  } catch (error) {
    return next(error);
  }
};

export const getGuideInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const guideInfo = await prisma.guideInfo.findMany({
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

    const count = await prisma.guideInfo.count({
      where: {
        paribahanUserId: parseInt(id),
      },
    });
    const totalCount = await prisma.guideInfo.count();

    if (guideInfo.length < 1) {
      return next(createError(400, "Cannot find any info!"));
    }
    return res.status(200).json({ guideInfo, count, totalCount });
  } catch (error) {
    return next(error);
  }
};

export const getAllGuideInfo = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const guideInfo = await prisma.guideInfo.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        paribahanName: "asc",
      },
      include: {
        paribahanUser: true,
      },
    });

    const totalCount = await prisma.guideInfo.count();

    if (guideInfo.length < 1) {
      return next(createError(400, "Cannot find any info!"));
    }
    return res.status(200).json({ guideInfo, totalCount });
  } catch (error) {
    return next(error);
  }
};

export const deleteGuideInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guideInfo = await prisma.guideInfo.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json({ guideInfo, message: "Deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
