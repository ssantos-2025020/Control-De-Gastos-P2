import { Router } from 'express';
import { ingresosController } from '../controllers/ingresos.controller';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, (req, res) => ingresosController.getIngresos(req, res));
router.get('/:id', authMiddleware, (req, res) => ingresosController.getIngresoById(req, res));
router.post('/', authMiddleware, (req, res) => ingresosController.createIngreso(req, res));
router.put('/:id', authMiddleware, (req, res) => ingresosController.updateIngreso(req, res));
router.delete('/:id', authMiddleware, (req, res) => ingresosController.deleteIngreso(req, res));

export default router;