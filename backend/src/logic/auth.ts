import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminModel from '../models/admin';

interface LoginResult {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface CreateAdminResult {
  success: boolean;
  message: string;
  admin?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

class Auth {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || '';
  }

  async login(email: string, password: string): Promise<LoginResult> {
    try {
      const admin = await AdminModel.findOne({ email: email.toLowerCase() });
      if (!admin) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: admin._id.toString(),
          role: admin.role
        },
        this.jwtSecret,
        { expiresIn: '5d' }
     );

      return {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: admin._id.toString(),
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  }


  async createAdmin(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<CreateAdminResult> {
    try {
      // Check if admin already exists
      const existingAdmin = await AdminModel.findOne({ email: email.toLowerCase() });
      if (existingAdmin) {
        return {
          success: false,
          message: 'Admin with this email already exists'
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin
      const admin = new AdminModel({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        phoneNumber
      });

      await admin.save();

      return {
        success: true,
        message: 'Admin created successfully',
        admin: {
          id: admin._id.toString(),
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
        }
      };
    } catch (error) {
      console.error('Create admin error:', error);
      return {
        success: false,
        message: 'An error occurred while creating admin'
      };
    }
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  /**
   * Hash a password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Compare password with hashed password
   */
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

export default Auth;