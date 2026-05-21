const express = require("express");
const authLimiter = require('../middleware/authLimiter');
const refreshLimiter = require('../middleware/refreshLimiter');
const {
  register,
  login,
  refreshAccessToken,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh-token", refreshLimiter, refreshAccessToken);
router.post("/logout",logout);

module.exports = router;
