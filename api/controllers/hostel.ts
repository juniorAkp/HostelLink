import { Request, Response } from "express";
import { addAdminToHostel, addHostel, deleteHostelfromDb, editHostel, fetchHostels, getHostelByIdFromDb } from "../models/hostels";
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
    await addAdminToHostel(newHostel.id, req.user?.userId);
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
  const { hostelId } = req.params;
  try {
    const hostel = await getHostelByIdFromDb(hostelId);
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
  const { hostelId } = req.params;
  const { name, description, location, latitude, longitude, capacity, status, isBookable } =
    req.body;

  // // Validate latitude and longitude
  // if (typeof latitude !== "number" || typeof longitude !== "number") {
  //   return res.status(400).json({
  //     message: "Latitude and longitude must be numbers",
  //     success: false,
  //   });
  // }

  // // Validate capacity
  // if (typeof capacity !== "number" || capacity <= 0) {
  //   return res
  //     .status(400)
  //     .json({ message: "Capacity must be a positive number", success: false });
  // }
  try {
    // Fetch the existing hostel to get the current imageUrl if no new file is uploaded
    const existingHostel = await getHostelByIdFromDb(hostelId);
    if (!existingHostel) {
      return res
        .status(404)
        .json({ message: "Hostel not found", success: false });
    }
    const imageUrl = req.file
      ? (
          await cloudinaryConfig.uploader.upload(req.file.path, {
            folder: "hostels",
            resource_type: "image",
          })
        ).secure_url
      : existingHostel?.image_url || "";

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
  const { hostelId } = req.params;
  try {
    const result = await getHostelByIdFromDb(hostelId);
    // console.log("result", result[0].image_url);
    if (!result || result.length === 0) { 
      return res
        .status(404)
        .json({ message: "Hostel not found", success: false });
    }
    await cloudinaryConfig.uploader.destroy(result.image_url, {
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

