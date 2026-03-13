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
        message: 'Email and password are required',
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
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: result.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.post('/create-admin', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, role } = req.body;

    const authService = new Auth();
    const result = await authService.createAdmin(
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role
    );

    res.json({
      success: result.success,
      message: result.message,
      admin: {
        id: result.admin?.id,
        email: result.admin?.email,
        firstName: result.admin?.firstName,
        lastName: result.admin?.lastName,
        role: result.admin?.role,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.get('/get-admin', requireAdminAuth, async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    res.json({
      success: true,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        phoneNumber: admin.phoneNumber,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.get('/get-admins', async (req, res) => {
  try {
    const result = await new Auth().getAdmins();
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json({
      success: true,
      admins: result.admins,
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.get('/get-admin/:id', async (req, res) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin ID',
      });
    }

    const result = await new Auth().getAdminById(id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json({
      success: true,
      admin: result.admin,
    });
  } catch (error) {
    console.error('Get admin by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
