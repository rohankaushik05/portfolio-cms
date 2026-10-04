const jwt = require("jsonwebtoken");

const User = require("../models/user");

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required",
      });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    if (
      !user.refreshTokenExpiresAt ||
      user.refreshTokenExpiresAt < new Date()
    ) {
      return res.status(401).json({
        message: "Refresh token expired",
      });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET);

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

module.exports = {
  refreshAccessToken,
};