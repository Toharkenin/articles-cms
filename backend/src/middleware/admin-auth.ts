import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AdminModel from '../models/admin';

export type AdminRole = 'super_admin' | 'admin';

interface AdminJwtPayload extends JwtPayload {
  adminId: string;
  role: AdminRole;
}

declare module 'express-serve-static-core' {
  interface Request {
    admin?: AdminJwtPayload;
  }
}

export const requireAdminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.['token'];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const admin = await AdminModel.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ success: false });
    }

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

export const requireRole = (...allowedRoles: AdminRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
    }

    next();
  };
};
