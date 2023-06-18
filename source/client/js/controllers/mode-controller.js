import { settingsStorage } from '../services/settings-storage.js';
class ModeController {
    constructor() {
        this.initModeToggle();
    }

    initModeToggle() {
        const modeToggleElement = document.querySelector('.js-mode-toggle');
        const bodyElement = document.body;
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

new ModeController();
