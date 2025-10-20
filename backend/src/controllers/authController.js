import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validasi input basic
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Cek duplikasi user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashed = await hashPassword(password);

    // Simpan user baru
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || "user" },
      select: { id: true, name: true, email: true, role: true } // ⛔ jangan kirim password ke client
    });

    res.json({ message: "Registered successfully", user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Bandingkan password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    // Kirim hasil tanpa password
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
