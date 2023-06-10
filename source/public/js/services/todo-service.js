import { httpService } from './http-service.js';
import { Todo } from './todo.js';

export class TodoService {
    constructor() {
        this.todos = [];
        this.sortBy = 'title';
        this.sortDirection = 'asc';

        this.loadSortSettings();
    }

    loadSortSettings() {
        this.sortBy = localStorage.getItem('sort-by') || this.sortBy;
        this.sortDirection = localStorage.getItem('sort-direction') || this.sortDirection;
    }

    async loadData() {
        const todoJson = await httpService.ajax('GET', 'api/todos');

        this.todos = todoJson.map(
            (item) =>
                new Todo(
                    item._id,
                    item.title,
                    item.description,
                    item.duedate,
                    item.priority,
                    item.done,
                    item.createdate
                )
        );

        this.sort();
        // console.log('loadData', this.todos);
    }

    async addTodo({ title, description, duedate, priority }, callback) {
        const todo = new Todo(undefined, title, description, duedate, priority);
        const answer = await httpService.ajax('POST', 'api/todos', todo);
        todo.id = answer._id;

        this.todos.push(todo);
        this.sort();

        callback(todo);
    }

    async updateTodo({ id, title, description, duedate, priority, done }, callback) {
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

        await httpService.ajax('PUT', `api/todos/${todo.id}`, todo);
        callback(todo);
    }

    getById(id) {
        return this.todos.find((todo) => todo.id === id);
    }

    async delete(todo) {
        await httpService.ajax('DELETE', `api/todos/${todo.id}`);
        this.todos.splice(this.todos.indexOf(todo), 1);
    }

    sort() {
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
}

export const todoService = new TodoService();
