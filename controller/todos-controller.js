import { todosStore } from '../services/todos-store.js';

export class TodosController {
    getTodos = async (req, res) => {
        res.json(await todosStore.all());
    };

    addTodo = async (req, res) => {
        console.log('req.body', req.body);
        res.json(
            await todosStore.add(
                req.body.title,
                req.body.description,
                req.body.duedate,
                req.body.priority,
                req.body.done,
                req.body.createdate
            )
        );
    };

    updateTodo = async (req, res) => {
        console.log('updateTodo', req.body);
        res.json(
            await todosStore.update(
                req.params.id,
                req.body.title,
                req.body.description,
                req.body.duedate,
                req.body.priority,
                req.body.done,
                req.body.createdate
            )
        );
    };

    deleteTodo = async (req, res) => {
        res.json(await todosStore.delete(req.params.id)); // TODO should return 402 if not ok
    };

    getTodo = async (req, res) => {
        res.json(await todosStore.get(req.params.id));
    };
}

export const todosController = new TodosController();
