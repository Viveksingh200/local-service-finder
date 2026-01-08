import Service from "../models/serviceModel.js";

export const createService = async (req, res) => {
    try {
        const { title, category, description, price, location } = req.body;

  if (!title || !category || !description || !price || !location) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const service = await Service.create({
    title,
    category,
    description,
    price,
    location,
    providerId: req.user.id,
  });

  return res
    .status(201)
    .json({
      success: true,
      message: "Service created and pending approval",
      service,
    });
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};
