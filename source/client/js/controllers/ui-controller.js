import { settingsStorage } from '../services/settings-storage.js';
class UiController {
    constructor() {
        this.changeSpecialInputTypeWhileFocus();
        this.initModeToggle();
    }

    changeSpecialInputTypeWhileFocus() {
        // to get the floating labels work with date and number fields, the type must be changed to text when not focused (date and number fields do not have a placolder, which is needed go get the floating label work with css)
        document
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

    initModeToggle() {
        const modeToggleElement = document.querySelector('.js-mode-toggle');
        const bodyElement = document.querySelector('body');
        let mode = settingsStorage.getItem('colormode') || 'lightmode';
        bodyElement.classList.add(mode);

        if (modeToggleElement) {
            modeToggleElement.checked = mode === 'darkmode';
            modeToggleElement.onchange = () => {
                bodyElement.classList.remove(mode);
                mode = mode === 'lightmode' ? 'darkmode' : 'lightmode';
                settingsStorage.setItem('colormode', mode);
                bodyElement.classList.add(mode);
            };
        }
    }
}

new UiController();
