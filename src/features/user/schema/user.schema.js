import mongoose from "mongoose";
import bcrypt from "bcrypt";
export const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },

  password: {
    type: String,
    required: true,
    validate: {
      validator:  function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^_-])[A-Za-z\d@$!%*?#&^_-]{8,}$/.test(value);
      },
      message:
        "Password should be at least 8 characters long and include a mix of uppercase, lowercase, number, and special character.",
    },
  },
  userType: { type: String, enum: ["customer", "seller"] },
});
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    const hashPassword = await bcrypt.hash(this.password, 12);
    this.password = hashPassword;
    next();
  } catch (error) {
    next(error);
  }
});

export const UserModel = new mongoose.model("User", userSchema);
