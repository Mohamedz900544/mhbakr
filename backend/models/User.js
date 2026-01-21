
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please add a name'] 
    },
    email: { 
        type: String, 
        required: [true, 'Please add an email'], 
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: { 
        type: String, 
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Don't return password by default
    },
    role: { 
        type: String, 
        enum: ['client', 'doctor', 'admin'], 
        default: 'client' 
    },
    phone: String,
    avatar: {
        type: String,
        default: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400'
    },
    status: { 
        type: String, 
        enum: ['active', 'banned', 'pending'], 
        default: 'active' 
    }
}, { timestamps: true });

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
