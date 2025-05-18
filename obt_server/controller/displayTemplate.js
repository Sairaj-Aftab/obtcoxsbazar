import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import createError from "../utils/createError.js";
import { createToken } from "../utils/token.js";
const prisma = new PrismaClient();

export const createTemplate = async (req, res, next) => {
  try {
    const { title, content, type, status = "INACTIVE" } = req.body;

    const template = await prisma.template.create({
      data: {
        title,
        content,
        type,
        status,
      },
    });

    return res
      .status(200)
      .json({ message: "Template created successfully", template });
  } catch (error) {
    return next(error);
  }
};

// Update template
export const updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, showFrom, showUntil, status } = req.body;

    // Check if template exists
    const existingTemplate = await prisma.template.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }

    const template = await prisma.template.update({
      where: { id },
      data: {
        content,
        status,
        showFrom,
        showUntil,
      },
    });

    return res
      .status(200)
      .json({ message: "Template updated successfully", template });
  } catch (error) {
    return next(error);
  }
};
// Get all template
export const getTemplates = async (req, res, next) => {
  try {
    const templates = await prisma.template.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ success: true, templates });
  } catch (error) {
    return next(error);
  }
};
