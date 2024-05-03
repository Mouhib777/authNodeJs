const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function getUserData(req, res) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(
      token.replace(/^Bearer\s/, ""),
      "test123",
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const email = decoded.email;

        const user = await User.findOne({ email });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
      }
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = getUserData;
