import { Router } from 'express';
import { gastosController } from '../controllers/gastos.controller';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, (req, res) => gastosController.getGastos(req, res));
router.get('/:id', authMiddleware, (req, res) => gastosController.getGastoById(req, res));
router.post('/', authMiddleware, (req, res) => gastosController.createGasto(req, res));
router.put('/:id', authMiddleware, (req, res) => gastosController.updateGasto(req, res));
router.delete('/:id', authMiddleware, (req, res) => gastosController.deleteGasto(req, res));

export default router;