import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { processFiles } from "../utils/processFile.js";
import { uploadFile } from "../utils/s3.js";
const prisma = new PrismaClient();

// Create Review
export const createReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      paribahanName,
      regNo,
      type,
      rating,
      name,
      comment,
      phoneNumber,
      destination,
      tripTime,
      ipAddress,
      phoneName,
      phoneModel,
    } = req.body;

    let fileNamesWithFolders = [];

    if (req.files) {
      fileNamesWithFolders = await processFiles(req.files, "review"); // Convert to WebP & optimize
      await uploadFile(req.files, fileNamesWithFolders); // Upload compressed files
    }

    // Hash the password
    const busReview = await prisma.busReview.create({
      data: {
        paribahanName,
        regNo,
        type,
        rating: parseInt(rating),
        name,
        comment,
        phoneNumber,
        destination,
        tripTime,
        ipAddress,
        phoneName,
        phoneModel,
        ...(fileNamesWithFolders.length > 0 && {
          images: fileNamesWithFolders,
        }),
        busInfoId: String(id),
        paribahanUserId: String(id),
      },
    });

    if (!busReview) {
      return next(createError(400, "Please try again"));
    }

    return res
      .status(200)
      .json({ busReview, message: "Submitted successfully" });
  } catch (error) {
    return next(error);
  }
};

// Update Review
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, comment } = req.body;
    const busReview = await prisma.busReview.update({
      where: {
        id: String(id), // Convert id to number
      },
      data: {
        name,
        comment,
      },
    });

    return res.status(200).json({ busReview, message: "Updated successfully" });
  } catch (error) {
    return next(error);
  }
};

export const getAllReview = async (req, res, next) => {
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

    const reviews = await prisma.busReview.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: {
        id: "desc",
      },
    });

    const reviewInfoWithUrls = await Promise.all(
      reviews.map(async (review) => {
        if (review.images && Array.isArray(review.images)) {
          try {
            review.imageUrls = await Promise.all(
              review.images.map((image) => getObjectSignedUrl(image))
            );
          } catch (err) {
            review.imageUrls = []; // Set to an empty array if URL generation fails
          }
        } else {
          review.imageUrls = [];
        }
        return review;
      })
    );

    const count = await prisma.busReview.count();
    const searchCount = await prisma.busReview.count({
      where,
    });
    return res
      .status(200)
      .json({ reviews: reviewInfoWithUrls, count, searchCount });
  } catch (error) {
    return next(error);
  }
};

export const getReviewsByParibahanUserId = async (req, res, next) => {
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

    const reviews = await prisma.busReview.findMany({
      skip: offset,
      take: limit,
      where: whereClause,
      orderBy: {
        id: "desc",
      },
    });

    const reviewInfoWithUrls = await Promise.all(
      reviews.map(async (review) => {
        if (review.images && Array.isArray(review.images)) {
          try {
            review.imageUrls = await Promise.all(
              review.images.map((image) => getObjectSignedUrl(image))
            );
          } catch (err) {
            review.imageUrls = []; // Set to an empty array if URL generation fails
          }
        } else {
          review.imageUrls = [];
        }
        return review;
      })
    );

    const count = await prisma.busReview.count({
      where: whereClause,
    });
    return res.status(200).json({ reviews: reviewInfoWithUrls, count });
  } catch (error) {
    return next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await prisma.busReview.delete({
      where: {
        id: String(id),
      },
    });

    return res.status(200).json({ review, message: "Deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
