import { todoService } from '../services/todo-service.js';

// TODO: use constants for SELECTORS
export default class DialogController {
    constructor(todoController) {
        this.todoController = todoController;

        this.modalFormElement = document.querySelector('.js-modal-form');
        this.buttonCancelElement = document.querySelector('.js-button-cancel');
        this.formElement = document.querySelector('.js-form');

        this.titleFieldElement = this.formElement.querySelector('[name="title"]');
        this.descriptionFieldElement = this.formElement.querySelector('[name="description"]');
        this.duedateFieldElement = this.formElement.querySelector('[name="duedate"]');
        this.priorityFieldElement = this.formElement.querySelector('[name="priority"]');
        this.idFieldElement = this.formElement.querySelector('[name="id"]');

        this.initEventHandlers();
    }

    initEventHandlers() {
        this.buttonCancelElement.addEventListener('click', () => {
            this.closeDialog();
        });

        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const formDataObj = Object.fromEntries(formData.entries());
            // console.log('formDataObj', formDataObj);

            if (formDataObj.id) {
                // console.log('id', formDataObj.id);

                todoService.updateTodo(formDataObj, () => {
                    // console.log('todo updated and list updated', updatedTodo);
                    this.todoController.renderTodoList();
                    this.closeDialog();
                });
            } else {
                todoService.addTodo(formDataObj, () => {
                    // console.log('todo added and list updated', addedTodo);
                    this.todoController.renderTodoList();
                    this.closeDialog();
                });
            }
        });
    }

    openDialog(todo) {
        // console.log('openDialog', todo);
        if (todo && todo.id >= 0) {
            this.idFieldElement.value = todo.id;
            this.titleFieldElement.value = todo.title;
            this.descriptionFieldElement.innerText = todo.description;
            this.duedateFieldElement.value = todo.duedate;
            this.priorityFieldElement.value = todo.priority;
        }

        this.modalFormElement.showModal();
    }

    closeDialog() {
        this.formElement.reset();
        this.descriptionFieldElement.innerText = ''; // TODO: textfield is not reset with .reset() ??

        this.modalFormElement.addEventListener('animationend', closeDialogAfter);
        this.modalFormElement.classList.add('close');

        function closeDialogAfter(event) {
            event.target.close();
            event.target.classList.remove('close');
            event.target.removeEventListener('animationend', closeDialogAfter);
        }
    }
}
