const User = require("./../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function signupUser(req, res) {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,

      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, "test123", {
      expiresIn: "1d",
    });

    const message = "User signed up successfully";
    console.log(`${message}: ${username} (${email}) added to MongoDB`);
    res.status(201).json({ message, username, email, token });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = signupUser;
