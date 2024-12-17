import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const routes = Router();

routes.get('/users', getUsers); 
routes.get('/users/:userId', getUserById); 
routes.post('/users', createUser);
routes.put('/users/:userId', updateUser); 
routes.delete('/users/:userId', deleteUser); 

export default routes;
