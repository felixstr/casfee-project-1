import DialogController from './dialog-controller.js';
import { todoService } from '../services/todo-service.js';
import { settingsStorage } from '../services/settings-storage.js';

const SELECTOR_LIST = '.js-list';
const SELECTOR_SORT_BUTTONS = '.js-sort-buttons';
const SELECTOR_BUTTON_NEW = '.js-button-new';
const SELECTOR_TOGGLE_COMPLETED = '.js-toggle-completed';
const MODIFIER_LIST_COMPLETED = 'todo-list--show-completed';
const MODIFIER_BUTTON_CURRENT = 'button--current';
const MODIFIER_DUEDATE_WARNING = 'todo-item__due-date--warning';

class TodoController {
    constructor() {
        this.listElement = document.querySelector(SELECTOR_LIST);
        this.sortButtonsElement = document.querySelector(SELECTOR_SORT_BUTTONS);
        this.buttonNewlement = document.querySelector(SELECTOR_BUTTON_NEW);
        this.toggleCompletedElement = document.querySelector(SELECTOR_TOGGLE_COMPLETED);

        this.dialogController = new DialogController();
    }

    async initialize() {
        // get data
        await todoService.loadData();

        // get completed state from local storage
        this.initCompletedToggleState();

        // update sort element states
        this.updateSortButtons();

        this.renderTodoList();
        this.initEventHandlers();
    }

    initEventHandlers() {
        // new button
        this.buttonNewlement.addEventListener('click', () => this.dialogController.openDialog());

        // on submit
        this.dialogController.onSubmit = (data) => {
            if (data.id) {
                todoService.updateTodo(data, () => {
                    this.renderTodoList();
                    this.dialogController.closeDialog();
                });
            } else {
                todoService.addTodo(data, () => {
                    this.renderTodoList();
                    this.dialogController.closeDialog();
                });
            }
        };

        // edit, delete, completed buttons
        this.listElement.addEventListener('click', (event) => {
            const id = event.target.closest('[data-id]').dataset.id;
            const todo = todoService.getById(id);

            if (event.target.matches('.js-edit')) {
                this.dialogController.openDialog(todo);
            } else if (event.target.matches('.js-delete')) {
                this.openDeleteConfirmDialog(todo);
            } else if (event.target.matches('.js-completed')) {
                this.toggleDone(todo);
            }
        });

        // sort buttons
        this.sortButtonsElement.addEventListener('click', (event) => {
            if (event.target.matches('[data-sort-by]')) {
                this.onClickSortButton(event.target);
            }
        });

        // completed toggle
        this.toggleCompletedElement.addEventListener('change', (event) => {
            this.listElement.classList.toggle(MODIFIER_LIST_COMPLETED, event.target.checked);
            settingsStorage.setItem('completed', event.target.checked);
        });
    }

    onClickSortButton(button) {
        const elementDataSet = button.dataset;
        const currentButton = button.classList.contains(MODIFIER_BUTTON_CURRENT);

        let sortDirection;
        if (elementDataSet.sortDirection && !currentButton) {
            sortDirection = elementDataSet.sortDirection;
        } else if (elementDataSet.sortDirection && currentButton) {
            sortDirection = elementDataSet.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortDirection = todoService.sortDirection;
        }

        elementDataSet.sortDirection = sortDirection;

        todoService.sortBy = elementDataSet.sortBy;
        todoService.sortDirection = sortDirection;
        todoService.sort();

        this.updateSortButtons();
        this.renderTodoList();

        settingsStorage.setItem('sort-by', elementDataSet.sortBy);
        settingsStorage.setItem('sort-direction', elementDataSet.sortDirection);
    }

    renderTodoList() {
        this.listElement.innerHTML =
            todoService.todos.map((todo) => this.renderItemTemplate(todo)).join('') ||
            `<div class="todo-list__empty">Noch keine Todos vorhanden</div>`;
    }

    renderItemTemplate(todo) {
        const prio = new Array(Number(todo.priority) + 1).join('!');
        let duedateOutput = '';
        let duedateModifier = '';

        if (todo.duedate) {
            const date = new Date(todo.duedate);
            const differenceInMs = date.getTime() - new Date();
            const differenceInDays = Math.ceil(differenceInMs / (1000 * 3600 * 24));

            if (Math.abs(differenceInDays) >= 7) {
                duedateOutput = date.toLocaleDateString();
            } else {
                const rtf = new Intl.RelativeTimeFormat('de', { style: 'long', numeric: 'auto' });
                duedateOutput = rtf.format(differenceInDays, 'day');
            }

            if (differenceInDays <= 0 && !todo.completed) {
                duedateModifier = MODIFIER_DUEDATE_WARNING;
            }
        }

        return `
            <div class="todo-item js-todo-item" data-id="${todo.id}" data-completed="${
            todo.completed
        }">
                <div class="todo-item__bullet ">
                    <button class="bullet ${
                        todo.completed ? 'bullet--completed' : ''
                    } js-completed"></button>
                </div>
                <div class="todo-item__content">
                    <div class="todo-item__description">
                        ${prio && `<div class="todo-item__prio">${prio}</div>`}
                        <div class="todo-item__title">${todo.title}</div>
                    </div>
                    ${todo.description && `<div class="todo-item__text">${todo.description}</div>`}
                    ${
                        duedateOutput &&
                        `<div class="todo-item__due-date ${duedateModifier}">${duedateOutput}</div>`
                    } 
                </div>
                <div class="todo-item__action">
                    <button class="button button--tiny js-edit">Edit</button>
                    <button class="button button--tiny js-delete">Delete</button>
                </div>
            </div>
        `;
    }

    async openDeleteConfirmDialog(todo) {
        if (window.confirm('Todo wirklich löschen?')) {
            await todoService.delete(todo);
            this.renderTodoList();
        }
    }

    toggleDone(todo) {
        todo.completed = !todo.completed;
        todoService.updateTodo(todo);
        this.renderTodoList();
    }

    updateSortButtons() {
        this.sortButtonsElement
            .querySelectorAll('button')
            .forEach((button) => button.classList.remove(MODIFIER_BUTTON_CURRENT));
        const currentSortButton = this.sortButtonsElement.querySelector(
            `[data-sort-by='${todoService.sortBy}']`
        );
        currentSortButton.classList.add(MODIFIER_BUTTON_CURRENT);
        currentSortButton.dataset.sortDirection = todoService.sortDirection;
    }

    initCompletedToggleState() {
        this.toggleCompletedElement.checked = settingsStorage.getItem('completed');

        this.listElement.classList.toggle(
            MODIFIER_LIST_COMPLETED,
            this.toggleCompletedElement.checked
        );
    }
}

// create one-and-only instance
new TodoController().initialize();
