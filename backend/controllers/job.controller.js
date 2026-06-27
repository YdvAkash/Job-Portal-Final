import JobModel from "../models/job.model.js";
import ApplicationModel from "../models/application.model.js";
//for admins
export const createJob = async (req, res) => {
  try {
    const userId = req.user;
    const {
      title,
      description,
      salary,
      requirements,
      location,
      jobType,
      position,
      company,
      experience,
    } = req.body;
    let formattedRequirements = requirements;
    if (typeof requirements === "string") {
      formattedRequirements = requirements
        .split(",")
        .map((requirement) => requirement.trim());
    }
    const job = await JobModel.find({ title, createdBy: userId, company });
    if (job && job.length !== 0) {
      return res.status(400).json({
        success: false,
        message: "Job already exists",
      });
    }
    const newJob = await JobModel.create({
      title,
      description,
      salary,
      requirements: formattedRequirements,
      location,
      jobType,
      position,
      company,
      createdBy: userId,
      experience,
    });

    if (!newJob) {
      return res.status(400).json({
        success: false,
        message: "Job not created",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: newJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getJobsCreated = async (req, res) => {
  try {
    const adminId = req.user;
    const jobsCreated = await JobModel.find({
      createdBy: adminId,
    }).populate("company");
    if (!jobsCreated || jobsCreated.length === 0) {
      return res.status(404).json({
        message: "No jobs Created available",
        success: false,
      });
    }
    return res.status(200).json({
      jobsCreated,
      success: true,
    });
  } catch (e) {
    return res.status(400).json({
      message: "Internal server error",
      success: false,
      error: e.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    await ApplicationModel.deleteMany({ job: jobId });
    const job = await JobModel.findByIdAndDelete(jobId);

    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }
    return res.status(201).json({
      jobDeleted: job,
      success: true,
    });
  } catch (e) {
    return res.status(400).json({
      message: "Internal server error",
      success: false,
      error: e.message,
    });
  }
};
//for students
export const getAllJob = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim();
    let query = {};

    // Helper to escape user input for safe RegExp construction
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    if (keyword && keyword.length > 0) {
      // Support alternation tokens joined by '|' (e.g. from the frontend)
      const tokens = keyword.split("|").map((t) => t.trim()).filter(Boolean);

      const orConditions = [];
      tokens.forEach((token) => {
        const safe = escapeRegExp(token);
        const regex = new RegExp(safe, 'i');
        orConditions.push({ title: regex });
        orConditions.push({ description: regex });
        orConditions.push({ location: regex });
        orConditions.push({ jobType: regex });
      });

      if (orConditions.length > 0) {
        query = { $or: orConditions };
      }
    }
    
    // Support pagination to avoid returning excessively large payloads
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [total, jobs] = await Promise.all([
      JobModel.countDocuments(query),
      JobModel.find(query)
        .populate("company")
        .populate("createdBy")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs available",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      total,
      page,
      limit,
      success: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: e.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await JobModel.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant",
        select: "_id", // Just get the IDs to keep the response small
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: e.message,
    });
  }
};

//update Job

export const updateJob = async (req, res) => {
  try {
    const userId = req.user;
    const {
      title,
      description,
      salary,
      requirements,
      location,
      jobType,
      position,
      company,
      experience,
    } = req.body;

    let formattedRequirements = requirements;
    if (typeof requirements === "string") {
      formattedRequirements = requirements
        .split(",")
        .map((requirement) => requirement.trim());
    }

    const jobId = req.params.id;
    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "No such Job exists",
      });
    }

    const updatedJob = await JobModel.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        salary,
        requirements: formattedRequirements,
        location,
        jobType,
        position,
        company,
        createdBy: userId,
        experience,
      },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(400).json({
        success: false,
        message: "Job not updated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user;
    
    // Need to dynamically import UserModel or rely on mongoose.model
    const mongoose = (await import("mongoose")).default;
    const User = mongoose.model("User");

    const user = await User.findById(userId).populate({
      path: 'profile.savedJobs',
      populate: {
        path: 'company'
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      savedJobs: user.profile.savedJobs || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getJobAnalytics = async (req, res) => {
  try {
    const adminId = req.user;
    
    // Find all jobs by this admin
    const jobs = await JobModel.find({ createdBy: adminId });
    const jobIds = jobs.map(job => job._id);

    // Get all applications for these jobs
    const Application = (await import("mongoose")).default.model("Application");
    const applications = await Application.find({ job: { $in: jobIds } });

    // 1. Total stats
    const totalJobs = jobs.length;
    const totalApplications = applications.length;

    // 2. Applications by status
    const statusCounts = {
      pending: 0,
      accepted: 0,
      rejected: 0
    };
    applications.forEach(app => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });

    // 3. Applications over time (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const applicationsByDate = {};
    last7Days.forEach(date => applicationsByDate[date] = 0);

    applications.forEach(app => {
      const dateStr = new Date(app.createdAt).toISOString().split('T')[0];
      if (applicationsByDate[dateStr] !== undefined) {
        applicationsByDate[dateStr]++;
      }
    });

    const timelineData = last7Days.map(date => ({
      date: date.substring(5), // mm-dd
      applications: applicationsByDate[date]
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalJobs,
        totalApplications,
        statusBreakdown: [
          { name: "Pending", value: statusCounts.pending, fill: "#f59e0b" },
          { name: "Accepted", value: statusCounts.accepted, fill: "#10b981" },
          { name: "Rejected", value: statusCounts.rejected, fill: "#ef4444" }
        ],
        timelineData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
