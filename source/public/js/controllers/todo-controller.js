import DialogController from './dialog-controller.js';
import { todoService } from '../services/todo-service.js';

const SELECTOR_LIST = '.js-list';
const SELECTOR_SORT_SELECT = '.js-sort';
const SELECTOR_BUTTON_NEW = '.js-button-new';

class TodoController {
    constructor() {
        this.listElement = document.querySelector(SELECTOR_LIST);
        this.sortSelectElement = document.querySelector(SELECTOR_SORT_SELECT);
        this.buttonNewlement = document.querySelector(SELECTOR_BUTTON_NEW);

        this.dialogController = new DialogController(this);
    }

    initialize() {
        this.initEventHandlers();
        todoService.loadData();
        this.renderTodoList();
        this.setSortByValue();
    }

    initEventHandlers() {
        this.buttonNewlement.addEventListener('click', () => {
            this.dialogController.openDialog();
        });

        this.listElement.addEventListener('click', (event) => {
            const id = Number(event.target.closest('[data-id]').dataset.id);
            const todo = todoService.getById(id);

            if (event.target.matches('.js-edit')) {
                this.dialogController.openDialog(todo);
            } else if (event.target.matches('.js-delete')) {
                this.openDeleteConfirmDialog(todo);
            } else if (event.target.matches('.js-done')) {
                this.toggleDone(todo);
            }
        });

        this.sortSelectElement.addEventListener('change', (event) => {
            todoService.sortBy = event.target.value;
            todoService.sort();
            this.renderTodoList();
            localStorage.setItem('sort-by', event.target.value);
        });
    }

    renderTodoList() {
        this.listElement.innerHTML =
            todoService.todos.map((todo) => this.renderItemTemplate(todo)).join('') ||
            `<div class="empty-list">Noch keine Todos vorhanden</div>`;
    }

    renderItemTemplate(todo) {
        let prio = '';
        for (let i = 0; i < todo.priority; i++) {
            prio += '!';
        }

        const dateFormatted = todo.duedate
            ? new Date(todo.duedate).toLocaleDateString()
            : undefined;

        return `<div class="todo-item js-todo-item" data-id="${todo.id}">
                    <div class="todo-item__bullet ">
                        <div class="bullet ${todo.done ? 'bullet--done' : ''} js-done"></div>
                    </div>
                    <div class="todo-item__content">
                        <div class="todo-item__description">
                            <div class="todo-item__prio">${prio}</div>
                            <div class="todo-item__title">${todo.title}</div>
                        </div>
                        ${
                            todo.description
                                ? `<div class="todo-item__text">${todo.description}</div>`
                                : ''
                        }
                        ${
                            dateFormatted
                                ? `<div class="todo-item__due-date">${dateFormatted}</div>`
                                : ''
                        }   
                    </div>
                    <div class="todo-item__action">
                        <button class="button button--tiny js-edit">Edit</button>
                        <button class="button button--tiny js-delete">Delete</button>
                    </div>
                </div>`;
    }

    openDeleteConfirmDialog(todo) {
        if (window.confirm('Todo wirklich löschen?')) {
            todoService.remove(todo);
            this.renderTodoList();
        }
    }

    toggleDone(todo) {
        todo.done = !todo.done;
        todoService.updateTodo(todo, () => {
            console.log('todo erledigt');
        });
        this.renderTodoList();
    }

    setSortByValue() {
        const storageValue = localStorage.getItem('sort-by');
        this.sortSelectElement.value = storageValue || todoService.sortBy;
    }
}

// create one-and-only instance
new TodoController().initialize();
