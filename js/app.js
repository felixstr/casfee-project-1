'use strict';

document.addEventListener('DOMContentLoaded', function () {
    console.log(document.querySelector('.textfield input[type=date]'));

    const dateElements = document.querySelectorAll(
        '.textfield input[type=date]'
    );
    dateElements.forEach((item) => {
        item.type = 'text';
        item.onfocus = () => (item.type = 'date');
        item.onblur = () =>
            item.value === '' ? (item.type = 'text') : (item.type = 'date');
    });
});
