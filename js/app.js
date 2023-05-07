'use strict';

document.addEventListener('DOMContentLoaded', function () {
    // datefield helper
    const dateElements = document.querySelectorAll(
        '.textfield input[type=date]'
    );
    dateElements.forEach((item) => {
        item.type = 'text';
        item.onfocus = () => (item.type = 'date');
        item.onblur = () =>
            item.value === '' ? (item.type = 'text') : (item.type = 'date');
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
});
