import Datastore from 'nedb-promises';

export class Todo {
    constructor(
        title,
        description,
        duedate,
        priority,
        completed,
        createdate = new Date().toJSON()
    ) {
        this.title = title;
        this.description = description;
        this.duedate = duedate;
        this.priority = priority;
        this.completed = completed;
        this.createdate = createdate;
    }
}

export class TodoStore {
    constructor(db) {
        const options = { filename: './source/server/data/todos.db', autoload: true };
        this.db = db || new Datastore(options);
    }

    async add(title, description, duedate, priority, completed) {
        const todo = new Todo(title, description, duedate, priority, completed);
        return this.db.insert(todo);
    }

    async update(id, title, description, duedate, priority, completed) {
        const todo = new Todo(title, description, duedate, priority, completed);
        await this.db.update({ _id: id }, todo);
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
