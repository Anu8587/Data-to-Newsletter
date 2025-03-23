document.addEventListener("DOMContentLoaded", function () {
  let buttons = document.querySelectorAll(".sidebar button");
  let sections = document.querySelectorAll(".content-section");

  buttons.forEach(button => {
      button.addEventListener("click", function () {
          buttons.forEach(btn => btn.classList.remove("active"));
          this.classList.add("active");

          sections.forEach(section => {
              section.classList.remove("active");
              section.style.display = "none";  
          });

          let sectionId = this.getAttribute("onclick").replace("showContent('", "").replace("')", "");
          let selectedSection = document.getElementById(sectionId);
          selectedSection.style.display = "block";

         
          setTimeout(() => selectedSection.classList.add("active"), 50);
      });
  });
  let firstSection = document.getElementById("market-trends");
  if (firstSection) {
      firstSection.style.display = "block";
      firstSection.classList.add("active");
  }
});










async function fetchMarketNews() {
  const API_KEY = "19cdb3b211724ae2a1cd9147bf00ab2b"; 
  const response = await fetch(`https://newsapi.org/v2/everything?q=stock market&language=en&sortBy=publishedAt&apiKey=${API_KEY}`);
  const data = await response.json();

  if (!data.articles || data.articles.length === 0) {
      console.error("No news articles found.");
      return [];
  }

  return data.articles.slice(0, 10);  
}

async function updateNewsSection() {
  let news = await fetchMarketNews();
  let newsHTML = "";

  news.forEach(article => {
      newsHTML += `
          <div class="news-item">
              <h3>${article.title}</h3>
              <p>${article.description || "No description available."}</p>
              <a href="${article.url}" target="_blank">Read More</a>
              <hr>
          </div>
      `;
  });

  document.getElementById("market-news").innerHTML = newsHTML;
}

setInterval(updateNewsSection, 1800000);
updateNewsSection();








async function fetchMultipleStockData() {
  const selectedSymbols = Array.from(document.getElementById('stock-symbols').selectedOptions)
    .map(option => option.value); 
  
 
  document.getElementById('market-trends-content').innerHTML = '';

  
  for (const symbol of selectedSymbols) {
    await fetchStockData(symbol, '2025-01-04', '2025-02-04');
  }
}


async function fetchStockData(symbol, fromDate, toDate) {
  const apiKey = 'UEF8Eg6V7VhFTRfy1yaTaWnZQuM4ERxH';  // API
  const url = `https://financialmodelingprep.com/stable/historical-price-eod/full?symbol=${symbol}&from=${fromDate}&to=${toDate}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      visualizeStockData(symbol, data);
    } else {
      const errorMessage = await response.text();
      console.error('Error response from API:', errorMessage);
      document.getElementById('market-trends-content').textContent = `Error fetching market data for ${symbol}: ${errorMessage}`;
    }
  } catch (error) {
    console.error('Network Error:', error);
    document.getElementById('market-trends-content').textContent = `Network Error: Could not fetch data for ${symbol}.`;
  }
}

// Chart.js
function visualizeStockData(symbol, data) {
  const marketTrendsContent = document.getElementById('market-trends-content');
  
  
  const stockSection = document.createElement('div');
  stockSection.innerHTML = `<h3>${symbol} Market Trends</h3>`;
  marketTrendsContent.appendChild(stockSection);

  if (data.length === 0) {
    stockSection.textContent = `No data available for ${symbol}.`;
    return;
  }

  
  const dates = [];
  const prices = [];
  const volumes = [];
  
  data.forEach(item => {
    dates.push(item.date);
    prices.push(item.close);
    volumes.push(item.volume);
  });

  // LINE CHART
  const priceChartCanvas = document.createElement('canvas');
  stockSection.appendChild(priceChartCanvas);

  new Chart(priceChartCanvas, {
    type: 'line',
    data: {
      labels: dates, 
      datasets: [{
        label: `${symbol} Stock Price (Close)`,
        data: prices, 
        borderColor: 'rgba(75, 192, 192, 1)',  
        backgroundColor: 'rgba(75, 192, 192, 0.2)', 
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `${symbol} Stock Price Over Time`
        }
      },
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Price ($)'
          }
        }
      }
    }
  });

  // BAR CHART
  const volumeChartCanvas = document.createElement('canvas');
  stockSection.appendChild(volumeChartCanvas);

  new Chart(volumeChartCanvas, {
    type: 'bar',
    data: {
      labels: dates, 
      datasets: [{
        label: `${symbol} Stock Volume`,
        data: volumes, //
        backgroundColor: 'rgba(255, 99, 132, 0.2)', 
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `${symbol} Stock Volume Over Time`
        }
      },
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Volume'
          }
        }
      }
    }
  });
}


fetchMultipleStockData();

