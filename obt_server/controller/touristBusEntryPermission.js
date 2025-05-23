import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { sendSMStoPhone } from "../utils/sendSmsToMobileNumber.js";
import { isPhoneNumber } from "../utils/validate.js";

const prisma = new PrismaClient();

export const createTouristBusEntryPermission = async (req, res, next) => {
  try {
    const {
      applicantName,
      phone,
      institutionName,
      arrivalDateTime,
      numberTourist,
      numberBus,
      transportName,
      vehicleRegNo,
      destinationName,
      parkingPlace,
      parkingPlaceMapLink,
      returnDateTime,
      description,
    } = req.body;

    const existPending = await prisma.touristBusEntryPermission.findFirst({
      where: {
        vehicleRegNo,
        pending: true,
      },
    });
    if (existPending) {
      return next(createError(400, "Already exist! Please wait for response."));
    }

    // Get the last entry and increment the serial number
    const lastEntry = await prisma.touristBusEntryPermission.findFirst({
      orderBy: {
        applicationNo: "desc", // Sorting by the serial number to get the last one
      },
      select: { applicationNo: true },
    });

    // Set the new serial number (if there's no previous entry, start from 1)
    const newApplicationNumber = lastEntry ? lastEntry.applicationNo + 1 : 1;

    // Create a new record
    const touristBusEntryPermission =
      await prisma.touristBusEntryPermission.create({
        data: {
          applicationNo: parseInt(newApplicationNumber),
          applicantName,
          phone,
          institutionName,
          arrivalDateTime: new Date(arrivalDateTime),
          numberTourist: Number(numberTourist),
          numberBus: Number(numberBus),
          transportName,
          vehicleRegNo,
          destinationName,
          parkingPlace,
          parkingPlaceMapLink,
          returnDateTime: new Date(returnDateTime),
          description,
        },
      });

    if (touristBusEntryPermission) {
      const message =
        `Dear OBT Admin,\n\nMr. ${applicantName} (App. No. ${newApplicationNumber}) has applied for "Tourist Bus Entry Permission".\n\nPlease review and reply ASAP.\n\nRegards\nOBT`.trim();
      await sendSMStoPhone("01320108710", encodeURIComponent(message));
    }
    if (!touristBusEntryPermission) {
      return next(createError(400, "Please try again!"));
    }

    return res.status(201).json({
      touristBusEntryPermission,
      message: "Successfully submitted!",
    });
  } catch (error) {
    return next(error);
  }
};

export const updateTouristBusEntryPermission = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the ID of the permission to be updated
    const { status, rejectedReason } = req.body;

    // Fetch the existing permission entry
    const existingPermission =
      await prisma.touristBusEntryPermission.findUnique({
        where: { id },
      });

    if (!existingPermission) {
      return next(createError(404, "Permission entry not found!"));
    }

    // Prepare updated data based on the admin's action (approval or rejection)
    const updatedData = {};

    if (status === "approved") {
      updatedData.approved = true;
      updatedData.rejected = false;
      updatedData.pending = false;
      updatedData.approvalDate = new Date();
      updatedData.permissionReason = "";
    } else if (status === "rejected") {
      updatedData.approved = false;
      updatedData.rejected = true;
      updatedData.pending = false;
      updatedData.rejectionDate = new Date();
      updatedData.permissionReason = rejectedReason || "Rejected";
    }

    // Update the permission entry
    const updatedPermission = await prisma.touristBusEntryPermission.update({
      where: { id },
      data: updatedData,
    });

    // send approval sms to applicant mobile number
    if (updatedPermission.approved && isPhoneNumber(updatedPermission.phone)) {
      const message =
        `Dear Mr. ${updatedPermission.applicantName},\n\nYour "Tourist Bus Entry Permission" is accepted.\nApproval ID: (${updatedPermission.applicationNo}).\nPlease place your vehicle at ${updatedPermission.parkingPlace}.\n\nFor further queries:\nCall: 01320108710\nVisit: www.obtcoxsbazar.com\n\nRegards,\nCox’s Bazar District Police`.trim();
      await sendSMStoPhone(
        updatedPermission.phone,
        encodeURIComponent(message)
      );
    }
    // send approval sms to applicant mobile number
    if (updatedPermission.rejected && isPhoneNumber(updatedPermission.phone)) {
      const message =
        `Dear Mr. ${updatedPermission.applicantName},\n\nYour application for "Tourist Bus Entry Permission" is not accepted due to ${rejectedReason}.\n\nFor further queries:\nCall: 01320108710\nVisit: www.obtcoxsbazar.com\n\nRegards,\nCox’s Bazar District Police`.trim();

      await sendSMStoPhone(
        updatedPermission.phone, // Recipient's phone number
        encodeURIComponent(message) // Encode message
      );
    }

    return res.status(200).json({
      updatedPermission,
      message: "Permission updated successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllTouristBusEntryPermissions = async (req, res, next) => {
  try {
    // Set up pagination variables
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get filter query parameters (if any)
    const { applicantName, institutionName, approved, pending, rejected } =
      req.query;

    // Construct the 'where' clause for filters
    const where = {
      ...(applicantName && {
        applicantName: { contains: applicantName, mode: "insensitive" },
      }),
      ...(institutionName && {
        institutionName: { contains: institutionName, mode: "insensitive" },
      }),
      ...(approved && { approved: approved === "true" }), // Convert string to boolean
      ...(pending && { pending: pending === "true" }),
      ...(rejected && { rejected: rejected === "true" }),
    };

    // Fetch permissions with pagination and filtering
    const permissions = await prisma.touristBusEntryPermission.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: [
        { pending: "desc" },
        { applicationNo: "desc" },
        { applicationNo: "desc" },
        { approved: "desc" }, // Approved data next (false values come before true)
        { createdAt: "desc" }, // Then, order by createdAt for records with the same status
      ],
    });

    // Count total records and filtered records
    const count = await prisma.touristBusEntryPermission.count();
    const filteredCount = await prisma.touristBusEntryPermission.count({
      where,
    });

    // Return the permissions with pagination and filter data
    return res.status(200).json({
      permissions,
      count,
      filteredCount,
    });
  } catch (error) {
    return next(error);
  }
};
export const getTouristBusEntriesByReturnDate = async (req, res, next) => {
  try {
    // Set up pagination variables
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() - 1); // Add one day

    // Fetch permissions with pagination, filtering by returnDateTime exactly on the next day
    const permissions = await prisma.touristBusEntryPermission.findMany({
      skip: offset,
      take: limit,
      where: {
        returnDateTime: {
          gte: nextDay.toISOString(),
        },
      },
      orderBy: {
        createdAt: "desc", // Order by createdAt for sorting
      },
    });

    const count = await prisma.touristBusEntryPermission.count({
      where: {
        returnDateTime: {
          gte: nextDay.toISOString(),
        },
      },
    });

    // Return the permissions with pagination and filter data
    return res.status(200).json({
      permissions,
      count,
    });
  } catch (error) {
    return next(error);
  }
};
