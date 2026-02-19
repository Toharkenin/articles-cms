import { Router } from 'express';
import bcrypt from 'bcryptjs';
import AdminModel from '../models/admin';
import Auth from '../logic/auth';
import { requireAdminAuth } from '../middleware/admin-auth';

const router = Router();

router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

   const result = await new Auth().login(email, password);

   if (!result.success) {
     return res.status(401).json(result);
   }

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: false,      
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      user: result.user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

router.post('/create-admin', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin with this email already exists' 
      });
    }

    const result = await new Auth().createAdmin(firstName, lastName, email, password, phoneNumber);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new AdminModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber
    });

    await admin.save();

    res.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName
      }
    });
  } catch (error) {
    console.error('Seed admin error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

router.get('/get-admin', requireAdminAuth, async (req, res) => {
  try {
    const admin = req.admin;
      if (!admin) {
        return res.status(404).json({ 
          success: false, 
          message: 'Admin not found' 
        });
      }

    res.json({
        success: true,
        admin: {
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      }
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

export default router;