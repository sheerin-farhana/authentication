const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup controller
const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(403).json({ message: "Email already exists" });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Create new user
    const newUserData = await User.create({
      name,
      email,
      password: hash,
    });

    res.status(200).json({ data: newUserData.dataValues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
    next(err);
  }
};

// Function to generate access token
function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name }, process.env.TOKEN, { expiresIn: "1h" });
}

// Login controller
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Password does not match" });
    }

    const token = generateAccessToken(user.id, user.name);
    res.status(200).json({
      success: true,
      message: "User login successful",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login };
