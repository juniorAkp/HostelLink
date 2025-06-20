import { Request, Response } from "express";
import { addHostel, deleteHostelfromDb, editHostel, fetchHostels } from "../models/hostels";
import cloudinaryConfig from "../config/cloudinary";

export const createHostel = async (req: Request, res: Response) => {
  const { name, description, location, latitude, longitude, capacity } =
    req.body;

  // Validate required fields
  if (
    !name ||
    !description ||
    !location ||
    !latitude ||
    !longitude ||
    !capacity
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }
  // Validate image URL
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "Image file is required", success: false });
  }
  const result = await cloudinaryConfig.uploader.upload(req.file.path, {
    folder: "hostels",
    resource_type: "image",
  });
  try {
    const newHostel = await addHostel(req.user?.userId, {
      name,
      description,
      location,
      latitude: Number(latitude),
      longitude: Number(longitude),
      capacity: Number(capacity),
      imageUrl: result.secure_url,
    });
    return res.status(201).json({
      message: "Hostel created successfully",
      hostel: newHostel,
      success: true,
    });
  } catch (error) {
    console.error("Error creating hostel:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", success: false });
  }
};
export const getHostels = async (req: Request, res: Response) => {
  const searchTerm = req.query.search as string | undefined;
  try {
    const hostels = await fetchHostels(searchTerm);
    return res.status(200).json({ hostels, success: true });
  } catch (error) {
    console.error("Error fetching hostels:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", success: false });
  }
};
export const getHostelById = async (req: Request, res: Response) => {
  const hostelId = req.params.id;
  try {
    const hostel = await fetchHostels().then((hostels) =>
      hostels.find((h) => h.id === hostelId)
    );
    if (!hostel) {
      return res
        .status(404)
        .json({ message: "Hostel not found", success: false });
    }
    return res.status(200).json({ hostel, success: true });
  } catch (error) {
    console.error("Error fetching hostel:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", success: false });
  }
};
export const updateHostel = async (req: Request, res: Response) => {
  const hostelId = req.params.id;
  const { name, description, location, latitude, longitude, capacity, status, isBookable } =
    req.body;

  // Validate required fields
  if (
    !name ||
    !description ||
    !location ||
    !latitude ||
    !longitude ||
    !capacity ||
    status === undefined ||
    isBookable === undefined
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  // Validate latitude and longitude
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({
      message: "Latitude and longitude must be numbers",
      success: false,
    });
  }

  // Validate capacity
  if (typeof capacity !== "number" || capacity <= 0) {
    return res
      .status(400)
      .json({ message: "Capacity must be a positive number", success: false });
  }
  try {
    // Fetch the existing hostel to get the current imageUrl if no new file is uploaded
    const existingHostel = await fetchHostels().then((hostels) =>
      hostels.find((h) => h.id === hostelId)
    );
    const imageUrl = req.file
      ? (
          await cloudinary.uploader.upload(req.file.path, {
            folder: "hostels",
            resource_type: "image",
          })
        ).secure_url
      : existingHostel?.imageUrl || "";

    const updatedHostel = await editHostel(hostelId, {
      name,
      description,
      location,
      latitude,
      longitude,
      capacity,
      imageUrl,
      status,
      isBookable,
    });
    return res.status(200).json({
      message: "Hostel updated successfully",
      hostel: updatedHostel,
      success: true,
    });
  } catch (error) {
    console.error("Error updating hostel:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", success: false });
  }
};
export const deleteHostel = async (req: Request, res: Response) => {
  const hostelId = req.params.id;
  try {
    const result = await fetchHostels().then((hostels) =>
      hostels.filter((h) => h.id !== hostelId)
    );
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Hostel not found", success: false });
    }
    await cloudinary.uploader.destroy(result[0].imageUrl, {
      resource_type: "image",
    });
    await deleteHostelfromDb(hostelId);
    return res.status(200).json({
      message: "Hostel deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting hostel:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", success: false });
  }
};
