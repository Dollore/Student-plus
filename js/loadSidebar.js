// Function to load HTML content using async/await
async function loadHTML(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error loading HTML:', error);
    return null;
  }
}

// Function to load and display HTML content
async function loadAndDisplayHTML() {
  const html1 = await loadHTML('../html/sidebar.html');

  if (html1) {
    document.getElementById('sidebarId').innerHTML = html1;

    // You can load more HTML files here if needed
    // const html2 = await loadHTML('file2.html');
    // if (html2) {
    //   // Handle the second HTML file
    // }
  }
}

// Call the function to load and display HTML content
loadAndDisplayHTML();