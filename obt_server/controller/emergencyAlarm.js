import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { processFiles } from "../utils/processFile.js";
import {
  deleteExistingFile,
  getObjectSignedUrl,
  uploadFile,
} from "../utils/s3.js";
const prisma = new PrismaClient();

// Create Review
export const createEmergencyAlarm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      paribahanName,
      regNo,
      type,
      name,
      description,
      emergencyType,
      lon,
      lat,
      location,
      phoneNumber,
      ipAddress,
      phoneName,
      phoneModel,
    } = req.body;

    let fileNamesWithFolders = [];

    if (req.files) {
      fileNamesWithFolders = await processFiles(req.files, "review"); // Convert to WebP & optimize
      await uploadFile(req.files, fileNamesWithFolders); // Upload compressed files
    }

    // Get the last entry and increment the serial number
    const lastEntry = await prisma.emergencyAlarm.findFirst({
      orderBy: {
        alarmId: "desc", // Sorting by the serial number to get the last one
      },
      select: { alarmId: true },
    });

    // Set the new serial number (if there's no previous entry, start from 1)
    const newAlarmId = lastEntry ? lastEntry.alarmId + 1 : 1;

    // Hash the password
    const emergencyAlarm = await prisma.emergencyAlarm.create({
      data: {
        alarmId: parseInt(newAlarmId),
        paribahanName,
        regNo,
        type,
        name,
        emergencyType,
        locationName: location,
        description,
        phoneNumber,
        ipAddress,
        phoneName,
        phoneModel,
        ...(lon &&
          lat && {
            location: {
              type: "Point",
              coordinates: [parseFloat(lon), parseFloat(lat)],
            },
          }),
        ...(fileNamesWithFolders.length > 0 && {
          images: fileNamesWithFolders,
        }),
        busInfoId: String(id),
        paribahanUserId: String(id),
      },
    });

    if (!emergencyAlarm) {
      return next(createError(400, "Please try again"));
    }

    return res
      .status(200)
      .json({ alarm: emergencyAlarm, message: "Submitted successfully" });
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

export const getAllAlarm = async (req, res, next) => {
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
            { name: { contains: searchQuery, mode: "insensitive" } },
            { phoneNumber: { contains: searchQuery, mode: "insensitive" } },
            {
              destination: { contains: searchQuery, mode: "insensitive" },
            },
            { tripTime: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {};

    const alarms = await prisma.emergencyAlarm.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: {
        alarmId: "desc",
      },
    });

    const alarmInfoWithUrls = await Promise.all(
      alarms.map(async (alarm) => {
        if (alarm.images && Array.isArray(alarm.images)) {
          try {
            alarm.imageUrls = await Promise.all(
              alarm.images.map((image) => getObjectSignedUrl(image))
            );
          } catch (err) {
            alarm.imageUrls = []; // Set to an empty array if URL generation fails
          }
        } else {
          alarm.imageUrls = [];
        }
        return alarm;
      })
    );

    const count = await prisma.emergencyAlarm.count();
    const searchCount = await prisma.emergencyAlarm.count({
      where,
    });
    return res
      .status(200)
      .json({ alarms: alarmInfoWithUrls, count, searchCount });
  } catch (error) {
    return next(error);
  }
};

export const getAlarmsByParibahanUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search;

    const whereClause = {
      OR: [
        { busInfo: { paribahanUserId: String(id) } },
        { paribahanUserId: String(id) },
      ],
    };

    if (searchQuery) {
      whereClause.OR = [
        { regNo: { contains: searchQuery, mode: "insensitive" } },
        { name: { contains: searchQuery, mode: "insensitive" } },
        { phoneNumber: { contains: searchQuery, mode: "insensitive" } },
        {
          destination: { contains: searchQuery, mode: "insensitive" },
        },
        { tripTime: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    const alarms = await prisma.emergencyAlarm.findMany({
      skip: offset,
      take: limit,
      where: whereClause,
      orderBy: {
        alarmId: "desc",
      },
    });

    const alarmInfoWithUrls = await Promise.all(
      alarms.map(async (alarm) => {
        if (alarm.images && Array.isArray(alarm.images)) {
          try {
            alarm.imageUrls = await Promise.all(
              alarm.images.map((image) => getObjectSignedUrl(image))
            );
          } catch (err) {
            alarm.imageUrls = []; // Set to an empty array if URL generation fails
          }
        } else {
          alarm.imageUrls = [];
        }
        return alarm;
      })
    );

    const count = await prisma.emergencyAlarm.count({
      where: whereClause,
    });
    return res.status(200).json({ alarms: alarmInfoWithUrls, count });
  } catch (error) {
    return next(error);
  }
};

export const deleteAlarm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alarm = await prisma.emergencyAlarm.delete({
      where: {
        id: String(id),
      },
    });
    if (alarm?.images && Array.isArray(alarm.images)) {
      for (const image of alarm.images) {
        await deleteExistingFile(image);
      }
    }

    return res.status(200).json({ alarm, message: "Deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

// export const setReviewId = async (req, res, next) => {
//   try {
//     const reviews = await prisma.busReview.findMany({
//       orderBy: {
//         createdAt: "asc",
//       },
//       select: { id: true },
//     });

//     // Update each review one by one asynchronously
//     for (let i = 0; i < reviews.length; i++) {
//       await prisma.busReview.update({
//         where: { id: reviews[i].id },
//         data: { reviewId: i + 1 },
//       });
//     }

//     return res.status(200).json({ message: "Successfully updated" });
//   } catch (error) {
//     return next(error);
//   }
// };
