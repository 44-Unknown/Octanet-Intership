document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const resetAllBtn = document.getElementById('resetAllBtn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let timers = [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                ${task.text}
                <span class="timer">${task.timer || '00:00'}</span>
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button class="delete" onclick="deleteTask(${index})">Delete</button>
                <button class="complete" onclick="toggleTask(${index})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="start-timer" onclick="startTimer(${index})">Start Timer</button>
            `;
            taskList.appendChild(li);
        });
    };

    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false, timer: '00:00' });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    };

    window.editTask = (index) => {
        const newText = prompt('Edit task:', tasks[index].text);
        if (newText) {
            tasks[index].text = newText;
            saveTasks();
            renderTasks();
        }
    };

    window.deleteTask = (index) => {
        if (timers[index]) {
            clearInterval(timers[index]);
        }
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    window.toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        if (tasks[index].completed) {
            clearInterval(timers[index]);
            tasks[index].timer = '00:00';
        }
        saveTasks();
        renderTasks();
    };

    window.startTimer = (index) => {
        if (timers[index]) {
            clearInterval(timers[index]);
        }
        let seconds = 0;
        timers[index] = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            tasks[index].timer = `${minutes}:${secs}`;
            saveTasks();
            renderTasks();
        }, 1000);
    };

    const resetAllTasks = () => {
        tasks = [];
        saveTasks();
        renderTasks();
    };

    addTaskBtn.addEventListener('click', addTask);
    resetAllBtn.addEventListener('click', resetAllTasks);

    renderTasks();
});
