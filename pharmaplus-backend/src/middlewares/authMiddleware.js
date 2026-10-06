const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// =====================================================
// AUTHENTICATE USER
// =====================================================

const protect = async (req, res, next) => {
  try {
    let token;

    // -----------------------------------------------
    // Get Bearer Token
    // -----------------------------------------------

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // -----------------------------------------------
    // No Token
    // -----------------------------------------------

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    // -----------------------------------------------
    // Validate Token String
    // -----------------------------------------------

    if (
      token === 'undefined' ||
      token === 'null' ||
      token.trim() === ''
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token format',
      });
    }

    // -----------------------------------------------
    // JWT Secret
    // -----------------------------------------------

    const secret =
      process.env.JWT_SECRET ||
      'pharmaplus_fallback_secret_key_2026';

    // -----------------------------------------------
    // Verify JWT
    // -----------------------------------------------

    const decoded = jwt.verify(token, secret);

    // -----------------------------------------------
    // Get User ID From Token
    // -----------------------------------------------

    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload',
      });
    }

    // -----------------------------------------------
    // Fetch Current User
    // -----------------------------------------------

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        employeeId: true,
        branchId: true,

        branch: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
            status: true,
          },
        },
      },
    });

    // -----------------------------------------------
    // User Doesn't Exist
    // -----------------------------------------------

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found',
      });
    }

    // -----------------------------------------------
    // Block Inactive / Suspended Users
    // -----------------------------------------------

    if (
      user.status === 'INACTIVE' ||
      user.status === 'SUSPENDED'
    ) {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status.toLowerCase()}`,
      });
    }

    // -----------------------------------------------
    // Attach User To Request
    // -----------------------------------------------

    req.user = user;

    next();

  } catch (error) {

    console.error(
      'JWT Verification Error:',
      error.message
    );

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired, please login again',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};


// =====================================================
// ROLE BASED ACCESS CONTROL
// =====================================================

const authorize = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not authorized to access this resource`,
      });
    }

    next();
  };
};


// =====================================================
// BRANCH ACCESS CONTROL
// =====================================================

const authorizeBranchAccess = async (req, res, next) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Super Admin has global access
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const requestedBranchId =
      req.params.branchId ||
      req.body.branchId ||
      req.query.branchId;

    // If no branch specified, continue
    if (!requestedBranchId) {
      return next();
    }

    // User must belong to requested branch
    if (req.user.branchId !== requestedBranchId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this branch',
      });
    }

    next();

  } catch (error) {

    console.error(
      'Branch Authorization Error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Branch authorization failed',
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  protect,
  authorize,
  authorizeBranchAccess,

  // Backward compatibility
  authenticateToken: protect,
};