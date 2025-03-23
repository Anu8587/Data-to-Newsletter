function showFinanceSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.finance-section').forEach(section => {
      section.style.display = 'none';
  });

  // Show the selected section
  document.getElementById(sectionId).style.display = 'block';

  // Update active class on sidebar
  document.querySelectorAll('.sidebar-menu li').forEach(li => {
      li.classList.remove('active');
  });

  // Highlight the active menu item
  document.querySelector(`li[onclick="showFinanceSection('${sectionId}')"]`).classList.add('active');
}


function toggleSidebar() {
  let sidebar = document.querySelector('.finance-sidebar');
  if (sidebar.style.width === '200px') {
      sidebar.style.width = '60px';
  } else {
      sidebar.style.width = '200px';
  }
}


const stockSymbols = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT"];

// Initialize chart
var options = {
    chart: { type: 'line', height: 350 },
    series: stockSymbols.map(symbol => ({ name: symbol, data: [] })), 
    xaxis: {
      type: 'datetime',
      labels: {
          formatter: function (val) {
              let localTime = new Date(val).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
              return localTime;  // Convert to IST
          }
      }
  }
  
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

// Store last known prices
let stockPrices = {};

// Function to fetch stock prices and introduce dynamic volatility
async function fetchStockPrices() {
    try {
        let promises = stockSymbols.map(async (symbol) => {
            let response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=cvffi7pr01qtu9s4hru0cvffi7pr01qtu9s4hrug`);
            let data = await response.json();

            if (data.c) {
                let timeNow = new Date().getTime();
                let basePrice = data.c;

                // If first time fetching, set initial price
                if (!stockPrices[symbol]) {
                    stockPrices[symbol] = basePrice;
                }

                // Simulate volatility (±2% fluctuation per update)
                let volatility = (Math.random() * 4 - 2) / 100;
                let newPrice = stockPrices[symbol] * (1 + volatility);
                stockPrices[symbol] = newPrice; // Save new price for next iteration

                return { symbol, timeNow, newPrice };
            }
        });

        let results = await Promise.all(promises);

        // Update chart dynamically
        chart.updateSeries(
            results.map(result => ({
                name: result.symbol,
                data: [...(chart.w.config.series.find(s => s.name === result.symbol)?.data || []), [result.timeNow, result.newPrice]]
            }))
        );

    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}

// Update every 3 seconds
setInterval(fetchStockPrices, 300); // change for 3 seconds 300
fetchStockPrices();


document.addEventListener("DOMContentLoaded", function () {
  const stockList = [
      { symbol: "AAPL", name: "Apple", price: "$178.55", change: "+1.2%" },
      { symbol: "GOOGL", name: "Google", price: "$2750.30", change: "-0.5%" },
      { symbol: "MSFT", name: "Microsoft", price: "$325.18", change: "+2.1%" },
      { symbol: "TSLA", name: "Tesla", price: "$725.50", change: "-1.8%" },
      { symbol: "AMZN", name: "Amazon", price: "$3450.90", change: "+0.8%" },
      { symbol: "NFLX", name: "Netflix", price: "$595.42", change: "-0.7%" },
      { symbol: "NVDA", name: "NVIDIA", price: "$500.25", change: "+3.4%" },
      { symbol: "FB", name: "Meta (Facebook)", price: "$332.10", change: "-0.2%" },
      { symbol: "INTC", name: "Intel", price: "$55.60", change: "+1.1%" },
      { symbol: "AMD", name: "AMD", price: "$98.75", change: "-2.0%" }
  ];

  const stockContainer = document.getElementById("stock-list");
  const selectedStocksContainer = document.getElementById("selected-stocks");
  const updateButton = document.getElementById("update-chart");

  // Clear and populate the stock selection list
  stockContainer.innerHTML = "";
  stockList.forEach(stock => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
          <input type="checkbox" value="${stock.symbol}" data-name="${stock.name}" 
                 data-price="${stock.price}" data-change="${stock.change}" checked> 
          ${stock.name}
      `;
      stockContainer.appendChild(listItem);
  });

  // Function to get selected stocks and display their information
  function updateSelectedStocksDisplay() {
      selectedStocksContainer.innerHTML = ""; // Clear previous list

      document.querySelectorAll("#stock-list input:checked").forEach(input => {
          const stockInfo = document.createElement("div");
          stockInfo.classList.add("stock-info");
          stockInfo.innerHTML = `
              <strong>${input.dataset.name}</strong> (${input.value}) <br>
              Price: ${input.dataset.price} | Change: ${input.dataset.change}
          `;
          selectedStocksContainer.appendChild(stockInfo);
      });
  }

  // Listen for checkbox changes
  stockContainer.addEventListener("change", updateSelectedStocksDisplay);

  // Initial display of selected stocks
  updateSelectedStocksDisplay();

  // Update the chart when the button is clicked
  updateButton.addEventListener("click", function () {
      let selectedStocks = [];
      document.querySelectorAll("#stock-list input:checked").forEach(input => {
          selectedStocks.push(input.value);
      });

      if (selectedStocks.length === 0) {
          alert("Please select at least one stock.");
          return;
      }

      updateChartWithSelectedStocks(selectedStocks);
  });
});

// Function to update the chart with selected stocks
function updateChartWithSelectedStocks(selectedStocks) {
  console.log("Updating chart with stocks:", selectedStocks);
  // Here you need to integrate your existing chart update logic
}
function showSection(sectionId) {
  document.querySelectorAll('.analysis-section').forEach(section => {
      section.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';
}
document.addEventListener("DOMContentLoaded", function() {
  showFinanceSection('finance-overview'); // Ensure "User Overview" is shown first
});
