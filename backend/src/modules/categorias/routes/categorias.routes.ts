import { Router } from 'express';
import { categoriasController } from '../controllers/categorias.controller';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, (req, res) => categoriasController.getCategorias(req, res));
router.get('/:id', authMiddleware, (req, res) => categoriasController.getCategoriaById(req, res));
router.post('/', authMiddleware, (req, res) => categoriasController.createCategoria(req, res));
router.put('/:id', authMiddleware, (req, res) => categoriasController.updateCategoria(req, res));
router.delete('/:id', authMiddleware, (req, res) => categoriasController.deleteCategoria(req, res));

export default router;