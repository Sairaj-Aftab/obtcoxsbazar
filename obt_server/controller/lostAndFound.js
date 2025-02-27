import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import crypto from "crypto";
import { getObjectSignedUrl, uploadFile } from "../utils/s3.js";
import sharp from "sharp";
import { processFiles } from "../utils/processFile.js";

const prisma = new PrismaClient();

export const createLostAndFoundReport = async (req, res, next) => {
  try {
    const {
      reportType,
      name,
      phone,
      dateTime,
      address,
      statusType,
      place,
      description,
      goods,
      policeReport,
    } = req.body;

    // Get the last entry and increment the serial number
    const lastEntry = await prisma.lostAndFound.findFirst({
      orderBy: {
        applicationNo: "desc", // Sorting by the serial number to get the last one
      },
    });

    let fileNamesWithFolders = [];

    if (req.files) {
      fileNamesWithFolders = await processFiles(req.files, "lostfound"); // Convert to WebP & optimize
      await uploadFile(req.files, fileNamesWithFolders); // Upload compressed files
    }

    // Set the new serial number (if there's no previous entry, start from 1)
    const newApplicationNumber = lastEntry ? lastEntry.applicationNo + 1 : 1;

    // Create a new record
    const appReport = await prisma.lostAndFound.create({
      data: {
        applicationNo: parseInt(newApplicationNumber),
        reportType,
        name,
        phone,
        dateTime: new Date(dateTime),
        address,
        statusType,
        place,
        goods,
        ...(fileNamesWithFolders.length > 0 && {
          images: fileNamesWithFolders,
        }),
        policeReport,
        description,
      },
    });

    // if (touristBusEntryPermission) {
    //   const message =
    //     `Dear OBT Admin,\n\nMr. ${applicantName} (App. No. ${newApplicationNumber}) has applied for "Tourist Bus Entry Permission".\n\nPlease review and reply ASAP.\n\nRegards\nOBT`.trim();
    //   await sendSMStoPhone("01320108710", encodeURIComponent(message));
    // }
    if (!appReport) {
      return next(createError(400, "Please try again!"));
    }

    return res.status(201).json({
      report: appReport,
      success: true,
      message: "Successfully submitted!",
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllLostAndFound = async (req, res, next) => {
  try {
    // Set up pagination variables
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get filter query parameters (if any)
    const {
      reportType,
      name,
      phone,
      dateTime,
      statusType,
      goods,
      status,
      search,
    } = req.query;

    const filters = {
      ...(search || reportType
        ? {
            AND: [
              ...(reportType && reportType !== "ALL"
                ? [{ reportType: { equals: reportType } }]
                : []), // Match enum value if not "ALL"
              ...(search
                ? [
                    {
                      OR: [
                        {
                          name: {
                            contains: search || name,
                            mode: "insensitive",
                          },
                        },
                        {
                          phone: {
                            contains: search || phone,
                            mode: "insensitive",
                          },
                        },
                        {
                          goods: {
                            contains: search || goods,
                            mode: "insensitive",
                          },
                        },
                      ],
                    },
                  ]
                : []),
            ],
          }
        : {}),
    };

    // Fetch permissions with pagination and filtering
    const reports = await prisma.lostAndFound.findMany({
      where: filters,
      skip: offset,
      take: limit,
      orderBy: [{ applicationNo: "desc" }],
    });

    const reportInfoWithUrls = await Promise.all(
      reports.map(async (report) => {
        if (report.images && Array.isArray(report.images)) {
          try {
            report.imageUrls = await Promise.all(
              report.images.map((image) => getObjectSignedUrl(image))
            );
          } catch (err) {
            report.imageUrls = []; // Set to an empty array if URL generation fails
          }
        } else {
          report.imageUrls = [];
        }
        return report;
      })
    );

    // Count total records and filtered records
    const count = await prisma.lostAndFound.count({
      where: filters,
    });

    // Return the permissions with pagination and filter data
    return res.status(200).json({
      reports: reportInfoWithUrls,
      count,
    });
  } catch (error) {
    return next(error);
  }
};
