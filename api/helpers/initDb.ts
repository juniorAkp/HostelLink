import { sql } from "../config/db";

export const initDb = async () => {
  try {
    // Check and create enums if not exists
    const roleExists = await sql`SELECT 1 FROM pg_type WHERE typname = 'role'`;
    if (roleExists.length === 0) {
      await sql`CREATE TYPE role AS ENUM ('user', 'admin', 'student');`;
    }

    const hostelStatusExists =
      await sql`SELECT 1 FROM pg_type WHERE typname = 'hostel_status'`;
    if (hostelStatusExists.length === 0) {
      await sql`CREATE TYPE hostel_status AS ENUM ('available', 'occupied', 'maintenance');`;
    }

    const bookingStatusExists =
      await sql`SELECT 1 FROM pg_type WHERE typname = 'booking_status'`;
    if (bookingStatusExists.length === 0) {
      await sql`CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');`;
    }

    const roomGenderExists =
      await sql`SELECT 1 FROM pg_type WHERE typname = 'room_gender'`;
    if (roomGenderExists.length === 0) {
      await sql`CREATE TYPE room_gender AS ENUM ('male', 'female');`;
    }

    const roomTypeExists =
      await sql`SELECT 1 FROM pg_type WHERE typname = 'room_type'`;
    if (roomTypeExists.length === 0) {
      await sql`CREATE TYPE room_type AS ENUM ('single', 'double', 'suite');`;
    }

    const paymentStatusExists =
      await sql`SELECT 1 FROM pg_type WHERE typname = 'payment_status'`;
    if (paymentStatusExists.length === 0) {
      await sql`CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'failed');`;
    }

    const notificationStatusExists =
      await sql`SELECT 1 FROM pg_type WHERE typname = 'notification_status'`;
    if (notificationStatusExists.length === 0) {
      await sql`CREATE TYPE notification_status AS ENUM ('unread', 'read');`;
    }

    // Create tables in proper order
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        student_id VARCHAR(50) UNIQUE,
        date_of_birth DATE,
        phone_number VARCHAR(15),
        gender room_gender  NOT NULL,
        profile_url VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token SMALLINT,
        verification_token_expiry TIMESTAMP,
        last_login TIMESTAMP DEFAULT NOW(),
        reset_token SMALLINT,
        ghana_card_number VARCHAR(50) UNIQUE,
        reset_token_expiry TIMESTAMP,
        role role NOT NULL DEFAULT 'user',
        created_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS hostels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        description TEXT,
        location VARCHAR(255),
        latitude DECIMAL(9, 6),
        longitude DECIMAL(9, 6),
        capacity INTEGER NOT NULL,
        is_bookable BOOLEAN DEFAULT TRUE,
        image_url VARCHAR(255),
        status hostel_status DEFAULT 'available',
        created_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        hostel_id INTEGER REFERENCES hostels(id) ON DELETE CASCADE,
        room_type room_type NOT NULL,
        gender room_gender NOT NULL,
        room_number VARCHAR(10) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        amenities TEXT[],
        is_bookable BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP ,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
        hostel_id INTEGER REFERENCES hostels(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status booking_status DEFAULT 'pending',
        total_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        status payment_status DEFAULT 'pending',
        transaction_id VARCHAR(100) UNIQUE,
        created_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        status notification_status DEFAULT 'unread',
        created_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS hostel_owners (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        hostel_id INTEGER REFERENCES hostels(id) ON DELETE CASCADE,
        created_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`CREATE TABLE IF NOT EXISTS tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(255) NOT NULL,
      created_at TIMESTAMP,
      updated_at TIMESTAMP DEFAULT NOW()
    );`;
    console.log("Database initialized successfully with all tables created");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};
