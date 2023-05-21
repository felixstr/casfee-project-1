import { openModal } from './modal.js';

const CLASS_LIST = '.js-list';
const CLASS_SORT_SELECT = '.js-sort';

const todoController = {
    todos: [],
    sortBy: 'priority',
    listElement: document.querySelector(CLASS_LIST),
    sortSelectElement: document.querySelector(CLASS_SORT_SELECT),

    init: function () {
        // console.log('init todoController');
        this.read();
        this.sort();
        this.renderTodoList();
        this.addEventListeners();
    },

    read: function () {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    },

    renderTodoList: function () {
        // @todo: handlebars?
        this.listElement.innerHTML =
            this.todos
                .map((todo) => {
                    let prio = '';
                    for (let i = 0; i < todo.priority; i++) {
                        prio += '!';
                    }
                    let dateFormatted = '';
                    if (todo.duedate) {
                        dateFormatted = new Intl.DateTimeFormat('ch-DE').format(
                            new Date(todo.duedate)
                        );
                    }
                    return `<div class="todo-item js-todo-item" data-id="${
                        todo.id
                    }">
                            <div class="todo-item__bullet ">
                                <div class="bullet ${
                                    todo.done ? 'bullet--done' : ''
                                } js-done"></div>
                            </div>
                            <div class="todo-item__content">
                                <div class="todo-item__description">
                                    <div class="todo-item__prio">${prio}</div>
                                    <div class="todo-item__title">${
                                        todo.title
                                    }</div>
                                </div>
                                <div class="todo-item__text">${
                                    todo.description
                                }</div>
                                <div class="todo-item__due-date">${dateFormatted}</div>
                            </div>
                            <div class="todo-item__action">
                                <button class="button button--tiny js-edit">Edit</button>
                                <button class="button button--tiny js-delete">Delete</button>
                            </div>
                        </div>`;
                })
                .join('') ||
            `<div class="empty-list">Noch keine Todos vorhanden</div>`;
    },

    addTodo: function (todo, callback) {
        const newTodoId = this.createNewId();

        console.log('newTodoId', newTodoId);
        const newTodo = {
            id: newTodoId,
            title: todo.title,
            description: todo.description,
            duedate: todo.duedate,
            priority: todo.priority,
        };

        this.todos.push(newTodo);
        this.sort();
        this.store();

        // simulate loading
        setTimeout(() => {
            this.renderTodoList();
            callback(newTodo);
        }, 2000);
    },

    updateTodo: function (todo, callback) {
        this.editTodo.title = todo.title;
        this.editTodo.description = todo.description;
        this.editTodo.duedate = todo.duedate;
        this.editTodo.priority = todo.priority;

        this.sort();
        this.store();

        // simulate loading
        setTimeout(() => {
            this.renderTodoList();
            callback(this.editTodo);
        }, 2000);
    },

    sort: function () {
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
                return todo2Date - todo1Date;
            }
        });

        this.sortSelectElement.value = this.sortBy;
    },

    addEventListeners: function () {
        this.listElement.addEventListener('click', (event) => {
            const id = Number(event.target.closest('[data-id]').dataset.id);
            const todo = this.todos.find((todo) => todo.id === id);

            if (event.target.matches('.js-edit')) {
                this.editTodo = todo;
                openModal(todo);
            }
            if (event.target.matches('.js-delete')) {
                this.openDeleteConfirmDialog(todo);
            }
            if (event.target.matches('.js-done')) {
                this.toggleDone(todo);
            }
        });

        this.sortSelectElement.addEventListener('change', (event) => {
            this.changeSort(event.target.value);
        });
    },

    changeSort: function (sort) {
        this.sortBy = sort;
        this.sort();
        this.renderTodoList();
    },

    openDeleteConfirmDialog: function (todo) {
        if (window.confirm('Todo wirklich löschen?')) {
            this.todos.splice(this.todos.indexOf(todo), 1);
            this.store();
            this.renderTodoList();
        }
    },

    toggleDone: function (todo) {
        todo.done = !todo.done;
        this.store();
        this.renderTodoList();
    },

    store: function () {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    },

    createNewId: function () {
        if (this.todos.length === 0) return 0;
        const objectWithBiggestId = this.todos.reduce((a, b) =>
            a.id > b.id ? a : b
        );
        return objectWithBiggestId.id + 1;
    },
};

export default todoController;
