const express = require('express');
const cors = require('cors');
const path = require('path');

// 1. App Initialize
const app = express();

// 2. Middlewares (Must be before routes)
app.use(cors());
app.use(express.json());
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// 3. Routes Imports
const authRoutes = require('./routes/authRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const branchRoutes = require('./routes/branchRoutes');
const branchManagerRoutes = require('./routes/branchManagerRoutes'); // Branch Management Routess
const warehouseRoutes = require('./routes/warehouseRoutes');
const orderRoutes = require('./routes/orderRoutes');

// 4. API Routes Registration
app.use('/api/v1/auth', authRoutes); 
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/medicines', medicineRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/pharmacy', pharmacyRoutes);
app.use('/api/v1/branches', branchRoutes);
app.use('/api/v1/branch-managers', branchManagerRoutes); // Branch Management Routes
app.use('/api/v1/warehouse', warehouseRoutes); // Warehouse Management Routes
app.use('/api/v1/orders', orderRoutes);

// 5. Root Route (Server Status Check)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to PharmaPlus API System! 🚀',
  });
});

module.exports = app;