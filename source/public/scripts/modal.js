import todoController from './todoController.js';

const modalFormElement = document.querySelector('.js-modal-form');
const buttonNewlement = document.querySelector('.js-button-new');
const buttonCancelElement = document.querySelector('.js-button-cancel');
const formElement = document.querySelector('.js-form');
const titleFieldElement = formElement.querySelector('[name="title"]');
const descriptionFieldElement = formElement.querySelector(
    '[name="description"]'
);
const duedateFieldElement = formElement.querySelector('[name="duedate"]');
const priorityFieldElement = formElement.querySelector('[name="priority"]');
const idFieldElement = formElement.querySelector('[name="id"]');

function init() {
    addEventListeners();
}

function addEventListeners() {
    buttonNewlement.addEventListener('click', () => openModal());
    buttonCancelElement.addEventListener('click', closeModal);

    formElement.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const formDataObj = Object.fromEntries(formData.entries());
        // console.log('formDataObj', formDataObj);

        if (formDataObj.id) {
            todoController.updateTodo(formDataObj, (updatedTodo) => {
                console.log('todo updated and list updated', updatedTodo);
                closeModal();
            });
        } else {
            todoController.addTodo(formDataObj, (addedTodo) => {
                console.log('todo added and list updated', addedTodo);
                closeModal();
            });
        }
    });
}

function closeModal() {
    formElement.reset();
    descriptionFieldElement.innerText = '';

    modalFormElement.addEventListener('animationend', closeModalAfter);
    modalFormElement.classList.add('close');
}

function closeModalAfter() {
    modalFormElement.close();
    modalFormElement.classList.remove('close');
    modalFormElement.removeEventListener('animationend', closeModalAfter);
}

function openModal(object) {
    console.log('object', object);
    if (object && object.id) {
        idFieldElement.value = object.id;
        titleFieldElement.value = object.title;
        descriptionFieldElement.innerText = object.description;
        duedateFieldElement.value = object.duedate;
        priorityFieldElement.value = object.priority;
    }

    modalFormElement.showModal();
}

export { init, openModal };
