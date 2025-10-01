// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { authMiddleware, requireRole } = require('../middleware/authmiddleware');


// All routes require authentication
router.use(authMiddleware);

// Allow CSRs to GET /users?role=technician, all else admin only
router.get('/', (req, res, next) => {
	if (req.user.role === 'admin') return userController.listUsers(req, res, next);
	if (req.user.role === 'csr' && req.query.role === 'technician') return userController.listUsers(req, res, next);
	return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
});

// All other user management routes require admin
router.use(requireRole(['admin']));
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.patch('/:id', userController.updatePassword); // PATCH for password update
router.delete('/:id', userController.deleteUser);

module.exports = router;
