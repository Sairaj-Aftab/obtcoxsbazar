import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
const prisma = new PrismaClient();

export const getAllParibahanNotice = async (req, res, next) => {
  try {
    const notices = await prisma.noticeFromBus.findMany({
      include: {
        paribahanUser: {
          select: {
            id: true,
            paribahanName: true,
          },
        },
      },
      orderBy: {
        paribahanUser: {
          paribahanName: "asc",
        },
      },
    });
    if (notices.length < 1) {
      return next(createError(400, "Cannot find any notice!"));
    }
    return res.status(200).json({ notices });
  } catch (error) {
    return next(error);
  }
};
export const getAdminNotice = async (req, res, next) => {
  try {
    const notices = await prisma.noticeFromAdmin.findMany({
      include: {
        authUser: {
          select: {
            id: true,
            userName: true,
          },
        },
      },
    });
    if (notices.length < 1) {
      return next(createError(400, "Cannot find any notice!"));
    }
    return res.status(200).json({ notices });
  } catch (error) {
    return next(error);
  }
};

export const getSingleParibahanNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notice = await prisma.noticeFromBus.findUnique({
      where: {
        paribahanUserId: String(id),
      },
      include: {
        paribahanUser: {
          select: {
            id: true,
            paribahanName: true,
          },
        },
      },
    });
    if (!notice) {
      return next(createError(400, "Cannot find any notice!"));
    }
    return res.status(200).json({ notice });
  } catch (error) {
    return next(error);
  }
};
export const getSingleAdminNotice = async (req, res, next) => {
  try {
    const { status } = req.params;
    const notice = await prisma.noticeFromAdmin.findUnique({
      where: {
        status: status,
      },
      include: {
        authUser: {
          select: {
            id: true,
            userName: true,
          },
        },
      },
    });
    if (!notice) {
      return next(createError(400, "Cannot find any notice!"));
    }
    return res.status(200).json({ notice });
  } catch (error) {
    return next(error);
  }
};

export const createParibahanNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const fromSameId = await prisma.noticeFromBus.findUnique({
      where: {
        paribahanUserId: String(id),
      },
    });
    if (fromSameId) {
      return next(createError(400, "Notice already exists"));
    }
    const notice = await prisma.noticeFromBus.create({
      data: {
        title,
        paribahanUserId: String(id),
      },
      include: {
        paribahanUser: {
          select: {
            id: true,
            paribahanName: true,
          },
        },
      },
    });
    return res.status(200).json({ notice, message: "Notice created" });
  } catch (error) {
    return next(error);
  }
};
export const createAdminNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;
    const existingStatus = await prisma.noticeFromAdmin.findMany({
      where: {
        status: status,
      },
    });
    if (existingStatus.length > 0) {
      return next(createError(400, `${status} status already exists`));
    }
    const notice = await prisma.noticeFromAdmin.create({
      data: {
        title,
        status,
        authUser: {
          connect: {
            id: String(id),
          },
        },
      },
      include: {
        authUser: {
          select: {
            id: true,
            userName: true,
          },
        },
      },
    });
    return res.status(200).json({ notice });
  } catch (error) {
    return next(error);
  }
};

export const deleteParibahanNotice = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notice = await prisma.noticeFromBus.delete({
      where: {
        id: String(id),
      },
    });
    return res.status(200).json({ notice, message: "Notice deleted" });
  } catch (error) {
    return next(error);
  }
};
export const deleteAdminNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notice = await prisma.noticeFromAdmin.delete({
      where: {
        id: String(id),
      },
    });
    return res.status(200).json({ notice });
  } catch (error) {
    return next(error);
  }
};

export const updateParibahanNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const notice = await prisma.noticeFromBus.update({
      where: {
        id: String(id),
      },
      data: {
        title,
      },
      include: {
        paribahanUser: {
          select: {
            id: true,
            paribahanName: true,
          },
        },
      },
    });
    return res.status(200).json({ notice, message: "Successfully updated" });
  } catch (error) {
    return next(error);
  }
};
export const updateAdminNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const notice = await prisma.noticeFromAdmin.update({
      where: {
        id: String(id),
      },
      data: {
        title,
      },
      include: {
        authUser: {
          select: {
            id: true,
            userName: true,
          },
        },
      },
    });
    return res.status(200).json({ notice, message: "Successfully updated" });
  } catch (error) {
    return next(error);
  }
};
