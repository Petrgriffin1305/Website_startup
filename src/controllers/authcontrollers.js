const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const register = async (req, res) => {
  const { email, password, name, role, phone } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email đã tồn tại' });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = new User({ email, passwordHash, name, role: role || 'buyer', phone });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.json({ message: 'Đăng ký thành công', token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.json({ message: 'Đăng nhập thành công', token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
};

module.exports = { register, login };
