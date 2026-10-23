const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Bắt buộc đăng nhập: đọc token từ header "Authorization: Bearer <token>"
exports.verifyUser = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'You are not logged in' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Chỉ admin mới được thêm/sửa/xóa
exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) return next();
  res.status(403).json({ message: 'You are not authorized to perform this operation' });
};

// Trả lỗi 400 nếu express-validator phát hiện dữ liệu sai
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map((e) => e.msg).join(', ') });
  }
  next();
};
