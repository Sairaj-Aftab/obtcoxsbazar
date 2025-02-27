import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug } from "../utils/slug.js";
const prisma = new PrismaClient();

export const getPermission = async (req, res, next) => {
  try {
    const permission = await prisma.permission.findMany();
    if (permission.length < 1) {
      return next(createError(400, "Cannot find any permission!"));
    }
    return res.status(200).json({ permission });
  } catch (error) {
    return next(error);
  }
};

export const createPermission = async (req, res, next) => {
  try {
    const { name } = req.body;
    const existingPermission = await prisma.permission.findFirst({
      where: {
        name: name.toUpperCase(),
      },
    });

    if (existingPermission) {
      return next(createError(400, "Permission already exists!"));
    }
    const permission = await prisma.permission.create({
      data: {
        name: name.toUpperCase(),
        slug: createSlug(name),
      },
    });
    return res
      .status(200)
      .json({ permission, message: "Successfully created" });
  } catch (error) {
    return next(error);
  }
};

export const deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const permission = await prisma.permission.delete({
      where: {
        id: String(id),
      },
    });
    return res.status(200).json({ permission });
  } catch (error) {
    return next(error);
  }
};

export const updatePermissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const permission = await prisma.permission.update({
      where: {
        id: String(id),
      },
      data: {
        status: !status,
      },
    });

    res.status(200).json({ permission, message: "Successfully updated" });
  } catch (error) {
    next(error);
  }
};
