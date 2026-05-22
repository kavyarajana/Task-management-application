let currentUser = localStorage.getItem('currentUser');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Check if logged in
if (currentUser) {
  showTaskPage();
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username && password) {
    localStorage.setItem('currentUser', username);
    currentUser = username;
    showTaskPage();
  } else {
    alert('Please enter username and password');
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  document.getElementById('loginPage').style.display = 'block';
  document.getElementById('taskPage').style.display = 'none';
}

function showTaskPage() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('taskPage').style.display = 'block';
  document.getElementById('userDisplay').textContent = currentUser;
  renderTasks();
}

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();
  
  if (taskText) {
    const task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      user: currentUser
    };
    tasks.push(task);
    saveTasks();
    taskInput.value = '';
    renderTasks();
  }
}

function toggleComplete(id) {
  tasks = tasks.map(task => 
    task.id === id ? {...task, completed: !task.completed} : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  if (confirm('Delete this task?')) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt('Edit task:', task.text);
  if (newText && newText.trim()) {
    tasks = tasks.map(t => 
      t.id === id ? {...t, text: newText.trim()} : t
    );
    saveTasks();
    renderTasks();
  }
}

function filterTasks(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn =>
    btn.classList.remove('active'));
  event.target.classList.add('active');
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  const userTasks = tasks.filter(task => task.user === currentUser);
  
  let filteredTasks = userTasks;
  if (currentFilter === 'pending') {
    filteredTasks = userTasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = userTasks.filter(task => task.completed);
  }
  
  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p style="text-align:center;color:#666;">No tasks found</p>';
    return;
  }
  
  taskList.innerHTML = filteredTasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}">
      <input type="checkbox" ${task.completed ? 'checked' : ''} 
             onchange="toggleComplete(${task.id})">
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Enter key to add task
document.getElementById('taskInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});