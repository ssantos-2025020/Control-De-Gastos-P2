import { Router } from 'express';
import { presupuestosController } from '../controllers/presupuestos.controller';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, (req, res) => presupuestosController.getPresupuestos(req, res));
router.get('/:id', authMiddleware, (req, res) => presupuestosController.getPresupuestoById(req, res));
router.put('/:id', authMiddleware, (req, res) => presupuestosController.updateMonto(req, res));

export default router;