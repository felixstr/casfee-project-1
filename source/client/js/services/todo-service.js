import { httpService } from './http-service.js';
import { Todo } from './todo.js';
import { settingsStorage } from './settings-storage.js';

export class TodoService {
    constructor() {
        this.todos = [];
        this.sortBy = settingsStorage.getItem('sort-by') || 'title';
        this.sortDirection = settingsStorage.getItem('sort-direction') || 'asc';
    }

    async loadData() {
        const dbJson = await httpService.ajax('GET', 'api/todos');

        this.todos = dbJson.map(
            (item) =>
                new Todo(
                    item._id,
                    item.title,
                    item.description,
                    item.duedate,
                    item.priority,
                    item.completed,
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

    async updateTodo({ id, title, description, duedate, priority, completed }, callback) {
        const todo = this.getById(id);

        // console.log('updateTodo', todo);

        todo.title = title;
        todo.description = description;
        todo.setDuedate(duedate);
        todo.setPriority(priority);
        if (completed) {
            todo.completed = completed;
        }

        this.sort();

        await httpService.ajax('PATCH', `api/todos/${todo.id}`, todo);
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
        // reset sorting to always have the same order for elements with the same values
        this.todos.sort((todo1, todo2) => dateSorter(todo1.createdate, todo2.createdate));

        // sort ascending
        this.todos.sort((todo1, todo2) => {
            if (this.sortBy === 'priority') {
                return todo1.priority - todo2.priority;
            } else if (this.sortBy === 'title') {
                const title1 = todo1.title.toLowerCase();
                const title2 = todo2.title.toLowerCase();
                return title1 > title2 ? 1 : title1 < title2 ? -1 : 0;
            } else if (this.sortBy === 'duedate') {
                return dateSorter(todo1.duedate, todo2.duedate);
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
