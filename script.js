"use strict"

// DOM selectors
const inc = document.getElementById('Income');
const incFrequency = document.getElementById('Income2');
const incSubmitBtn = document.getElementById('Submit');
const weeklyBudget = document.getElementById('weekly-budget');
const expAddBtn = document.getElementById('exp-add-btn');
const expFinishBtn = document.getElementById("exp-finish-btn");
const expDescription = document.getElementById("exp-description");
const expCategory = document.getElementById("exp-category-selector");
const expAmount = document.getElementById("exp-amount");
const expFrequency = document.getElementById("exp-frequency-selector");
const expListOutput = document.getElementById("exp-list-output");
const listPlaceholder = document.getElementById('list-placeholder')

// Global Variables that will get values from eventListeners.
let incFrequencyValue;
let incValue;
let liveBudget;

const convertToWeekly = (frequencyStr, amount) => {
  console.log(frequencyStr, amount);
  switch(frequencyStr) {
    case 'Bi-Weekly':
      return amount / 2;
    case 'Monthly':
      return Math.floor(amount / 4.345);
    case 'Quarterly':
      return Math.floor(amount / 13.044);
    case 'Semi-Annually':
      return Math.floor(amount / 26.088);
    case 'Annually':
      return Math.floor(amount / 52.1775);
    default:  
      return amount;
  };
}

/******************* 
    Home Section 
********************/

/** Default incFrequencyValue is 'Weekly'. This listens for changes. */
const getIncFrequency = e => {
  incFrequencyValue = e.target.value;
};

/** On submit btn click, uses inc & incFrequency values to set incValue. */
const weeklyBudgetCalc = _ => {
    incValue = convertToWeekly(incFrequencyValue, Number(inc.value));
    localStorage.setItem('incomeValue', incValue);
};

// Retrieves the value of weekly budget from home.html
document.addEventListener('readystatechange', _ => {
  console.log(localStorage.getItem('incomeValue'));
  if(weeklyBudget) {
    weeklyBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`;
  };
});



/******************* 
  Expenses Section 
********************/

// initialize an empty array, that will be filled when user adds expense
let expenses = [];

class Expense {
  constructor (description, amount, frequency, category){
    this.description = description;
    this.amount = amount;
    this.frequency = frequency;
    this.category = category;
  };
};

let createExpense = () => {
  if (listPlaceholder.style.display !== "none") {
    listPlaceholder.style.display = 'none';
    liveBudget = Number(weeklyBudget.innerText.split('').filter(i => i !== '$').join(''));
  };

  let expAmountValue = convertToWeekly(expFrequency.value, Number(expAmount.value));
  expenses.push(new Expense(expDescription.value, expAmountValue, 
    expFrequency.value, expCategory.value));
    console.log(expenses);
  expListOutput.insertAdjacentHTML('beforeend', 
  `<div class="list-item">
    <div class="item-description">${expDescription.value}</div>
    <div class="item-amount">- $${expAmountValue} </div>
    <i class="rmv-item-icon material-icons">highlight_off</i>
  </div>`);
  liveBudget -= expAmountValue;
  console.log(liveBudget);
  weeklyBudget.innerText = `$ ${Math.round(liveBudget)}`; 

  expDescription.value = '';
  expAmount.value = '';
  expFrequency.value = expFrequency.options[0].value;
  expCategory.value = expCategory.options[0].value;
  expDescription.select()
};


/** Loops through expenses array, creates & stores an object containing category sums. */
const getExpData = _ => {
  // 1. Set object keys from category options.
  let expCategorySums = {}
  for (let i = 1; i < expCategory.options.length; i++) {
    expCategorySums[expCategory.options[i].value] = 0;
  };
  // 2. Set object values as sums of each category.
  expenses.map(i => Object.keys(expCategorySums).map(c => {
    if (c === i.category) {
      expCategorySums[c] += i.amount;
    };
  }));
  // 3. Store newly created expCategorySums object for use in analysis.html
  localStorage.setItem('expenseCategorySums', expCategorySums);
  console.log(expCategorySums);
};

// Event Listeners --- Wrapped in if statements to avoid errors from multiple linked HTML files.
if(incSubmitBtn) {
  incFrequency.addEventListener('change', getIncFrequency);
  incSubmitBtn.addEventListener('click', weeklyBudgetCalc);

};

if(expAddBtn) {
  expAddBtn.addEventListener("click", createExpense);
  expFinishBtn.addEventListener("click", getExpData);
};



/******************* 
  Analysis Section 
********************/



/*** Commented out Pie Chart section so console would not through errors */

// /**
//  * Shows piechart of user spending
//  * 
//  * 
//  */
// google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChart);

// // Draws the chart and sets the chart values
// function drawChart() {
//   var data = google.visualization.arrayToDataTable([
//   ['Task', 'Dollars per Week'],
//   ['Entertainment', entertainmentSum()],
//   ['Food', document.querySelectorAll("exp-amount").value],
//   ['Bills', document.querySelectorAll("exp-amount").value],
//   ['Clothes', document.querySelectorAll("exp-amount").value],
//   ['Other', document.querySelectorAll("exp-amount").value],
//   ['Available', ]
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

