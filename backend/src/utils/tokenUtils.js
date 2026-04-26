const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

const hashRefreshToken = (refreshToken) =>
  crypto.createHash("sha256").update(refreshToken).digest("hex");


// Generate JWT access token
const generateAccessToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

// Generate refresh token
const generateRefreshToken = async (userId, deviceInfo) => {
  const refreshToken = crypto.randomBytes(64).toString("hex");

  await RefreshToken.create({
    userId,
    hashedRefreshToken: hashRefreshToken(refreshToken),
    deviceInfo: deviceInfo || "Unknown device",
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS),
  });

  return refreshToken;
};

const getValidRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    return null;
  }

  const token = await RefreshToken.findOne({
    hashedRefreshToken: hashRefreshToken(refreshToken),
  }).populate("userId");

  if (!token) {
    return null;
  }

  if (token.expiresAt <= new Date() || !token.userId) {
    await token.deleteOne();
    return null;
  }

  return token;
};

const revokeToken = async (refreshToken) => {
  if (!refreshToken) {
    return 0;
  }

  const result = await RefreshToken.deleteOne({
    hashedRefreshToken: hashRefreshToken(refreshToken),
  });

  return result.deletedCount;
};

module.exports = {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN_MS,
  hashRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  getValidRefreshToken,
  revokeToken,
};
