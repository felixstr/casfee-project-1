document.addEventListener('DOMContentLoaded', function () {
    console.log(document.querySelector('.textfield input[type=date]'));

    const dateElements = document.querySelectorAll(
        '.textfield input[type=date]'
    );
    dateElements.forEach((item, i) => {
        item.type = 'text';
        item.onfocus = () => {
            item.type = 'date';
        };
        item.onblur = () => {
            if (item.value === '') {
                item.type = 'text';
            } else {
                item.type = 'date';
            }
        };
    });
});
