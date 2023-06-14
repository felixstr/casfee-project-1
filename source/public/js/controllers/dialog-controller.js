const SELECTOR_DIALOG = '.js-dialog';
const SELECTOR_BUTTON_CANCEL = '.js-button-cancel';
const SELECTOR_FORM = '.js-form';
export default class DialogController {
    constructor() {
        this.dialogElement = document.querySelector(SELECTOR_DIALOG);
        this.buttonCancelElement = document.querySelector(SELECTOR_BUTTON_CANCEL);
        this.formElement = document.querySelector(SELECTOR_FORM);

        this.titleFieldElement = this.formElement.querySelector('[name="title"]');
        this.descriptionFieldElement = this.formElement.querySelector('[name="description"]');
        this.duedateFieldElement = this.formElement.querySelector('[name="duedate"]');
        this.priorityFieldElement = this.formElement.querySelector('[name="priority"]');
        this.idFieldElement = this.formElement.querySelector('[name="id"]');
        this.titleElement = this.formElement.querySelector('h2');

        this.onSubmit = () => console.error('onSubmit() function is not implemented');

        this.initEventHandlers();
    }

    initEventHandlers() {
        this.buttonCancelElement.addEventListener('click', () => this.closeDialog());
        this.dialogElement.addEventListener('cancel', (e) => {
            e.preventDefault();
            this.closeDialog();
        });

        this.formElement.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            const formDataObj = Object.fromEntries(formData.entries());

            this.onSubmit(formDataObj);
        });
    }

    openDialog(todo) {
        if (todo && todo.id) {
            this.idFieldElement.value = todo.id;
            this.titleFieldElement.value = todo.title;
            this.descriptionFieldElement.innerText = todo.description;
            this.duedateFieldElement.value = todo.duedate;
            this.priorityFieldElement.value = todo.priority;
            this.titleElement.innerText = 'Edit todo';
        } else {
            this.titleElement.innerText = 'Add todo';
        }

        this.duedateFieldElement.dispatchEvent(new Event('resetType'));
        this.priorityFieldElement.dispatchEvent(new Event('resetType'));

        this.dialogElement.showModal();
    }

    closeDialog() {
        this.formElement.reset(); // resets input[type=text], input[type=number], input[type=date]
        this.descriptionFieldElement.innerText = '';
        this.idFieldElement.value = '';

        this.duedateFieldElement.dispatchEvent(new Event('resetType'));
        this.priorityFieldElement.dispatchEvent(new Event('resetType'));

        this.dialogElement.addEventListener('animationend', closeDialogAfter);
        this.dialogElement.classList.add('close');

        function closeDialogAfter(event) {
            event.target.close();
            event.target.classList.remove('close');
            event.target.removeEventListener('animationend', closeDialogAfter);
        }
    }
}
