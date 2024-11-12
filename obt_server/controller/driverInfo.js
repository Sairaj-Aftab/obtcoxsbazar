import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug } from "../utils/slug.js";
import {
  uploadFile,
  getObjectSignedUrl,
  deleteExistingFile,
} from "../utils/s3.js";
import crypto from "crypto";
const prisma = new PrismaClient();

export const createDriverInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      paribahanName,
      name,
      fatherName,
      phone,
      license,
      address,
      comment,
      report,
    } = req.body;

    let queryConditions = [];

    if (phone && phone.trim() !== "") {
      queryConditions.push({ phone });
    }

    if (license && license.trim() !== "") {
      queryConditions.push({ license });
    }

    if (queryConditions.length > 0) {
      const existingDriver = await prisma.driverInfo.findFirst({
        where: {
          OR: queryConditions,
        },
      });

      if (existingDriver) {
        if (existingDriver.phone === phone) {
          return next(createError(400, "Phone number already exists!"));
        }
        if (existingDriver.license === license) {
          return next(createError(400, "License No already exists!"));
        }
      }
    }
    let fileNameWithFolder;
    if (req.file) {
      fileNameWithFolder = `driver/${crypto.randomBytes(32).toString("hex")}-${
        req.file.originalname
      }`;

      try {
        await uploadFile(req.file, fileNameWithFolder);
      } catch (error) {
        return next(error);
      }
    }

    // Create
    let driverInfo = await prisma.driverInfo.create({
      data: {
        paribahanName,
        slug: createSlug(paribahanName),
        name,
        fatherName,
        phone,
        license,
        address,
        comment,
        report,
        ...(fileNameWithFolder && { image: fileNameWithFolder }),
        paribahanUserId: String(id),
      },
      include: {
        paribahanUser: true,
      },
    });

    if (driverInfo.image) {
      driverInfo.imageUrl = await getObjectSignedUrl(driverInfo.image);
    }

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
    const { name, fatherName, phone, license, address, comment, report } =
      req.body;

    let queryConditions = [];

    if (phone && phone.trim() !== "") {
      queryConditions.push({
        phone,
        id: {
          not: String(id),
        },
      });
    }

    if (license && license.trim() !== "") {
      queryConditions.push({
        license,
        id: {
          not: String(id),
        },
      });
    }

    if (queryConditions.length > 0) {
      const existingDriver = await prisma.driverInfo.findFirst({
        where: {
          OR: queryConditions,
        },
      });

      if (existingDriver) {
        if (existingDriver.phone === phone) {
          return next(createError(400, "Phone number already exists!"));
        }
        if (existingDriver.license === license) {
          return next(createError(400, "License No already exists!"));
        }
      }
    }

    let fileNameWithFolder;
    if (req.file) {
      fileNameWithFolder = `driver/${crypto.randomBytes(32).toString("hex")}-${
        req.file.originalname
      }`;

      const existImage = await prisma.driverInfo.findFirst({
        where: { id: String(id) },
      });

      try {
        await uploadFile(req.file, fileNameWithFolder, existImage?.image);
      } catch (error) {
        return next(error);
      }
    }

    let driverInfo = await prisma.driverInfo.update({
      where: {
        id: String(id),
      },
      data: {
        name,
        fatherName,
        phone,
        license,
        address,
        comment,
        report,
        ...(fileNameWithFolder && { image: fileNameWithFolder }),
      },
      include: {
        paribahanUser: true,
      },
    });

    if (driverInfo.image) {
      driverInfo.imageUrl = await getObjectSignedUrl(driverInfo.image);
    }

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
    const searchQuery = req.query.search;

    const whereClause = {
      paribahanUserId: String(id),
    };

    if (searchQuery) {
      whereClause.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { phone: { contains: searchQuery, mode: "insensitive" } },
        { license: { contains: searchQuery, mode: "insensitive" } },
        { address: { contains: searchQuery, mode: "insensitive" } },
        { comment: { contains: searchQuery, mode: "insensitive" } },
        { report: { contains: searchQuery, mode: "insensitive" } },
      ];
    }
    const driverInfo = await prisma.driverInfo.findMany({
      skip: offset,
      take: limit,
      where: whereClause,
      orderBy: {
        name: "asc",
      },
      include: {
        paribahanUser: true,
      },
    });
    const driverInfoWithUrls = await Promise.all(
      driverInfo.map(async (driver) => {
        if (driver.image) {
          try {
            driver.imageUrl = await getObjectSignedUrl(driver.image);
          } catch (err) {
            driver.imageUrl = null; // Set to null if URL generation fails
          }
        }
        return driver;
      })
    );

    const count = await prisma.driverInfo.count({
      where: {
        paribahanUserId: String(id),
      },
    });
    const searchCount = await prisma.driverInfo.count({
      where: whereClause,
    });

    return res
      .status(200)
      .json({ driverInfo: driverInfoWithUrls, count, searchCount });
  } catch (error) {
    return next(error);
  }
};

export const getAllDriverInfo = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search;

    const where = searchQuery
      ? {
          OR: [
            { paribahanName: { contains: searchQuery, mode: "insensitive" } },
            { name: { contains: searchQuery, mode: "insensitive" } },
            { phone: { contains: searchQuery, mode: "insensitive" } },
            { license: { contains: searchQuery, mode: "insensitive" } },
            { address: { contains: searchQuery, mode: "insensitive" } },
            { comment: { contains: searchQuery, mode: "insensitive" } },
            { report: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {};
    const driverInfo = await prisma.driverInfo.findMany({
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
    const driverInfoWithUrls = await Promise.all(
      driverInfo.map(async (driver) => {
        if (driver.image) {
          try {
            driver.imageUrl = await getObjectSignedUrl(driver.image);
          } catch (err) {
            driver.imageUrl = null; // Set to null if URL generation fails
          }
        }
        return driver;
      })
    );

    const totalCount = await prisma.driverInfo.count();
    const searchCount = await prisma.driverInfo.count({
      where,
    });

    return res
      .status(200)
      .json({ driverInfo: driverInfoWithUrls, totalCount, searchCount });
  } catch (error) {
    return next(error);
  }
};

export const deleteDriverInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const driverInfo = await prisma.driverInfo.delete({
      where: {
        id: String(id),
      },
    });
    if (driverInfo?.image) {
      await deleteExistingFile(driverInfo?.image);
    }
    return res
      .status(200)
      .json({ driverInfo, message: "Deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
