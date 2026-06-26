import { Worker } from "../models/workerModel.js";

// Helper function to slugify names
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// GET all approved workers with filtering, search, and ranking-based sorting
export const getAllWorkers = async (req, res) => {
  try {
    const { category, city, area, rating, search, page = 1, limit = 10 } = req.query;
    const filter = { approved: true };

    if (category) {
      filter.$or = [
        { serviceCategories: { $in: [new RegExp(category, "i")] } },
        { profession: new RegExp(category, "i") }
      ];
    }

    if (city) {
      filter.city = new RegExp(city, "i");
    }

    if (area) {
      filter.area = new RegExp(area, "i");
    }

    if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }

    if (search) {
      filter.$or = [
        { $text: { $search: search } },
        { name: new RegExp(search, "i") },
        { profession: new RegExp(search, "i") },
        { city: new RegExp(search, "i") },
        { area: new RegExp(search, "i") }
      ];
    }

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);
    const workers = await Worker.find(filter)
      .sort({ rankingScore: -1, rating: -1, totalReviews: -1 })
      .skip(skipIndex)
      .limit(parseInt(limit));

    const total = await Worker.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: workers.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      workers
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// GET a worker's public profile by SEO slug (safe, masks phone, hides Aadhaar)
export const getWorkerBySlug = async (req, res) => {
  try {
    const worker = await Worker.findOne({ slug: req.params.slug, approved: true });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found or not approved" });
    }

    const workerData = worker.toObject();
    delete workerData.aadhaarNumber; // Always hide Aadhaar

    // Mask phone number for public preview
    if (workerData.phone) {
      workerData.phone = workerData.phone.replace(/.(?=.{4})/g, "*");
    }

    return res.status(200).json({
      success: true,
      worker: workerData
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// GET a worker profile by ID (protected, reveals phone, increments views)
export const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Increment profile view count if the viewer is not the worker themselves
    if (worker.userId.toString() !== req.user.id) {
      worker.profileViews = (worker.profileViews || 0) + 1;
      await worker.save();
    }

    const workerData = worker.toObject();

    // Hide Aadhaar unless requested by admin or the worker themselves
    if (req.user.role !== "admin" && worker.userId.toString() !== req.user.id) {
      delete workerData.aadhaarNumber;
    }

    return res.status(200).json({
      success: true,
      worker: workerData
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// PUT update worker's professional profile
export const updateWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user.id });
    if (!worker) {
      return res.status(404).json({ message: "Worker profile not found!" });
    }

    const editableFields = [
      "name",
      "phone",
      "email",
      "profession",
      "experience",
      "description",
      "serviceCategories",
      "serviceAreas",
      "city",
      "area",
      "profileImage",
      "aadhaarNumber"
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        worker[field] = req.body[field];
      }
    });

    if (req.body.name) {
      const baseSlug = slugify(req.body.name);
      const suffix = worker.phone.toString().slice(-4);
      worker.slug = `${baseSlug}-${suffix}`;
    }

    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      worker
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// PUT update worker availability status
export const updateWorkerAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    if (!availability || !["Available", "Busy", "Offline"].includes(availability)) {
      return res.status(400).json({ message: "Invalid availability status!" });
    }

    const worker = await Worker.findOne({ userId: req.user.id });
    if (!worker) {
      return res.status(404).json({ message: "Worker profile not found!" });
    }

    worker.availability = availability;
    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Availability status updated successfully",
      availability: worker.availability,
      rankingScore: worker.rankingScore
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
