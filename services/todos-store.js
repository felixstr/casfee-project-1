import Datastore from 'nedb-promises';

export class Todo {
    constructor(title, description, duedate, priority, done, createdate = new Date().toJSON()) {
        this.title = title;
        this.description = description;
        this.duedate = duedate;
        this.priority = priority;
        this.done = done;
        this.createdate = createdate;
    }
}

export class TodoStore {
    constructor(db) {
        const options = { filename: './data/todos.db', autoload: true };
        this.db = db || new Datastore(options);
    }

    async add(title, description, duedate, priority, done) {
        const todo = new Todo(title, description, duedate, priority, done);
        return this.db.insert(todo);
    }

    async update(id, title, description, duedate, priority, done) {
        const oldTodo = await this.get(id);
        const todo = new Todo(title, description, duedate, priority, done, oldTodo.createdate);
        await this.db.update({ _id: id }, { $set: todo });
        return this.get(id);
    }

    async delete(id) {
        return await this.db.remove({ _id: id });
    }

    async get(id) {
        return this.db.findOne({ _id: id });
    }

    async all() {
        return this.db.find();
    }
}

export const todosStore = new TodoStore();
