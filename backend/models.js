
// This file is deprecated. Please use the models in backend/models/ directory.
// This adapter ensures no "require is not defined" error occurs if accidentally loaded.

import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Appointment from './models/Appointment.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import BlogPost from './models/BlogPost.js';
import ForumTopic from './models/ForumTopic.js';
import AdoptionPet from './models/AdoptionPet.js';

export { User, Doctor, Appointment, Product, Order, BlogPost, ForumTopic, AdoptionPet };
