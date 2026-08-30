import { Router } from 'express';
import { usuariosController } from '../controllers/usuarios.controller';
import { authMiddleware, adminOnlyMiddleware } from '../../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, adminOnlyMiddleware, (req, res) =>
  usuariosController.getUsuarios(req, res),
);

router.get('/:id', authMiddleware, adminOnlyMiddleware, (req, res) =>
  usuariosController.getUsuarioById(req, res),
);

router.post('/', authMiddleware, adminOnlyMiddleware, (req, res) =>
  usuariosController.createUsuario(req, res),
);

router.put('/:id', authMiddleware, adminOnlyMiddleware, (req, res) =>
  usuariosController.updateUsuario(req, res),
);

router.delete('/:id', authMiddleware, adminOnlyMiddleware, (req, res) =>
  usuariosController.deleteUsuario(req, res),
);

export default router;