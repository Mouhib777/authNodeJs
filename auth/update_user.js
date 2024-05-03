const User = require("./../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function updateUser(req, res) {
  const token = req.headers.authorization;
  const { email, password, username } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  const extractedToken = token.replace(/^Bearer\s/, "");

  jwt.verify(extractedToken, "test123", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const email = decoded.email;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.email.toString() !== email) {
        return res.status(403).json({
          error: "Forbidden: You are not authorized to perform this action",
        });
      }

      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, 10);
      if (username) user.username = username;

      await user.save();

      const newToken = jwt.sign({ userId: user._id }, "test123", {
        expiresIn: "1d",
      });

      const message = "User information updated successfully";
      console.log(
        `${message}: ${user.username} (${user.email}) updated in MongoDB`
      );
      res.status(200).json({
        message,
        username: user.username,
        email: user.email,
        token: newToken,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
}

module.exports = updateUser;
