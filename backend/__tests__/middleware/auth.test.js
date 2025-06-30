const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin } = require('../../src/middleware/auth');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      user: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  describe('verifyToken', () => {
    it('should return 401 if no token is provided', () => {
      verifyToken(mockReq, mockRes, nextFunction);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No token provided' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      mockReq.headers.authorization = 'Bearer invalid-token';
      
      verifyToken(mockReq, mockRes, nextFunction);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should call next() if token is valid', () => {
      const token = jwt.sign({ id: '123', role: 'user' }, process.env.JWT_SECRET);
      mockReq.headers.authorization = `Bearer ${token}`;
      
      verifyToken(mockReq, mockRes, nextFunction);
      
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.id).toBe('123');
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('isAdmin', () => {
    it('should return 403 if user is not admin', () => {
      mockReq.user = { role: 'user' };
      
      isAdmin(mockReq, mockRes, nextFunction);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Access Forbidden: Admin privileges required' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should call next() if user is admin', () => {
      mockReq.user = { role: 'admin' };
      
      isAdmin(mockReq, mockRes, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
    });
  });
}); 