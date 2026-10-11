import { Router } from 'express';
import { getProviderById, createProvider } from './provider.controller.js';
const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Provider route is working!',
    });
});
router.get('/:id', getProviderById);
router.post('/', createProvider);

export default router;