require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const crypto = require("crypto");

const app = express();
const SESSION_DURATION_MS = 60 * 60 * 1000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  //   waitForConnections: true,
  //   connectionLimit: 10,
  //   queueLimit: 0,
});

(async () => {
  try {
    const connection = await db.getConnection();

    console.log("Database connected");

    connection.release();

    await ensureLoginHistorySchema();
  } catch (err) {
    console.log("Database connection failed");

    console.log(err);
  }
})();

const router = express.Router();

async function ensureLoginHistorySchema() {
  const [sessionIdColumns] = await db.query(
    `
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'admin_login_history'
      AND COLUMN_NAME = 'session_id'
    `,
  );

  if (sessionIdColumns.length === 0) {
    await db.query(
      `
      ALTER TABLE admin_login_history
      ADD COLUMN session_id VARCHAR(36) NULL AFTER admin_id
      `,
    );
  }

  await db.query(
    `
    ALTER TABLE admin_login_history
    MODIFY token TEXT NOT NULL
    `,
  );
}

async function recordExpiredSessions(adminId) {
  await db.query(
    `
    UPDATE admin_login_history
    SET logout_time = expire_time
    WHERE admin_id = ?
      AND logout_time IS NULL
      AND expire_time <= NOW()
    `,
    [adminId],
  );
}

router.post("/signin", async (req, res) => {
  console.log("Attempting to sign in...");
  try {
    const { email, password } = req.body;

    const [results] = await db.query(`SELECT * FROM admins WHERE email = ?`, [
      email,
    ]);

    if (results.length === 0) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const admin = results[0];
    const isMatch = await argon2.verify(admin.password, password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    await recordExpiredSessions(admin.id);

    console.log("Creating token...");

    const sessionId = crypto.randomUUID();
    const tokenNonce = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "admin",
        sessionId,
        tokenNonce,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: Math.floor(SESSION_DURATION_MS / 1000),
        jwtid: sessionId,
      },
    );

    console.log("Generated at:", new Date().toISOString());
    console.log("Session ID:", sessionId);
    console.log("Token :", token);

    await db.query(
      `
  INSERT INTO admin_login_history (
      admin_id,
      session_id,
      token,
      login_time,
      expire_time
  )
  VALUES (
      ?,
      ?,
      ?,
      NOW(),
      ?
  )
  `,
      [admin.id, sessionId, token, expiresAt],
    );

    res.json({
      message: "Login successful",
      token,
      sessionId,
      expiresAt: expiresAt.toISOString(),
      admin: {
        id: admin.id,
        firstName: admin.first_name,
        lastName: admin.last_name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    console.log("Logout token:", token);

    await db.query(
      `
      UPDATE admin_login_history
      SET logout_time = COALESCE(logout_time, NOW())
      WHERE token = ?
      `,
      [token]
    );

    res.json({
      message: "Logout successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
