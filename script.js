"use strict"

// Pass on values from the form at homepage to Expenses Report into local storage

const submit = function(e) {
  let income = income();
}

let btn = document.getElementById("Submit");
if(btn){
  btn.addEventListener('click', function(event){
    event.preventDefault();
    localStorage.setItem('income', document.getElementById('Income').value);

    const e = document.getElementById('Income2');
    const strUser = e.options[e.selectedIndex].value;
    localStorage.setItem('Income2', strUser);
    window.document.location = 'expenses.html';
  }); 
}

const income = function(e){
  let expensesIncome = document.getElementById('Income') - localStorage.getElementById('Income');
}

/**
 * Shows piechart of user spending
 * 
 * 
 */
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
function drawChart() {
  var data = google.visualization.arrayToDataTable([
  ['Task', 'Dollars per Week'],
  ['Entertainment', 50],
  ['Food', 50],
  ['Bills', 500],
  ['Clothes', 10],
  ['Other', 100]
]);

  // Optional; add a title and set the width and height of the chart
  var options = {
    'title':'Your Spending',
    'titleTextStyle': { color: '#FEEEDA',
        fontName: 'Lato',
        fontSize: 14,
        bold: true,
        },
    'width':500, 
    'height':300,
    'backgroundColor': '#2D5D7C',
    'fontSize': 14,
    'pieSliceText': 'percentage',
    'legend': {position: 'right', textStyle: {color: '#FEEEDA', fontSize: 11}},
    'legend.alignment': 'end',
    'legend.position':'labeled',
    'tooltip.text':'both'

    
  }

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
  
} 
// end piechart code