const addButton = document.querySelector('.list-add');
const taskMain = document.querySelector('.task-main');


addButton.addEventListener('click', function() {

  const newList = document.createElement('div');
  newList.className = 'task-list';

  // Tworzymy zawartość nowej listy zadań
  newList.innerHTML = `
    <div class="list-header">
      <h1>Nowa lista</h1>
      <button>ADD</button>
    </div>
    <ul>
      <li>Zadanie 1</li>
      <li>Zadanie 2</li>
      <li>Zadanie 3</li>
      <button class="delete-list">delete<button>
    </ul>
  `;


  taskMain.appendChild(newList);
});

