import { isIosDevice } from '../helpers/isIosDevice.js';

const SELECTOR_DIALOG = 'js-dialog';
const SELECTOR_BUTTON_CANCEL = 'js-button-cancel';
const SELECTOR_FORM = 'js-form';
export default class DialogController {
    constructor() {
        this.render();
        this.dialogElement = document.querySelector('.' + SELECTOR_DIALOG);
        this.buttonCancelElement = this.dialogElement.querySelector('.' + SELECTOR_BUTTON_CANCEL);
        this.formElement = this.dialogElement.querySelector('.' + SELECTOR_FORM);
        this.titleElement = this.dialogElement.querySelector('h2');
        this.changeSpecialInputTypeWhileFocus();

        this.titleFieldElement = this.formElement.querySelector('[name="title"]');
        this.descriptionFieldElement = this.formElement.querySelector('[name="description"]');
        this.duedateFieldElement = this.formElement.querySelector('[name="duedate"]');
        this.priorityFieldElement = this.formElement.querySelector('[name="priority"]');
        this.idFieldElement = this.formElement.querySelector('[name="id"]');

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
            this.duedateFieldElement.removeAttribute('min');
        } else {
            this.titleElement.innerText = 'Add todo';
            this.duedateFieldElement.setAttribute('min', new Date().toJSON().substring(0, 10));
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

    render() {
        document.body.insertAdjacentHTML(
            'beforeend',
            `<dialog class="modal ${SELECTOR_DIALOG}">
                <div class="l-wrapper">
                    <h2>Edit Todo</h2>
                    <form class="${SELECTOR_FORM}">
                        <input type="hidden" name="id" />
                        <div class="l-form">
                            <div class="textfield">
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value=""
                                    placeholder="hidden"
                                    required
                                />
                                <label for="title">Title</label>
                            </div>

                            <div class="textfield">
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="hidden"
                                ></textarea>
                                <label for="description">Description</label>
                            </div>

                            <div class="l-form__row">
                                <div class="textfield">
                                    <input
                                        id="duedate"
                                        type="date"
                                        name="duedate"
                                        value=""
                                        placeholder="hidden"
                                    />
                                    <label for="duedate">Due date</label>
                                </div>

                                <div class="textfield">
                                    <input
                                        id="prio"
                                        type="number"
                                        name="priority"
                                        value=""
                                        placeholder="hidden"
                                        min="1"
                                        max="5"
                                    />
                                    <label for="prio">Priority</label>
                                </div>
                            </div>
                        </div>

                        <div class="l-button-row">
                            <button type="button" class="button ${SELECTOR_BUTTON_CANCEL}">Cancel</button>
                            <button type="submit" class="button button--primary">Save</button>
                        </div>
                    </form>
                </div>
            </dialog>`
        );
    }

    changeSpecialInputTypeWhileFocus() {
        // to get the floating labels work with date and number fields, the type must be changed to text when not focused (date and number fields do not have a placeholder, which is needed go get the floating label work with css)
        // on iOS devices, changing the input type breaks the date selection functionality
        if (!isIosDevice) {
            this.formElement
                .querySelectorAll('.textfield input[type=date], .textfield input[type=number]')
                .forEach((item) => {
                    const originalType = item.type;
                    item.type = 'text';
                    const fnResetType = () => {
                        item.value === '' ? (item.type = 'text') : (item.type = originalType);
                    };
                    item.addEventListener('focus', () => (item.type = originalType));
                    item.addEventListener('blur', fnResetType);
                    item.addEventListener('resetType', fnResetType);
                });
        }
    }
}
