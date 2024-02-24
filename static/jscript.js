
function initializePage(clearErrorMessage = true) {
    console.log("Event Called")
    document.getElementById('page-container-2').classList.remove('active');
    document.getElementById('page-container-2').classList.add('inactive');
    console.log(clearErrorMessage);
    clearAndHideTabs();
    console.log(clearErrorMessage);
    if (clearErrorMessage) {
        document.getElementById('not-found-error').textContent = '';
    }
}


document.getElementById('clear-button').addEventListener('click', function() {
    document.getElementById('stock-symbol-input').value = ''; 
    initializePage(false);
});


document.addEventListener('DOMContentLoaded', initializePage);

// Function to activate #page-container-2
function activatePageContainer2() {
    document.getElementById('page-container-2').classList.remove('inactive');
    document.getElementById('page-container-2').classList.add('active');
    document.querySelector('.tab').style.display = 'block'; 
    activateTabs(); // Assuming you want to activate the tabs at the same time
}

// Function to initially disable tab buttons
function clearAndHideTabs() {
    var tabcontents = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontents.length; i++) {
        tabcontents[i].innerHTML = ''; 
    }
    var tablinks = document.getElementsByClassName("tablinks");
    for (var j = 0; j < tablinks.length; j++) {
        tabcontents[j].style.display = 'none'; 
        tablinks[j].classList.add('disabled'); 
    }
}

document.getElementById('clear-button').addEventListener('click', function() {

    
    document.getElementById('stock-symbol-input').value = ''; 
    document.getElementById('not-found-error').innerHTML = ''; 
    initializePage(false);
});

function activateTabs() {
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('disabled'); 
    }
}


function displayError(message) {
    var resultsDiv = document.getElementById('not-found-error');
    resultsDiv.innerHTML = `<div class="error-message">${message}</div>`;
}


// ---------------------------- SEARCH BUTTON -------------------------------------------

document.getElementById('search-button').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent the form from submitting via HTTP GET
    const form = document.getElementById('search-form');

    if (!form.checkValidity()) {
        form.reportValidity(); // This will show the validation message if the form is not valid
        return; // Exit the function if the form is not valid
    }

    let stockSymbol = document.getElementById('stock-symbol-input').value.trim().toUpperCase();

    if(stockSymbol != '')
    {
        try {
            console.log('1');
            await Promise.all([
                fetchAndDisplayCompanyData(stockSymbol),
                fetchAndDisplayStockSummary(stockSymbol),
                fetchAndDisplayStockSummaryRecommendation(stockSymbol),
                fetchAndDisplayHighCharts(stockSymbol),
                fetchAndDisplayLatestNews(stockSymbol)
            ]);
            activatePageContainer2(); 
            activateCompanyTab(); 
            
        } catch (error) {
            displayError(error.message); 
            initializePage(false);
        }
    }
});

// ---------------------------------- OPEN TAB -------------------------------------------

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}


// ---------------------------------- COMPANY DATA-------------------------------------------

function activateCompanyTab() {
    var companyTab = document.querySelector('.tablinks:not(.disabled)');
    if (companyTab) {
        companyTab.classList.add('active'); 
        companyTab.click(); 
    }
}

async function fetchAndDisplayCompanyData(symbol) {
    const response = await fetch(`https://jencyjos-assignment-2.wl.r.appspot.com/company?symbol=${encodeURIComponent(symbol)}`);
    const data = await response.json();
    if (Object.keys(data).length === 0) {
        throw new Error('Error : No record has been found, please enter a valid symbol'); 
    } else {
        // document.getElementById('not-found-error').textContent = '';
        displayCompanyData(data);
    }
}

function displayCompanyData(data) {
    let companyContent = document.getElementById('Company');
    companyContent.innerHTML = `
        <img src="${data.logo}" alt="${data.name} Logo" style="width: 100px; height: auto; margin-left: 450px; margin-bottom:10px;">
        <table style="margin-left: 330px; border-collapse:collapse;">
            <tr class="tr-top-border"><th>Company Name</th><td>${data.name}</td></tr>
            <tr class="tr-top-border"><th>Stock Ticker Symbol</th><td>${data.ticker}</td></tr>
            <tr class="tr-top-border"><th>Stock Exchange Code</th><td>${data.exchange}</td></tr>
            <tr class="tr-top-border"><th>Company Start Date</th><td>${data.ipo}</td></tr>
            <tr><th class="last-th">Category</th><td class="last-th">${data.finnhubIndustry}</td></tr>
        </table>
    `;
}



// --------------------------------------STOCK SUMMARY -------------------------------------------

async function fetchAndDisplayStockSummary(symbol) {
    const response = await fetch(`https://jencyjos-assignment-2.wl.r.appspot.com/stock_summary?symbol=${encodeURIComponent(symbol)}`);
    const data = await response.json();
    if (Object.keys(data).length === 0) {
        throw new Error('Error: No record has been found, please enter a valid symbol'); 
    } else {
        // document.getElementById('not-found-error').textContent = '';
        displayStockSummaryData(symbol,data);
    }
}

function displayStockSummaryData(symbol,data) {
    let stockSummaryContent = document.getElementById("StockSummary");
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let myDate = new Date(data.t * 1000); 
    let dateStr = myDate.getUTCDate() + " " + month[(myDate.getUTCMonth())] + ", " + myDate.getUTCFullYear();
    let arrow = ''
    if (data.d < 0){
        arrow_change = '../static/images/RedArrowDown.png'
    }else{
        arrow_change = '../static/images/GreenArrowUp.png'
    }

    if (data.dp < 0){
        arrow_percent = '../static/images/RedArrowDown.png'
    }else{
        arrow_percent = '../static/images/GreenArrowUp.png'
    }


    stockSummaryContent.innerHTML = `
    <table style="margin-left:320px; margin-bottom:10px;  border-collapse:collapse;">
        <tr class="tr-top-border"><th>Stock Ticker Symbol</th><td> ${symbol}</td></tr>
        <trclass="t r-top-border"><th>Trading Day</th><td> ${dateStr}</td></tr>
        <tr class="tr-top-border"><th>Previous Closing Price</th><td> ${data.pc}</td></tr>
        <tr class="tr-top-border"><th>Opening Price</th><td> ${data.o}</td></tr>
        <tr class="tr-top-border"><th>High Price</th><td> ${data.h}</td></tr>
        <tr class="tr-top-border"><th>Low Price</th><td> ${data.l}</td></tr>
        <tr class="tr-top-border"><th>Change</th><td> ${data.d} <img src=${arrow_change} style="width:10px;height:10px"></td></tr>
        <tr><th class="last-th">Change Percent</th><td class="last-th"> ${data.dp}<img src=${arrow_percent} style="width:10px;height:10px"></td></tr>
    </table>
    `;
}

// ------------------------STOCK SUMMARY RECOMMENDATION-------------------------------------------

async function fetchAndDisplayStockSummaryRecommendation(symbol) {
    const response = await fetch(`https://jencyjos-assignment-2.wl.r.appspot.com/stock_summary/recommendation?symbol=${encodeURIComponent(symbol)}`);
    const data = await response.json();
    console.log(data)
    if (Object.keys(data).length === 0) {
        throw new Error('Error: No record has been found, please enter a valid symbol'); 
    } else {
        displayStockSummaryRecommendationData(data);
    }
}




function displayStockSummaryRecommendationData(data) {
const recommendationsdiv = document.getElementById("StockSummary");
  data.sort((a, b) => new Date(b.period) - new Date(a.period));
  const latestRecommendation = data[0];

  function createIndicator(value, label, color) {
    return `
      <div class="indicator" style="background-color: ${color};">
        <span class="value">${value}</span>
      </div>
    `;
  }

  const colors = {
    strongSell: "#ff4d4d",
    sell: "#ff9999",
    hold: "#99cc99",
    buy: "#66cc66",
    strongBuy: "#4dff4d",
  };

  const indicatorsContainer = document.createElement("div");
  indicatorsContainer.classList.add("indicators-container");

  const strongSellLabel = document.createElement("span");
  strongSellLabel.innerHTML = `Strong<br>Sell`;
  strongSellLabel.style.color = "#ff4d4d";
  strongSellLabel.style.marginRight = "10px";  
  indicatorsContainer.appendChild(strongSellLabel);

  indicatorsContainer.innerHTML += createIndicator(
    latestRecommendation.strongSell,
    "",
    colors.strongSell
  );
  indicatorsContainer.innerHTML += createIndicator(
    latestRecommendation.sell,
    "",
    colors.sell
  );
  indicatorsContainer.innerHTML += createIndicator(
    latestRecommendation.hold,
    "",
    colors.hold
  );
  indicatorsContainer.innerHTML += createIndicator(
    latestRecommendation.buy,
    "",
    colors.buy
  );
  indicatorsContainer.innerHTML += createIndicator(
    latestRecommendation.strongBuy,
    "",
    colors.strongBuy
  );


  const strongBuyLabel = document.createElement("span");
  strongBuyLabel.innerHTML = `Strong<br>Buy`;
  strongBuyLabel.style.color = "#4dff4d";
  strongBuyLabel.style.marginLeft = "10px"; 
  indicatorsContainer.appendChild(strongBuyLabel);
  const recommendationTrendsTitle = document.createElement("h3");
  recommendationTrendsTitle.textContent = "Recommendation Trends";
  recommendationTrendsTitle.style.textAlign = "center"; 
  recommendationTrendsTitle.style.marginTop = "20px"; 

  document.getElementById("StockSummary").appendChild(indicatorsContainer);
  document.getElementById("StockSummary").appendChild(recommendationTrendsTitle)
}




// -----------------------------------------HIGH CHARTS-------------------------------------------

async function fetchAndDisplayHighCharts(symbol) {
    const response = await fetch(`https://jencyjos-assignment-2.wl.r.appspot.com/historydata?symbol=${encodeURIComponent(symbol)}`);
    const jsonData = await response.json();

    if (jsonData.results && jsonData.results.length > 0) {
        const priceData = jsonData.results.map(point => [point.t, point.c]);
        const volumeData = jsonData.results.map(point => [point.t, point.v]);

    const MaxValue = Math.max(...volumeData.map(item => item[1]));

        Highcharts.stockChart('Charts', {
            chart: {
                alignTicks: true 
            },
        
            rangeSelector: {
                buttons: [{
                    type: 'day',
                    count: 7,
                    text: '7d'
                }, {
                    type: 'day',
                    count: 15,
                    text: '15d'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }],
                selected: 0, 
                inputEnabled: false 
            },
        
            title: {
                text: `Stock Price ${symbol} ${new Date().toISOString().split('T')[0]}`
            },
        
            subtitle: {
                text: '<a href= "https://polygon.io/" target="_blank" style="color: blue;">Source: Polygon.io</a>',
                useHTML: 'on',
            },
        
            yAxis: [
                {
                  
                labels: {
                    align: "right",
                    x: -3,
                },
                title: {
                    text: "Stock Price",
                },
                startOnTick: false,
                endOnTick: false,
                  // height: '60%',
                lineWidth: 0,
                resize: {
                    enabled: true,
                },
                tickAmount: 5,
                opposite: false,
                },
                {
                  
                tickPixelInterval: 10,
                labels: {
                    align: "right",
                    x: -3,
                },
                title: {
                    text: "Volume",
                },
                tickAmount: 5,
                startOnTick: false,
                endOnTick: false,
                offset: 0,
                lineWidth: 0,
                max: 2*MaxValue,
                },
            ],
            tooltip: {
                split: true,
            },
        
            series: [{
                type: 'area',
                name: 'Stock Price',
                data: priceData,
                threshold: null,
                yAxis: 0,
                tooltip: {
                    valueDecimals: 2
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
            }, {
                type: 'column',
                name: 'Volume',
                data: volumeData,
                color:'black', pointPlacement: 'on',
                pointWidth: 5,
                yAxis: 1,
                tooltip: {
                    valueDecimals: 0
                }
            }]
        });
    } else {
        throw new Error('Error: No record has been found, please enter a valid symbol');
    }
}


// -----------------------------LATEST NEWS-------------------------------------------

async function fetchAndDisplayLatestNews(symbol) {
    const response = await fetch(`https://jencyjos-assignment-2.wl.r.appspot.com/latest_news?symbol=${encodeURIComponent(symbol)}`);
    const data = await response.json();
    if (Object.keys(data).length === 0) {
        throw new Error('Error:No record has been found, please enter a valid symbol'); 
    } else {
        // document.getElementById('not-found-error').textContent = '';
        displayLatestNews(data);
    }
}

function displayLatestNews(data) {
    let latestNewsContent = document.getElementById('LatestNews');
    latestNewsContent.innerHTML = ''; 
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let count = 0;

    for (let i = data.length-1; i >0; i--) {
        if (count < 5 && data[i].image != ''){ 
            let myDate = new Date(data[i].datetime * 1000); 
            let dateStr = myDate.getUTCDate() + " " + month[(myDate.getUTCMonth())] + ", " + myDate.getUTCFullYear();
            latestNewsContent.innerHTML += `
            <div class="flex-container" style="display:flex;flex-direction: row">
                <div class="flex-item1">
                    <img src="${data[i].image}" style="width:100px;height:100px">
                </div>
                <div class="flex-item2">
                    <p style="font-weight:bold">${data[i].headline}</p>
                    <p>${dateStr}</p>
                    <a href="${data[i].url}">See Original Post</a>
                </div>
            </div>
            `;
            count++; 
        }

    }
    
}