import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug } from "../utils/slug.js";
import qr from "qrcode";
const prisma = new PrismaClient();

export const createBusInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paribahanName, regNo, type, comment, report, fcExpire } = req.body;

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
        fcExpire,
        paribahanUserId: String(id),
      },
      include: {
        paribahanUser: true,
      },
    });

    const qrCodeDataURL = await qr.toDataURL(
      `https://obtcoxsbazar.com/bus/info/${busInfo.slug}/${busInfo.id}`,
      {
        width: 250,
        margin: 2,
      }
    );

    // Save the QR code data URL in the database
    const updatedBusInfo = await prisma.busInfo.update({
      where: { id: busInfo.id },
      data: { qrCode: qrCodeDataURL },
    });

    return res
      .status(200)
      .json({ busInfo: updatedBusInfo, message: "Created successfully" });
  } catch (error) {
    return next(error);
  }
};

export const updateBusInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { regNo, type, comment, report, fcExpire } = req.body;
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
        fcExpire,
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

    return res.status(200).json({ busInfo, count, searchCount });
  } catch (error) {
    return next(error);
  }
};

// Get Bus Info By Id for QR code
export const getBusInfoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const busInfo = await prisma.busInfo.findUnique({
      where: {
        id: String(id),
      },
      select: {
        id: true,
        paribahanUserId: true,
        paribahanName: true,
        regNo: true,
        type: true,
      },
    });

    const reviewStats = await prisma.busReview.aggregate({
      _count: true,
      _avg: {
        rating: true,
      },
      where: {
        OR: [
          {
            busInfo: {
              paribahanUserId: String(busInfo.paribahanUserId),
            },
          },
          {
            paribahanUser: {
              id: String(busInfo.paribahanUserId),
            },
          },
        ],
      },
    });

    // Extract the aggregated data
    const totalReviewCount = reviewStats._count;
    const averageRating = reviewStats._avg.rating;

    if (!busInfo) {
      return next(createError(404, "Bus info not found!"));
    }

    return res.status(200).json({ busInfo, totalReviewCount, averageRating });
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

// export const updateMultipleBusInfoQR = async (req, res, next) => {
//   try {
//     // Retrieve bus information records
//     const busInfos = await prisma.busInfo.findMany();

//     if (busInfos.length === 0) {
//       return next(createError(404, "No bus info found for the provided IDs"));
//     }

//     const qrCodeOptions = {
//       width: 250, // Standard size in pixels for most use cases
//       margin: 2, // Optional: Small margin around the QR code
//     };

//     // Generate and update QR codes for each bus info
//     const updatedBusInfos = await Promise.all(
//       busInfos.map(async (busInfo) => {
//         const qrCodeDataURL = await qr.toDataURL(
//           `https://obtcoxsbazar.com/bus/info/${busInfo.slug}/${busInfo.id}`,
//           qrCodeOptions
//         );

//         // Update the QR code in the database and return the updated record
//         return prisma.busInfo.update({
//           where: { id: busInfo.id },
//           data: { qrCode: qrCodeDataURL },
//         });
//       })
//     );

//     return res
//       .status(200)
//       .json({ updatedBusInfos, message: "QR codes updated successfully" });
//   } catch (error) {
//     return next(error);
//   }
// };
