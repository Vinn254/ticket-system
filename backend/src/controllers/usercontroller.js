// Admin updates user (password or general)
exports.updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (password) {
      // Update password
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.password = password;
      await user.save();
      res.json({ message: 'Password updated' });
    } else {
      // General update
      const updates = { ...req.body };
      delete updates.password; // do not change password here
      const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ user });
    }
  } catch (err) {
    next(err);
  }
};
// src/controllers/userController.js
const User = require('../models/user');

// List users (admin, or csr for technicians only)
exports.listUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    // Only admin can list all users; csr can only list technicians
    if (req.user.role !== 'admin') {
      if (req.user.role === 'csr' && role === 'technician') {
        // allow
      } else {
        return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
      }
    }

    const users = await User.find(filter)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// Admin creates users (csr/technician/admin/customer/contractor)
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, specialization, deviceType, firstName, otherNames, accountNumber, customerSegment, serviceType, routerMacAddress } = req.body;
    if (!name || !email || !password || !role || !phone) return res.status(400).json({ message: 'Missing fields' });
    if (!['csr', 'technician', 'admin', 'customer', 'contractor'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = new User({ name, email, password, role, phone });
    if ((role === 'technician' || role === 'contractor') && specialization) {
      user.specialization = specialization;
    }
    if (role === 'customer') {
      if (deviceType) user.deviceType = deviceType;
      if (firstName) user.firstName = firstName;
      if (otherNames) user.otherNames = otherNames;
      if (accountNumber) user.accountNumber = accountNumber;
      if (customerSegment) user.customerSegment = customerSegment;
      if (serviceType) user.serviceType = serviceType;
      if (routerMacAddress) user.routerMacAddress = routerMacAddress;
    }
    await user.save();

    res.status(201).json({ user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

// Admin updates user
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.password; // do not change password here
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// Admin deletes user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
