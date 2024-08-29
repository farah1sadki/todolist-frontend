document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    // Fonction pour obtenir toutes les tâches
    function fetchTasks() {
        fetch('http://localhost:8080/api/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const taskElement = createTaskElement(task);
                    taskList.appendChild(taskElement);
                });
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Fonction pour créer un élément de tâche
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.textContent = `${task.title}: ${task.description}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            fetch(`http://localhost:8080/api/tasks/${task.id}`, {
                method: 'DELETE'
            })
            .then(() => {
                li.remove();
            })
            .catch(error => console.error('Error deleting task:', error));
        });

        li.appendChild(deleteButton);
        return li;
    }

    // Ajouter une nouvelle tâche
    addTaskButton.addEventListener('click', () => {
        const taskTitle = taskInput.value.trim();
        const taskDescription = prompt('Enter task description:').trim();

        if (taskTitle !== '' && taskDescription !== '') {
            fetch('http://localhost:9090/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: taskTitle, description: taskDescription })
            })
            .then(response => response.json())
            .then(task => {
                const taskElement = createTaskElement(task);
                taskList.appendChild(taskElement);
                taskInput.value = ''; // Clear the input field
            })
            .catch(error => console.error('Error creating task:', error));
        }
    });

    // Initial fetch of tasks
    fetchTasks();

    // Allow pressing Enter to add tasks
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTaskButton.click();
        }
    });
});
