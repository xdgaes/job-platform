import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, currentRole } = req.body;

    // Validasi input basic
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validasi role
    const validRoles = ["clipper", "creator"];
    const role = currentRole && validRoles.includes(currentRole) ? currentRole : "clipper";

    // Cek duplikasi user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashed = await hashPassword(password);

    // Simpan user baru
    const user = await prisma.user.create({
      data: { name, email, password: hashed, currentRole: role },
      select: { id: true, name: true, email: true, currentRole: true } // ⛔ jangan kirim password ke client
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

    // Generate JWT token with current role
    const token = generateToken({ id: user.id, email: user.email, currentRole: user.currentRole });

    // Kirim hasil tanpa password
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, currentRole: user.currentRole },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ SWITCH ROLE
export const switchRole = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { currentRole } = req.body;

    // Validasi role
    const validRoles = ["clipper", "creator"];
    if (!currentRole || !validRoles.includes(currentRole)) {
      return res.status(400).json({ message: "Invalid role. Must be 'clipper' or 'creator'" });
    }

    // Update role di database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { currentRole },
      select: { id: true, name: true, email: true, currentRole: true }
    });

    // Generate new token with updated role
    const token = generateToken({ id: updatedUser.id, email: updatedUser.email, currentRole: updatedUser.currentRole });

    res.json({
      message: "Role switched successfully",
      token,
      user: updatedUser
    });
  } catch (err) {
    console.error("Switch role error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
