document.addEventListener("DOMContentLoaded", function() {
  // Use a common ancestor that is always present on the page
  document.body.addEventListener("click", function(event) {
    let target = event.target;

    // Check if the clicked element is the button with the id "btn"
    if (target && target.id === "btn") {
      toggleSidebar();
    }
  });

  function toggleSidebar() {
    let sidebar = document.querySelector(".sidebar");

    if (sidebar) {
      sidebar.classList.toggle("open");
      menuBtnChange(); // calling the function (optional)
    }
  }

  function menuBtnChange() {
    let closeBtn = document.querySelector("#btn");

    if (closeBtn) {
      if (closeBtn.classList.contains("bx-menu")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
      } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
      }
    }
  }
});