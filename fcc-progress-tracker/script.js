const TRACKER_URL = "https://raw.githubusercontent.com/tieudongta/my-portfolio-blog/main/fcc-progress-tracker/progress.json";
const STATUS_ORDER = ["Pending", "Ongoing", "Completed"];
//dummy data to be delete
let todoData = JSON.parse(localStorage.getItem("todoData")) || [];
let isEditing = false;
let editingIndex = null;
  
async function fetchProgress() {
  const res = await fetch(TRACKER_URL);
  return await res.json();
}

function updateStatus(item) {
  const currentIndex = STATUS_ORDER.indexOf(item.status);
  item.status = STATUS_ORDER[(currentIndex + 1) % STATUS_ORDER.length];
}

function renderProgress(data) {
  const container = document.getElementById("tracker");
  container.innerHTML = "";

  data.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>Estimated Time: ${item.days} days</p>
      <p class="status ${item.status}">${item.status}</p>
    `;

    card.addEventListener("click", () => {
      updateStatus(item);
      renderProgress(data);
      saveToLocal(data);
    });

    container.appendChild(card);
  });
  renderChart(data);
}

function saveToLocal(data) {
  localStorage.setItem("fccProgress", JSON.stringify(data));
}
function saveTodos() {
    localStorage.setItem("todoData", JSON.stringify(todoData));
  }
  
function loadFromLocal() {
  const saved = localStorage.getItem("fccProgress");
  return saved ? JSON.parse(saved) : null;
}

(async () => {
  const remoteData = await fetchProgress();
  const localData = loadFromLocal();

  const progress = localData || remoteData;
  renderProgress(progress);
})();
//Chart functions
//Toggle chart type
let currentChartType = "bar"; //Default

function renderChart(data){
    const ctx = document.getElementById("progressChart").getContext("2d");
    const counts = {
        "Pending": 0,
        "Ongoing": 0,
        "Completed": 0
    }
    data.forEach(item => counts[item.status]++);
    //Prepare stacked bar segments
    const statusColors = {
        "Pending": "lightgray",
        "Ongoing": "gold",
        "Completed": "lightgreen"
    };
    const chartData = {
        labels: ["Certification"],
        datasets: data.map((item, index) =>({
            label: item.title,
            data: [1], //Each item takes equal width
            backgroundColor: statusColors[item.status] || "gray"
        }))
    };
    //Clear previous chart if it exists
    if (window.fccChart) window.fccChart.destroy();

    window.fccChart = new Chart(ctx, {
        type: currentChartType,
        data:currentChartType ==="pie"?{
            labels: Object.keys(counts),
            datasets:[{
                label: "Certifications",
                data: Object.values(counts),
                backgroundColor:["lightgray", "gold", "lightgreen"]
            }]
        }: chartData,
        options:{
            responsive: true,
            indexAxis: "y", // 🔁 horizontal bar
            scales: currentChartType === "bar"?{
                x: {
                    stacked: true,
                    display: false
                    },
                    y: {
                    stacked: true,
                        ticks: {
                            display: false
                        }
                    }
            }:{},
            plugins:{
                legend:{
                    display: currentChartType === "pie"
                },
                title:{
                    display: true,
                    text: "Certification Progress"
                },
                tooltip:{
                    label: function(context){
                        return '${context.dataset.label} - 1 item ($(data[context.dataIndex].status))';
                    }
                }
            }
        }
    });
}

//Add Toggle Logic
document.getElementById("toggleChart").addEventListener("click", () => {
    currentChartType = currentChartType === "bar" ? "pie" : "bar";
    document.getElementById("toggleChart").textContent =
      currentChartType === "bar" ? "Switch to Pie" : "Switch to Bar";
  
    const progressData = loadFromLocal(); // or re-fetch if needed
    renderChart(progressData);
  });
  //Todo list
  function renderTodos(filter = "All"){
    
    const list = document.getElementById("todo-list");
    list.innerHTML = ""; // Clear previous list
    //Filter tasks if needed
    const filteredTodos = filter === "All"
        ? todoData
        : todoData.filter(todo => todo.category === filter);
    
    filteredTodos.forEach((todo, index) =>{
        const li = document.createElement("li");

        li.className = `todo-item ${todo.status ? "completed" : ""}`;
        const dueDate = new Date(todo.due);
        const today = new Date();
        today.setHours(0,0,0,0); //normalize to midnight
        let dueClass = "";
        if (dueDate <today) {
            dueClass = "overdue";
        }else if(dueDate.getTime() === today.getTime()){
            dueClass = "due-today";
        }else{
            dueClass = "upcomming";
        }
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        saveTodoData();          // Save to localStorage
        updateTodoList();        // Re-render UI
        updateCategoryStatus();  // Update certification progress
        });
        li.appendChild(checkbox);
        li.innerHTML = `
            <div class="todo-category"><strong>${todo.category}</strong></div>
            <div class="todo-text">${todo.text}</div>
            <div class="todo-due ${dueClass}">Due: ${todo.due}</div>
            <div class="todo-actions">
                <input type="checkbox" onchange="updateStatus(this, ${index})">
                <button class="edit-btn" data-index="${index}">✏️ Edit</button>
                <button class="delete-btn" data-index="${index}">🗑 Delete</button>
            </div>
        `;
        list.appendChild(li);
    })
  }
  function updateStatus(checkbox, taskIndex) {
    //const taskIndex = checkbox.dataset.index; // if you store index
    todoData[taskIndex].completed = checkbox.checked;
    console.log(todoData[taskIndex]);
    console.log(todoData);
    saveTodos();
    renderTodos();
    updateCategoryStatus();
  }
  
  function populateCategoryDropdowns() {
    const cards = loadFromLocal();
    const categories = new Set();
    cards.forEach(card => {
      categories.add(card.title);
    });
    const filterDropdown = document.getElementById("category-filter");
    const taskDropdown = document.getElementById("task-category");
  
    if (!filterDropdown || !taskDropdown) return;
  
    // Reset dropdowns
    filterDropdown.innerHTML = '<option value="All">All</option>';
    taskDropdown.innerHTML = '';
  
    categories.forEach(cat => {
      const option1 = document.createElement("option");
      option1.value = cat;
      option1.textContent = cat;
      filterDropdown.appendChild(option1);
  
      const option2 = document.createElement("option");
      option2.value = cat;
      option2.textContent = cat;
      taskDropdown.appendChild(option2);
    });
  }
  
  //function update certification status
  function updateCategoryStatus() {
    const cards = document.querySelectorAll('#tracker .card');
  
    cards.forEach(card => {
      const category = card.querySelector('h3').innerText;
      const statusEl = card.querySelector('.status');
  
      const tasksInCategory = todoData.filter(task => task.category === category);
  
      if (tasksInCategory.length === 0) {
        statusEl.textContent = "Pending";
        statusEl.className = "status Pending";
      } else if (tasksInCategory.every(task => task.completed)) {
        statusEl.textContent = "Completed";
        statusEl.className = "status Completed";
      } else {
        statusEl.textContent = "Ongoing";
        statusEl.className = "status Ongoing";
      }
    });
  }
  
  //Hookup the Filter Behavior
  document.getElementById("category-filter").addEventListener("change", e => {
    renderTodos(e.target.value);
  });
  //task creation
  document.getElementById("add-task-btn").addEventListener("click", () => {
    const category = document.getElementById("task-category").value;
    const text = document.getElementById("task-text").value;
    let due = document.getElementById("task-due").value;
  
    if (!category || !text) {
      alert("Please fill in all fields.");
      return;
    }
    if(!due){
        due = new Date().toISOString().split('T')[0]; 
    }
    if (isEditing) {
        // Update existing task
        todoData[editingIndex] = {
          ...todoData[editingIndex],
          text,
          due
        };
        isEditing = false;
        editingIndex = null;
        document.getElementById("toggle-form").style.display = "block";
        const formGroups = document.querySelectorAll("#todo-form .form-group");
        formGroups.forEach(group => {
          group.style.display = "none";
        });
        document.getElementById("add-task-btn").textContent = "Add Task";
      } else {
        // Add new task
        todoData.push({
          category,
          text,
          due,
          completed: false
        });
    }
    saveTodos();
    renderTodos();
    // Clear inputs
    document.getElementById("task-text").value = "";
    document.getElementById("task-due").value = "";
    updateCategoryStatus();
    //populateCategoryDropdowns();
    //renderTodos(document.getElementById("category-filter").value);
  });
  //toggle form visibility
  document.getElementById("toggle-form").addEventListener("click", (e) => {
    const formGroups = document.querySelectorAll("#todo-form .form-group");
    formGroups.forEach(group => {
      group.style.display = (group.style.display === "none") ? "block" : "none";
    });
  });

  //call it on page load
  window.addEventListener("DOMContentLoaded", function () {
    populateCategoryDropdowns();
    renderTodos();
  });

    //Delete task and Edit 
    document.getElementById("todo-list").addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
      
        if (e.target.classList.contains("delete-btn")) {
          todoData.splice(index, 1);
          updateCategoryStatus();
          saveTodos();
          renderTodos();
        }
      
        if (e.target.classList.contains("edit-btn")) {
            const task = todoData[index];
          showTaskForm();
            document.getElementById("task-category").value = task.category;
            document.getElementById("task-text").value = task.text;
            document.getElementById("task-due").value = task.due;
          
            isEditing = true;
            editingIndex = index;
            //hide the #toggle-form
            document.getElementById("toggle-form").style.display = "none";
            const addBtn = document.getElementById("add-task-btn");
            addBtn.textContent = "Update Task";
            //Focus the text box
            document.getElementById("task-text").focus();
          }
          
      });
// show task form
function showTaskForm() {
    document.querySelectorAll('.form-group').forEach(el => {
      el.style.display = "block"; // Override inline display: none
    });
    document.getElementById('add-task-btn').style.display = "inline-block";
  }