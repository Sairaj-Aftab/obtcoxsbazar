import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";

const prisma = new PrismaClient();

export const createSetting = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    const setting = await prisma.settings.findUnique({
      where: {
        name,
      },
    });
    if (setting) {
      return next(createError(400, "Already exist!"));
    }
    const newSetting = await prisma.settings.create({
      data: {
        name,
        description,
        status,
      },
    });

    return res.status(200).json({ setting: newSetting, success: true });
  } catch (error) {
    next(createError(500, "Failed to fetch visitor stats", error));
  }
};
export const updateSetting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, status } = req.body;
    const setting = await prisma.settings.findUnique({
      where: {
        id,
      },
    });
    if (!setting) {
      return next(createError(400, "Setting not found!"));
    }
    const updateSetting = await prisma.settings.update({
      where: {
        id,
      },
      data: {
        description,
        status,
      },
    });
    return res.status(200).json({ setting: updateSetting, success: true });
  } catch (error) {
    next(createError(500, "Failed to fetch visitor stats", error));
  }
};

export const getAllSettings = async (req, res, next) => {
  try {
    const settings = await prisma.settings.findMany();
    return res.status(200).json({ settings });
  } catch (error) {
    next(createError(500, "Failed to fetch visitor stats"));
  }
};
