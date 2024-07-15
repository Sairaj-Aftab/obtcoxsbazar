import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

const verifyTokenForParibahan = async (req, res, next) => {
  // const authHeader = req.headers.authorization || req.headers.Authorization;
  const paribahan_auth_token = req.cookies.paribahan_auth_token;

  if (!paribahan_auth_token) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  jwt.verify(
    paribahan_auth_token,
    process.env.JWT_SECRET,
    async (err, decode) => {
      if (err) {
        return res.status(400).json({ message: "Invalid Token" });
      }

      const me = await prisma.paribahanUser.findUnique({
        where: {
          paribahanName: decode.paribahanName,
        },
      });
      req.me = me;
      next();
    }
  );
};

export default verifyTokenForParibahan;
