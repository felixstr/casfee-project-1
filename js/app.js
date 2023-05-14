'use strict';

// datefield helper
const dateElements = document.querySelectorAll(
    '.textfield input[type=date], .textfield input[type=number]'
);
dateElements.forEach((item) => {
    const originalType = item.type;
    item.type = 'text';
    item.onfocus = () => (item.type = originalType);
    item.onblur = () =>
        item.value === '' ? (item.type = 'text') : (item.type = originalType);
});

// mode toggle
const modeToggleElement = document.querySelector('.js-mode-toggle');
const bodyElement = document.querySelector('body');
let mode = localStorage.getItem('mode');
if (mode === null) {
    mode = 'lightmode';
    localStorage.setItem('mode', mode);
}
bodyElement.classList.add(mode);

if (modeToggleElement) {
    modeToggleElement.checked = mode === 'darkmode';
    modeToggleElement.onchange = () => {
        bodyElement.classList.remove(mode);
        mode = mode === 'lightmode' ? 'darkmode' : 'lightmode';
        localStorage.setItem('mode', mode);
        bodyElement.classList.add(mode);
    };
}

// form modal
const modalFormElement = document.querySelector('.js-modal-form');
const buttonNewlement = document.querySelector('.js-button-new');
const buttonCancelElement = document.querySelector('.js-button-cancel');
const formElement = document.querySelector('.js-form');

buttonNewlement.addEventListener('click', () => {
    modalFormElement.showModal();
});

buttonCancelElement.addEventListener('click', closeModal);

formElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);

    setTimeout(() => {
        closeModal();
        formElement.reset();
    }, 2000);
});

function closeModal() {
    modalFormElement.addEventListener('animationend', closeModalAfter);
    modalFormElement.classList.add('close');
}

function closeModalAfter() {
    modalFormElement.close();
    modalFormElement.classList.remove('close');
    modalFormElement.removeEventListener('animationend', closeModalAfter);
}
