import userRouter from './user.route.js';
import express from 'express';
import authRouter from './auth.route.js';
import categoryRouter from './category.route.js';

// Define the base route for the API
class ApiRouter {

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    
    initializeRoutes() {
        this.router.use('/users', userRouter);
        
        this.router.use('/auth', authRouter);
        
        this.router.use('/chapters', chapterRouter);
        
        this.router.use('/orders', novelRouter);
        
        this.router.use('/categories', categoryRouter);

        this.router.use('/history', historyRouter);

        this.router.use('/bookmark', bookmRouter);
    }
}   

export default new ApiRouter().router;