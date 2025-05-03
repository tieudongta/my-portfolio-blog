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
        type: "pie",
        data:{
            labels: Object.keys(counts),
            datasets:[{
                data: Object.values(counts),
                backgroundColor:["lightgray", "gold", "lightgreen"]
            }]
        },
        options:{
            responsive: true,
            plugins:{
                legend:{
                    position: "bottom"
                },
                title:{
                    display: true,
                    text: "Certification Progress"
                }
            }
        }
    });
}