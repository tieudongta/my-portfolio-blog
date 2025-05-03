const TRACKER_URL = "https://raw.githubusercontent.com/tieudongta/my-portfolio-blog/main/fcc-progress-tracker/progress.json";
const STATUS_ORDER = ["Pending", "Ongoing", "Completed"];

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
    //Clear previous chart if it exists
    if (window.fccChart) window.fccChart.destroy();

    window.fccChart = new Chart(ctx, {
        type: currentChartType,
        data:{
            labels: Object.keys(counts),
            datasets:[{
                label: "Certifications",
                data: Object.values(counts),
                backgroundColor:["lightgray", "gold", "lightgreen"]
            }]
        },
        options:{
            responsive: true,
            scales: currentChartType === "bar"?{
                y:{
                    beginAtZero: true,
                    ticks:{precision: 0}
                }
            }:{},
            plugins:{
                legend:{
                    display: currentChartType === "pie"
                },
                title:{
                    display: true,
                    text: "Certification Progress"
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
  