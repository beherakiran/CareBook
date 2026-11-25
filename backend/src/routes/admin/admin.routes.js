
import express from 'express';
import { login, viewProfile, updateProfile, changePassword }  from '../../controllers/admin/admin.controller.js';
import  auth  from '../../middleware/auth.middleware.js';
import adminAuth from '../../middleware/adminAuth.js';

const route = express.Router();

export default (server)=> {

    route.post('/login',login)

    route.get('/view-profile',auth,adminAuth, viewProfile)

    route.put('/update-profile', auth,adminAuth, updateProfile)

    route.put('/change-password',auth,adminAuth , changePassword)

    server.use('/api/admin-panel/admin', route);
}
