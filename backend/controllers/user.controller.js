import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js"
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role } = req.body;
    const profileImage = req.files?.profileImage?.[0];
    let profileImageUrl = null;

    if (profileImage) {
      const fileUri = getDataUri(profileImage);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profileImageUrl = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
      profile: {
        profileImage: profileImageUrl,
      },
    });

    const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.headers.host}`;
    const verifyUrl = `${baseUrl}/verify-email/${verificationToken}`;
    const message = `
      <h2>Welcome to JobPortal!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email Address - JobPortal",
        html: message,
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
    }

    res.status(201).json({
      success: true,
      message: "Account created! Please check your email to verify your account.",
      user,
    });
  } catch (error) {
    // Handle duplicate email error (MongoDB error code 11000)
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({
        message: "Signup failed. Email already exists.",
        success: false,
      });
    }

    // Handle other errors (e.g., database validation errors)
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Signup failed. Invalid data provided.",
        error: error.message,
      });
    }
    // Handle general server errors
    res.status(500).json({
      success: false,
      message: "Internal server error. Could not sign up.",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(req.body)
    const user = await UserModel.findOne({ email:email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist. Please signUp ",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before logging in. Check your inbox.",
      });
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email or Password. ",
      });
    }
    if (role !== user.role) {
      return res.status(400).json({
        success: false,
        message: "User is registered as" + user.role,
      });
    }
    const token = jwt.sign({ UserId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "Successfully logged-In",
        user,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Could not sign up.",
      // error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { fullName, email, phoneNumber, bio, skills } = req.body;
    
    const existingUser = await UserModel.findById(userId);
    
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedProfile = { ...existingUser.profile.toObject() }; //doing this as to not to loose the pervious profile data like profile image

    if (bio) {
      updatedProfile.bio = bio;
    }
    if (skills) {
      updatedProfile.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Handle file upload (resume)
    const file = req.files?.file?.[0];
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: "raw" });
      updatedProfile.resume = cloudResponse.secure_url;
      updatedProfile.resumeOriginalName = file.originalname;
    }

    let requireReverification = false;
    let verificationToken;
    let verificationTokenExpires;

    if (email && email !== existingUser.email) {
      requireReverification = true;
      verificationToken = crypto.randomBytes(20).toString("hex");
      verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    }

    // Prepare the update data
    const updateData = { 
      fullName: fullName || existingUser.fullName,
      email: email || existingUser.email,
      phoneNumber: phoneNumber || existingUser.phoneNumber,
      profile: updatedProfile, // Merged profile data
    };

    if (requireReverification) {
      updateData.isVerified = false;
      updateData.verificationToken = verificationToken;
      updateData.verificationTokenExpires = verificationTokenExpires;
    }

    // Update the user document
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (requireReverification) {
      const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.headers.host}`;
      const verifyUrl = `${baseUrl}/verify-email/${verificationToken}`;
      const message = `
        <h2>Email Updated</h2>
        <p>Please click the link below to verify your new email address:</p>
        <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
      `;

      try {
        await sendEmail({
          to: updatedUser.email,
          subject: "Verify Your New Email Address - JobPortal",
          html: message,
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
      }

      // Log them out
      return res.status(200).cookie("token", "", { maxAge: 0 }).json({ 
        success: true, 
        message: "Email updated. Please check your new email to verify it. You have been logged out.",
        data: updatedUser,
        requireReverification: true
      });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.user;
    const jobId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const savedJobs = user.profile.savedJobs || [];
    const isSaved = savedJobs.includes(jobId);

    if (isSaved) {
      // Remove from saved jobs
      user.profile.savedJobs = savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      // Add to saved jobs
      user.profile.savedJobs.push(jobId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isSaved ? "Job removed from saved list" : "Job saved successfully",
      savedJobs: user.profile.savedJobs,
      user
    });
  } catch (error) {
    console.error("Error toggling saved job:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await UserModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};