import { Todo } from './todo.js';

export class TodoService {
    constructor() {
        this.todos = [];
        this.sortBy = 'title';
    }

    loadData() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.sort();
        console.log('loadData', this.todos);
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    addTodo({ title, description, duedate, priority }, callback) {
        console.log('TodoService.addTodo', title);
        const id = this.createNewId();
        const todo = new Todo(id, title, description, duedate, priority);

        this.todos.push(todo);

        this.save();

        // simulate loading
        setTimeout(() => {
            callback(todo);
        }, 500);
    }

    updateTodo({ id, title, description, duedate, priority, done }, callback) {
        console.log('updateTodo id', id);
        console.log('updateTodo done', done);
        const todo = this.getById(id);

        console.log('updateTodo', todo);

        todo.title = title;
        todo.description = description;
        todo.duedate = duedate;
        todo.priority = priority;
        if (done) {
            todo.done = done;
        }

        this.sort();
        this.save();

        // simulate loading
        setTimeout(() => {
            callback(todo);
        }, 500);
    }

    getById(id) {
        return this.todos.find((todo) => todo.id === Number(id));
    }

    remove(todo) {
        this.todos.splice(this.todos.indexOf(todo), 1);
        this.save();
    }

    sort() {
        this.todos.sort((todo1, todo2) => {
            if (this.sortBy === 'priority') {
                return Number(todo2.priority) - Number(todo1.priority);
            } else if (this.sortBy === 'title') {
                if (todo1.title.toLowerCase() < todo2.title.toLowerCase()) {
                    return -1;
                }
                if (todo1.title.toLowerCase() > todo2.title.toLowerCase()) {
                    return 1;
                }
                return 0;
            } else if (this.sortBy === 'duedate') {
                const todo1Date = new Date(todo1.duedate);
                const todo2Date = new Date(todo2.duedate);
                if (isNaN(todo1Date)) return 1;
                if (isNaN(todo2Date)) return -1;
                return todo1Date - todo2Date;
            }
        });

        // this.sortSelectElement.value = this.sortBy;
    }

    createNewId() {
        if (this.todos.length === 0) return 1;
        const objectWithBiggestId = this.todos.reduce((a, b) => (a.id > b.id ? a : b));
        return objectWithBiggestId.id + 1;
    }
}

export const todoService = new TodoService();
