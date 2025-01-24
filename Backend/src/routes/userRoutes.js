import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser, loginUser } from '../controllers/userController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const routes = Router();

routes.post('/login', loginUser);
routes.get('/users', authMiddleware, getUsers); 
routes.get('/users/:userId', authMiddleware, getUserById); 
routes.post('/users', createUser);
routes.put('/users/:userId', authMiddleware, updateUser); 
routes.delete('/users/:userId', authMiddleware, deleteUser); 

export default routes;
