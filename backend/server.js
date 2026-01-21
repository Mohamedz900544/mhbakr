
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); 
app.use(cors({
    origin: '*', // Allow all for development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(mongoSanitize()); // Prevent NoSQL Injection

// Body Parsing
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/content', contentRoutes);

// Root Health Check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'active', message: 'VetCare API is online.' });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('🔥 Error:', err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`));
