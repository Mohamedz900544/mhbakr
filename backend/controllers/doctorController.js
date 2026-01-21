
import Doctor from '../models/Doctor.js';

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
    try {
        // Return verified doctors populated with user info
        const doctors = await Doctor.find({ verified: true }).populate('user', 'name email');
        
        // Flatten the structure for the frontend
        const formattedDoctors = doctors.map(doc => {
            const docObj = doc.toObject();
            return {
                ...docObj,
                id: docObj._id,
                name: docObj.user ? docObj.user.name : 'Unknown Doctor',
                email: docObj.user ? docObj.user.email : ''
            };
        });

        res.json(formattedDoctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');
        if (doctor) {
            const docObj = doctor.toObject();
            res.json({
                ...docObj,
                id: docObj._id,
                name: docObj.user ? docObj.user.name : 'Unknown Doctor'
            });
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
