const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('mouseover', function() {
        this.querySelector('a').style.textDecoration = 'underline';
    });
    item.addEventListener('mouseout', function() {
        this.querySelector('a').style.textDecoration = 'none';
    });
});