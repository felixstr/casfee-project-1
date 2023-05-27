class UiController {
    constructor() {
        this.changeFormTypeWhileFocus();
        this.initModeToggle();
    }

    changeFormTypeWhileFocus() {
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
    }

    initModeToggle() {
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
    }
}

new UiController();
