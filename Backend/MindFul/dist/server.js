import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/UserRoutes/UserRoutes.js';
import adminRoutes from './routes/AdminRoutes/AdminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ============================================================
// ROUTES
// ============================================================
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'MindFul User API is running'
    });
});
// ============================================================
// ERROR HANDLER
// ============================================================
app.use(errorHandler);
// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map