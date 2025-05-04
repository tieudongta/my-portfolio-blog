const TRACKER_URL = "https://raw.githubusercontent.com/tieudongta/my-portfolio-blog/main/fcc-progress-tracker/progress.json";
const STATUS_ORDER = ["Pending", "Ongoing", "Completed"];
//dummy data to be delete
let todoData = [
    {
      category: "Personal Portfolio Website",
      text: "Build About section",
      due: "2025-05-03",
      completed: false
    },
    {
      category: "Product Landing Page",
      text: "Create hero layout",
      due: "2025-05-04",
      completed: true
    }
  ];
  
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
    const sampleTodos = [
        { category: "Personal Portfolio", text: "Build About section", due: "2025-05-03", status: false },
        { category: "Product landing", text: "Create hero layout", due: "2025-05-04", status: true }
    ];
    filteredTodos.forEach(todo =>{
        const li = document.createElement("li");

        li.className = `todo-item ${todo.status ? "completed" : ""}`;
        li.innerHTML = `
            <div class="todo-category"><strong>${todo.category}</strong></div>
            <div class="todo-text">${todo.text}</div>
            <div class="todu-due">Due: ${todo.due}</div>
        `;
        list.appendChild(li);
    })
  }
  function populateCategoryDropdowns() {
    const cards = document.querySelectorAll("#tracker .card h3");
    const categories = new Set();
    console.log(cards);
    cards.forEach(card => {
      categories.add(card.textContent.trim());
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
  
  
  //Hookup the Filter Behavior
  document.getElementById("category-filter").addEventListener("change", e => {
    renderTodos(e.target.value);
  });
  //task creation
  document.getElementById("add-task-btn").addEventListener("click", () => {
    const category = document.getElementById("task-category").value;
    const text = document.getElementById("task-text").value;
    const due = document.getElementById("task-due").value;
  
    if (!category || !text || !due) {
      alert("Please fill in all fields.");
      return;
    }
  
    todoData.push({
      category,
      text,
      due,
      completed: false
    });
  
    // Clear inputs
    document.getElementById("task-text").value = "";
    document.getElementById("task-due").value = "";
  
    populateCategoryDropdowns();
    renderTodos(document.getElementById("category-filter").value);
  });
  
  //call it on page load
  window.addEventListener("DOMContentLoaded", function () {
    populateCategoryDropdowns();
    renderTodos();
  });