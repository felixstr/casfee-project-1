import { todosStore } from '../services/todos-store.js';

export class TodosController {
    async getTodos(req, res) {
        res.json(await todosStore.all());
    }

    async addTodo(req, res) {
        // console.log('req.body', req.body);
        res.json(
            await todosStore.add(
                req.body.title,
                req.body.description,
                req.body.duedate,
                req.body.priority,
                req.body.done
            )
        );
    }

    async updateTodo(req, res) {
        // console.log('updateTodo', req.body);
        res.json(
            await todosStore.update(
                req.params.id,
                req.body.title,
                req.body.description,
                req.body.duedate,
                req.body.priority,
                req.body.done
            )
        );
    }

    async deleteTodo(req, res) {
        res.json(await todosStore.delete(req.params.id)); // TODO should return 402 if not ok
    }

    async getTodo(req, res) {
        res.json(await todosStore.get(req.params.id));
    }
}

export const todosController = new TodosController();
