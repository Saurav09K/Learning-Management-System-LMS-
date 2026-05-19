const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const {
  REFRESH_TOKEN_EXPIRES_IN_MS,
  generateAccessToken,
  generateRefreshToken,
  getValidRefreshToken,
  revokeToken,
} = require("../utils/tokenUtils");

const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

const getCookieOptions = () => {
  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.COOKIE_SECURE === "true";

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge: REFRESH_TOKEN_EXPIRES_IN_MS,
    path: "/",
  };
};

const clearRefreshTokenCookie = (res) => {
  const { httpOnly, secure, sameSite, path } = getCookieOptions();

  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly,
    secure,
    sameSite,
    path,
  });
};

const getDeviceInfo = (req) => req.headers["user-agent"] || "Unknown device";

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, getCookieOptions());
};

const buildAuthPayload = async (user, req, res) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user._id, getDeviceInfo(req));

  setRefreshTokenCookie(res, refreshToken);

  return {
    accessToken,
    user: serializeUser(user),
  };
};



const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const authPayload = await buildAuthPayload(user, req, res);

    return res.status(201).json(authPayload);
  } catch (err) {
    console.error("Register failed:", err);
    return res.status(500).json({ message: "Register failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const authPayload = await buildAuthPayload(user, req, res);

    return res.status(200).json(authPayload);
  } catch (err) {
    console.error("Login failed:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};


const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    if (!oldRefreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const tokenDoc = await getValidRefreshToken(oldRefreshToken);

    if (!tokenDoc) {
      clearRefreshTokenCookie(res);
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(tokenDoc.userId);
    
    if (!user) {
      clearRefreshTokenCookie(res);
      return res.status(403).json({ message: "User not found" });
    }

    await revokeToken(oldRefreshToken);

    const newRefreshToken = await generateRefreshToken(
      user._id,
      getDeviceInfo(req)
    );
    const newAccessToken = generateAccessToken(user);
    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({ 
      accessToken: newAccessToken,
      user: serializeUser(user) 
    });
    
  } catch (err) {
    console.error("Refresh failed:", err);
    return res.status(500).json({ message: "Refresh failed" });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    await revokeToken(refreshToken);
    clearRefreshTokenCookie(res);

    return res.status(204).send();
  } catch (err) {
    console.error("Logout failed:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
};
