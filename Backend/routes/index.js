import userRouter from './user.route.js';
import express from 'express';
import authRouter from './auth.route.js';
import novelRouter from './novel.route.js';
import searchRouter from './search.route.js';
import readingRouter from './reading.route.js';
import notificationRouter from './notification.route.js';
import interactionRouter from './interaction.route.js'
// Define the base route for the API
class ApiRouter {

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    
    initializeRoutes() {
        this.router.use('/users', userRouter);
        
        this.router.use('/auth', authRouter);
                
        this.router.use('/novels', novelRouter);
        
        this.router.use('/reading', readingRouter);
        
        this.router.use('/search', searchRouter);

        this.router.use('/notifications', notificationRouter);

        this.router.use('/interactions', interactionRouter)
    }
}   

export default new ApiRouter().router;