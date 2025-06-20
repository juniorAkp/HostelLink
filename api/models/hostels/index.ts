import { sql } from "../../config/db";

interface Hostel { 
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  capacity: number;
  isBookable?: boolean;
  imageUrl: string;
  status?: 'available' | 'occupied' | 'maintenance';

}
export const addHostel = async (ownerId:string,hostel: Hostel) => { 
  const {
    name,
    description,
    location,
    latitude,
    longitude,
    capacity,
    imageUrl,
  } = hostel;
  try {
    const result = await sql`
      INSERT INTO hostels (name, owner_id, description, location, latitude, longitude, capacity, image_url, created_at)
      VALUES (${name}, ${ownerId}, ${description}, ${location}, ${latitude}, ${longitude}, ${capacity}, ${imageUrl}, NOW())
      RETURNING *;
    `;
  
    return result[0];
    
  } catch (error) {
    console.error("Error creating hostel:", error);
    throw new Error("Failed to create hostel");
  }
}
//get hostels and include search functionality
export const fetchHostels = async (searchTerm?: string) => {
  try {
    const result = await sql`
      SELECT * FROM hostels
      ${searchTerm ? sql`WHERE name LIKE ${"%" + searchTerm + "%"}` : sql``}
    `;
    return result;
  } catch (error) {
    console.error("Error fetching hostels:", error);
    throw new Error("Failed to fetch hostels");
  }
}

export const editHostel = async (hostelId: string, updates: Partial<Hostel>) => {
  const {
    name,
    description,
    location,
    latitude,
    longitude,
    capacity,
    imageUrl,
    status,
    isBookable,
  } = updates;
  try {
    const result = await sql`
      UPDATE hostels
      SET
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        location = COALESCE(${location}, location),
        latitude = COALESCE(${latitude}, latitude),
        longitude = COALESCE(${longitude}, longitude),
        capacity = COALESCE(${capacity}, capacity),
        status = COALESCE(${status}, status),
        is_bookable = COALESCE(${isBookable}, is_bookable),
        image_url = COALESCE(${imageUrl}, image_url)
      WHERE id = ${hostelId}
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error("Error updating hostel:", error);
    throw new Error("Failed to update hostel");
  }
}

export const deleteHostelfromDb = async (hostelId: string) => {
  try {
     await sql`
      DELETE FROM hostels
      WHERE id = ${hostelId}
    `;
  } catch (error) {
    console.error("Error deleting hostel:", error);
    throw new Error("Failed to delete hostel");
  }
}

export const addAdminToHostel = async (hostelId: string, adminId: string) => {
  try {
    await sql`
      INSERT INTO hostel_admins (hostel_id, admin_id, created_at)
      VALUES (${hostelId}, ${adminId}, NOW())
      RETURNING *;
    `;
  } catch (error) {
    console.error("Error adding admin to hostel:", error);
    throw new Error("Failed to add admin to hostel");
  }
}