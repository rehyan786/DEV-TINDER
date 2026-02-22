const validator = require("validator");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userSchema.js");
// const validator = require("validator");  

const validateSignUpData = (req) => {
  const { FirstName, LastName, Email, Password } = req.body;
  if (!FirstName || !LastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(Email)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(Password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const valideditprofile = (req) => {
  // Define allowed fields as strings
  const allowed_fields = ["FirstName", "LastName", "Gender"];
  
  // Get fields from request body
  const requestedFields = Object.keys(req.body);
  
  // Check if request body is empty
  if (requestedFields.length === 0) {
      throw new Error("No fields provided for update");
  }
  
  // Check if all requested fields are allowed
  const isEditAllowed = requestedFields.every(field => 
      allowed_fields.includes(field)
  );
  
  if (!isEditAllowed) {
      throw new Error(`Invalid fields. Only ${allowed_fields.join(", ")} can be updated`);
  }
  
  return true;
};

const ValidPasswordChange = async (req) => {
  // Get user's email from authenticated user
  const user = await UserModel.findOne({ Email: req.user.Email });
  
  if (!user) {
      throw new Error("User doesn't exist");
  }
  
  // Get old password from request
  const oldPassword = req.body.oldPassword;
  
  if (!oldPassword) {
      throw new Error("Old password is required");
  }
  
  // Verify old password
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.Password);
  
  if (!isPasswordCorrect) {
      throw new Error("Current password is incorrect");
  }
  
  // Validate new password
  const newPassword = req.body.newPassword;
  
  if (!newPassword) {
      throw new Error("New password is required");
  }
  
  if (!validator.isStrongPassword(newPassword)) {
      throw new Error("New password must be strong (min 8 chars, uppercase, lowercase, number, symbol)");
  }
  
  if (oldPassword === newPassword) {
      throw new Error("New password must be different from old password");
  }
  
  return true;
};





module.exports = {
  validateSignUpData,
  valideditprofile,
  ValidPasswordChange
};