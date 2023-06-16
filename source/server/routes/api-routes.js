import express from 'express';

const router = express.Router();
import { todosController } from '../controller/todos-controller.js';

router.get('/todos', todosController.getTodos);
router.post('/todos', todosController.addTodo);
router.patch('/todos/:id', todosController.updateTodo);
router.delete('/todos/:id', todosController.deleteTodo);
router.get('/todos/:id', todosController.getTodo);

export const apiRoutes = router;
