const colorButton = document.querySelector('.color-button');
let isLightMode = true;

const savedMode = localStorage.getItem('colorMode');
if (savedMode) {
    isLightMode = savedMode === 'light';
    updateColorMode();
}

colorButton.addEventListener('click', function () {
    isLightMode = !isLightMode;
    updateColorMode();

    // Zapisywanie preferencji użytkownika w local storage
    localStorage.setItem('colorMode', isLightMode ? 'light' : 'dark');
});

function updateColorMode() {
    if (isLightMode) {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
    }
}
