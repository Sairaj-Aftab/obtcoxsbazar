import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import createError from "../utils/createError.js";
import { createSlug } from "../utils/slug.js";
import { createToken } from "../utils/token.js";
const prisma = new PrismaClient();

/**
 *
 * Account create for paribahan user admin
 */
export const createParibahanUserAccount = async (req, res, next) => {
  try {
    const { authUserId } = req.params;
    const {
      paribahanName,
      contactPerson,
      contactNumber,
      salesPerson,
      salesNumber,
      password,
      type,
      destinationId,
    } = req.body;

    // Check if paribahanName already exists
    const existingUser = await prisma.paribahanUser.findUnique({
      where: { paribahanName },
    });
    if (existingUser) {
      return next(createError(400, "Paribahan Name already exists"));
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const paribahanUser = await prisma.paribahanUser.create({
      data: {
        paribahanName,
        slug: createSlug(paribahanName),
        contactPerson,
        contactNumber,
        salesPerson,
        salesNumber,
        password: hashedPassword,
        plainPassword: String(password),
        ...(destinationId.length > 0 && {
          destination: {
            connect: destinationId.map((id) => ({ id })),
          },
        }),
        type: parseInt(type),
        authUserId: String(authUserId),
      },
      include: {
        authUser: {
          select: {
            id: true,
            userName: true,
            role: true,
          },
        },

        destination: true,
      },
    });
    return res
      .status(200)
      .json({ paribahanUser, message: "Created successfully" });
  } catch (error) {
    return next(error);
  }
};

export const updateParibahanUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      paribahanName,
      contactPerson,
      contactNumber,
      salesPerson,
      salesNumber,
      plainPassword,
      type,
      destinationId,
    } = req.body;

    // Check if paribahanName already exists
    const existingUser = await prisma.paribahanUser.findFirst({
      where: {
        paribahanName,
        id: {
          not: String(id),
        },
      },
    });
    if (existingUser) {
      return next(createError(400, "Paribahan Name already exists"));
    }

    const hashedPassword = await bcrypt.hash(String(plainPassword), 10);
    const paribahanUser = await prisma.paribahanUser.update({
      where: {
        id: String(id),
      },
      data: {
        paribahanName,
        slug: paribahanName && createSlug(paribahanName),
        contactPerson,
        contactNumber,
        salesPerson,
        salesNumber,
        plainPassword,
        password: hashedPassword,
        ...(destinationId.length > 0 && {
          destination: {
            set: destinationId.map((id) => ({ id })),
          },
        }),
        type: parseInt(type),
      },
      include: {
        authUser: {
          select: {
            id: true,
            userName: true,
            role: true,
          },
        },
        destination: true,
      },
    });
    return res
      .status(200)
      .json({ paribahanUser, message: "Updated successfully" });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * Get All Paribahan User
 */
export const getAllParibahanUser = async (req, res, next) => {
  try {
    const paribahanUsers = await prisma.paribahanUser.findMany({
      orderBy: {
        paribahanName: "asc",
      },
      include: {
        authUser: {
          select: {
            id: true,
            userName: true,
            role: true,
          },
        },
        destination: true,
      },
    });

    const count = await prisma.paribahanUser.count();
    if (paribahanUsers.length < 1) {
      return next(createError(400, "Cannot find any Paribahan User!"));
    }
    return res.status(200).json({ paribahanUsers, count });
  } catch (error) {
    return next(error);
  }
};

export const getParibahanUser = async (req, res, next) => {
  try {
    const { id } = req.params;

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
    const paribahanUser = await prisma.paribahanUser.findUnique({
      where: {
        id: String(id),
      },
      include: {
        busSchedule: {
          where: baseFilter,
        },
        destination: true,
      },
    });

    // Aggregate review stats
    const reviewStats = await prisma.busReview.aggregate({
      _count: true,
      _avg: {
        rating: true,
      },
      where: {
        busInfo: {
          paribahanUserId: String(id),
        },
      },
    });

    // Extract the aggregated data
    const totalReviewCount = reviewStats._count;
    const averageRating = reviewStats._avg.rating;

    if (!paribahanUser) {
      return next(createError(404, "Not found!"));
    }

    return res
      .status(200)
      .json({ paribahanUser, totalReviewCount, averageRating });
  } catch (error) {
    return next(error);
  }
};
/**
 * Delete Paribahan User
 */

export const deleteParibahanUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paribahanUser = await prisma.paribahanUser.delete({
      where: {
        id: String(id),
      },
    });
    return res
      .status(200)
      .json({ paribahanUser, message: "Deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

/**
 * All Authentication of Paribahan User
 */

export const login = async (req, res, next) => {
  try {
    const { paribahanName, password } = req.body;
    const user = await prisma.paribahanUser.findUnique({
      where: {
        paribahanName: paribahanName,
      },
      include: {
        busSchedule: true,
        destination: true,
      },
    });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const isPasswordCorrect = await bcrypt.compare(
      String(password),
      user.password
    );
    if (!isPasswordCorrect) {
      return next(createError(400, "Wrong password"));
    }
    const token = createToken({ paribahanName: user.paribahanName }, "365d");
    res.cookie("paribahan_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "Development" ? false : true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    return next(error);
  }
};

export const logedInUser = async (req, res, next) => {
  try {
    if (!req.me) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json(req.me);
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res
      .clearCookie("auth_token")
      .status(200)
      .json({ message: "Successfully log out" });
  } catch (error) {
    next(error);
  }
};
