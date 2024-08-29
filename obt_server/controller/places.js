import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug } from "../utils/slug.js";
const prisma = new PrismaClient();

export const createPlace = async (req, res, next) => {
  try {
    const { placeName, status } = req.body;
    const existingPlace = await prisma.leaveDestinationPlace.findUnique({
      where: {
        placeName,
      },
    });
    if (existingPlace) {
      return next(createError(400, "Place already exists!"));
    }
    const place = await prisma.leaveDestinationPlace.create({
      data: {
        placeName,
        slug: createSlug(placeName),
        status,
      },
    });
    return res.status(200).json({ place, message: "Successfully created" });
  } catch (error) {
    return next(error);
  }
};

export const updatePlace = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { placeName } = req.body;

    const existingPlace = await prisma.leaveDestinationPlace.findFirst({
      where: {
        placeName,
        id: {
          not: String(id),
        },
      },
    });
    if (existingPlace) {
      return next(createError(400, "Place already exists!"));
    }
    const place = await prisma.leaveDestinationPlace.update({
      where: {
        id: String(id),
      },
      data: {
        placeName,
        slug: createSlug(placeName),
      },
    });
    return res.status(200).json({ place, message: "Successfully updated" });
  } catch (error) {
    return next(error);
  }
};

export const getPlaces = async (req, res, next) => {
  try {
    const places = await prisma.leaveDestinationPlace.findMany();
    if (places.length < 1) {
      return next(createError(400, "Cannot find any place!"));
    }
    return res.status(200).json({ places });
  } catch (error) {
    return next(error);
  }
};

export const getLeavingPlaces = async (req, res, next) => {
  try {
    const places = await prisma.leaveDestinationPlace.findMany({
      where: { status: "leave" },
      orderBy: {
        placeName: "asc",
      },
    });
    if (places.length < 1) {
      return next(createError(400, "Cannot find any leaving place!"));
    }
    return res.status(200).json({ places });
  } catch (error) {
    return next(error);
  }
};

export const getDestinationsPlaces = async (req, res, next) => {
  try {
    const places = await prisma.leaveDestinationPlace.findMany({
      where: { status: "destination" },
      orderBy: {
        placeName: "asc",
      },
    });
    if (places.length < 1) {
      return next(createError(400, "Cannot find any destination place!"));
    }
    return res.status(200).json({ places });
  } catch (error) {
    return next(error);
  }
};

export const deletePlace = async (req, res, next) => {
  try {
    const { id } = req.params;
    const place = await prisma.leaveDestinationPlace.delete({
      where: { id: String(id) },
    });
    return res.status(200).json({ place });
  } catch (error) {
    return next(error);
  }
};
