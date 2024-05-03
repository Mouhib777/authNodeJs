const signinUser = require("./auth/sign_in");
const signupUser = require("./auth/sign_up");
const getUserData = require("./auth/getUser_data");
const deleteUser = require("./auth/delete_user");
const updateUser = require("./auth/update_user");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.json());

const dbUrl =
  "mongodb+srv://mouhibm777:60X51JWQjenbYYp3@cluster0.ykkardn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.post("/api/v1/signin", signinUser);
app.post("/api/v1/signup", signupUser);
app.get("/api/v1/user_data", getUserData);
app.delete("/api/v1/users/:id", deleteUser);
app.put("/api/v1/updateUser", updateUser);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
