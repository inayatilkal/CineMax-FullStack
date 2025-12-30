import express from 'express';
import { findTheaters } from '../controllers/theaterController.js';

const router = express.Router();

router.get('/find-theaters', findTheaters);

export default router;
