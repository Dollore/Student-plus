const colorButton = document.querySelector('.color-button');
let isLightMode = true;

colorButton.addEventListener('click', function () {
    if (isLightMode) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    }
    isLightMode = !isLightMode;
});
