import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const sqlite = sqlite3.verbose();
const db = new sqlite.Database('./database.sqlite');

// Promisify database methods
db.runAsync = promisify(db.run.bind(db));
db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));

// Initialize database schema
export const initDatabase = async () => {
  try {
    // Users table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('patient', 'doctor', 'hospital')),
        name TEXT NOT NULL,
        wallet_address TEXT UNIQUE,
        license_number TEXT,
        specialization TEXT,
        hospital TEXT,
        date_of_birth TEXT,
        blood_type TEXT,
        emergency_contact TEXT,
        is_verified INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Medical reports table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS medical_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_hash TEXT NOT NULL,
        file_size TEXT,
        file_type TEXT,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        blockchain_tx TEXT,
        ipfs_hash TEXT,
        FOREIGN KEY (patient_id) REFERENCES users(id)
      )
    `);

    // Access permissions table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS access_permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_id INTEGER NOT NULL,
        doctor_id INTEGER NOT NULL,
        patient_id INTEGER NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('pending', 'active', 'revoked', 'expired')) DEFAULT 'pending',
        reason TEXT,
        granted_at DATETIME,
        expires_at DATETIME,
        blockchain_tx TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (report_id) REFERENCES medical_reports(id),
        FOREIGN KEY (doctor_id) REFERENCES users(id),
        FOREIGN KEY (patient_id) REFERENCES users(id)
      )
    `);

    // Activity logs table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        report_id INTEGER,
        action TEXT NOT NULL,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        blockchain_tx TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (report_id) REFERENCES medical_reports(id)
      )
    `);

    // Diagnoses table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS diagnoses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_id INTEGER NOT NULL,
        patient_id INTEGER NOT NULL,
        report_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        file_name TEXT,
        file_path TEXT,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES users(id),
        FOREIGN KEY (patient_id) REFERENCES users(id),
        FOREIGN KEY (report_id) REFERENCES medical_reports(id)
      )
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

export default db;
