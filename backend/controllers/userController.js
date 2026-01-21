
import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user status
// @route   PUT /api/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
