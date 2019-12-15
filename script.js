
const inc = document.getElementById('Income');
const weeklyBudget = document.getElementById('weekly-budget');
const incFrequency = document.getElementById('inc-frequency');
const incSubmit = document.getElementById('inc-submit');

// Values assigned to below variables upon submit btn click.
let incFrequencyValue;
let incValue;

/** Default incFrequencyValue is 'Weekly'. This listens for changes. */
const getIncFrequency = e => {
  incFrequencyValue = e.target.value;
}

/** On submit btn click, uses inc & incFrequency values to set incValue. */
const weeklyBudgetCalc = _ => {
  let valueStr = inc.value.split('').filter(i => i !== '$').join('');
  if (Number(valueStr)) {
    let value = Number(valueStr);

    switch(incFrequencyValue) {
      case 'BiWeekly':
        incValue = value / 2;
        break;
      case 'Monthly':
        incValue = Math.floor(value / 4.345);
        break;
      case 'Yearly':
        incValue = Math.floor(value / 52.1775);
        break;
      default:  
        incValue = value;
    };
    localStorage.setItem('incomeValue', incValue);
  } else {
    // Maybe call a function here that throws an error & tells user to input a number.
    console.log('Error');
  }
};

// Event Listeners --- Wrapped in if statements to avoid errors from multiple linked HTML files.
if(incSubmit) {
  incSubmit.addEventListener('click', weeklyBudgetCalc);
  incFrequency.addEventListener('change', getIncFrequency);
};

// Retrieves the value of weekly budget from home.html
document.addEventListener('readystatechange', function(){
  if(weeklyBudget) {
    weeklyBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`;
  };
});











/*** Commented out Pie Chart section so console would not through errors */

// /**
//  * Shows piechart of user spending
//  * 
//  * 
//  */
// google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChart);

// // Draw the chart and set the chart values
// function drawChart() {
//   var data = google.visualization.arrayToDataTable([
//   ['Task', 'Dollars per Week'],
//   ['Entertainment', 50],
//   ['Food', 50],
//   ['Bills', 500],
//   ['Clothes', 10],
//   ['Other', 100]
// ]);

//   // Optional; add a title and set the width and height of the chart
//   var options = {
//     'title':'Your Spending',
//     'titleTextStyle': { color: '#FEEEDA',
//         fontName: 'Lato',
//         fontSize: 14,
//         bold: true,
//         },
//     'width':500, 
//     'height':300,
//     'backgroundColor': '#2D5D7C',
//     'fontSize': 14,
//     'pieSliceText': 'percentage',
//     'legend': {position: 'right', textStyle: {color: '#FEEEDA', fontSize: 11}},
//     'legend.alignment': 'end',
//     'legend.position':'labeled',
//     'tooltip.text':'both'

    
//   }

//   // Display the chart inside the <div> element with id="piechart"
//   var chart = new google.visualization.PieChart(document.getElementById('piechart'));
//   chart.draw(data, options);
  
// } 
// // end piechart code

