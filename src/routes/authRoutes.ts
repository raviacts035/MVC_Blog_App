import {Router} from 'express';
import { LoginUser, RegistreUser} from '../controllers/userController';

const authRoutes=Router();

authRoutes.post('/login',LoginUser);
authRoutes.post('/register',RegistreUser);

export default authRoutes