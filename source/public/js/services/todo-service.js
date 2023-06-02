import { Todo } from './todo.js';

export class TodoService {
    constructor() {
        this.todos = [];
        this.sortBy = 'title';
        this.sortDirection = 'asc';

        this.getSortByValue();
    }

    getSortByValue() {
        this.sortBy = localStorage.getItem('sort-by') || this.sortBy;
    }

    loadData() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.sort();
        // console.log('loadData', this.todos);
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    addTodo({ title, description, duedate, priority }, callback) {
        // console.log('TodoService.addTodo', title);
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
        // console.log('updateTodo id', id);

        const todo = this.getById(id);

        // console.log('updateTodo', todo);

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
        // console.log('sortBY', this.sortBy);
        // console.log('this.todos', this.todos);

        // sort ascending
        this.todos.sort((todo1, todo2) => {
            if (this.sortBy === 'priority') {
                return Number(todo1.priority) - Number(todo2.priority);
            } else if (this.sortBy === 'title') {
                if (todo1.title.toLowerCase() < todo2.title.toLowerCase()) {
                    return -1;
                }
                if (todo1.title.toLowerCase() > todo2.title.toLowerCase()) {
                    return 1;
                }
                return 0;
            } else if (this.sortBy === 'duedate') {
                // console.log('createdate', dateSorter(todo1.duedate, todo2.duedate));
                return dateSorter(todo1.duedate, todo2.duedate);
            } else if (this.sortBy === 'createdate') {
                // console.log('createdate', dateSorter(todo1.createdate, todo2.createdate));
                return dateSorter(todo1.createdate, todo2.createdate);
            }
        });

        function dateSorter(date1, date2) {
            date1 = new Date(date1);
            date2 = new Date(date2);
            if (isNaN(date1)) return 1;
            if (isNaN(date2)) return -1;
            return date1 - date2;
        }

        if (this.sortDirection === 'desc') {
            this.todos.reverse();
        }
    }

    createNewId() {
        if (this.todos.length === 0) return 1;
        const objectWithBiggestId = this.todos.reduce((a, b) => (a.id > b.id ? a : b));
        return objectWithBiggestId.id + 1;
    }
}

export const todoService = new TodoService();
