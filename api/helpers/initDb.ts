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
        created_at TIMESTAMP  DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS hostels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS rooms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE,
        capacity INTEGER NOT NULL,
        rooms_available INTEGER NOT NULL DEFAULT 0 CHECK (rooms_available >= 0),
        gender room_gender NOT NULL,
        room_number VARCHAR(10) NOT NULL,
        is_payment_insallment BOOLEAN DEFAULT FALSE,
        price DECIMAL(10, 2) NOT NULL,
        amenities TEXT[],
        is_bookable BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
        hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status booking_status DEFAULT 'pending',
        total_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        status payment_status DEFAULT 'pending',
        transaction_id VARCHAR(100) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        status notification_status DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS hostel_owners (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        hostel_id INTEGER REFERENCES hostels(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`CREATE TABLE IF NOT EXISTS tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(255) NOT NULL,
      created_at TIMESTAMP,
      updated_at TIMESTAMP DEFAULT NOW()
    );`;
    //fuction to trigger on update update the updated_at column
    // await sql`
    //   CREATE OR REPLACE FUNCTION update_updated_at_column()
    //   RETURNS TRIGGER AS $$
    //   BEGIN
    //     NEW.updated_at = NOW();
    //     RETURN NEW;
    //   END;
    //   $$ LANGUAGE plpgsql;
    // `;
    // // Trigger to call the function on update if not exists

    // await sql`
    //   CREATE TRIGGER update_users_updated_at
    //   BEFORE UPDATE ON users
    //   FOR EACH ROW
    //   EXECUTE FUNCTION update_updated_at_column();
    // `;
    // await sql`
    //   CREATE TRIGGER update_hostels_updated_at
    //   BEFORE UPDATE ON hostels
    //   FOR EACH ROW
    //   EXECUTE FUNCTION update_updated_at_column();
    // `;
    // await sql`
    //   CREATE TRIGGER update_rooms_updated_at
    //   BEFORE UPDATE ON rooms
    //   FOR EACH ROW
    //   EXECUTE FUNCTION update_updated_at_column();
    // `;
    // await sql`
    //   CREATE TRIGGER update_bookings_updated_at
    //   BEFORE UPDATE ON bookings
    //   FOR EACH ROW
    //   EXECUTE FUNCTION update_updated_at_column();
    // `;
    // await sql`
    //   CREATE TRIGGER update_payments_updated_at
    //   BEFORE UPDATE ON payments
    //   FOR EACH ROW
    //   EXECUTE FUNCTION update_updated_at_column();
    // `;
    // await sql`
    //   CREATE TRIGGER update_notifications_updated_at
    //   BEFORE UPDATE ON notifications
    //   FOR EACH ROW
    //   EXECUTE FUNCTION update_updated_at_column();
    // `;
    // await sql`
    //   CREATE TRIGGER update_hostel_owners_updated_at
    //   BEFORE UPDATE ON hostel_owners
    //   FOR EACH ROW
    //   EXECUTE FUNCTION update_updated_at_column();
    // `;
    // await sql`
    //   CREATE TRIGGER update_tokens_updated_at
    //   BEFORE UPDATE ON tokens
    //   FOR EACH ROW
    //   EXECUTE FUNCTION update_updated_at_column();
    // `;
    console.log("Database initialized successfully with all tables created");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};
