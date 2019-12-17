"use strict"

const inc = document.getElementById('Income');
const incFrequency = document.getElementById('Income2');
const incSubmitBtn = document.getElementById('Submit');
const weeklyBudget = document.getElementById('weekly-budget');
const expAddBtn = document.getElementById('exp-add-btn');
const expFinishBtn = document.getElementById("exp-finish-btn");
const expDescription = document.getElementById("exp-description");
const expCategory = document.getElementById("exp-category-selector");
const expAmount = document.getElementById("exp-amount");
const expRecurring = document.getElementById("recurring");
const expFrequency = document.getElementById("exp-frequency-selector");

// Values assigned to below variables upon submit btn click.
let incFrequencyValue;
let incValue;
let expCategorySums;

/** Default incFrequencyValue is 'Weekly'. This listens for changes. */
const getIncFrequency = e => {
  incFrequencyValue = e.target.value;
};

/** On submit btn click, uses inc & incFrequency values to set incValue. */
const weeklyBudgetCalc = _ => {
  let valueStr = inc.value.split('').filter(i => i !== '$').join('');
  console.log(valueStr);
  console.log("btn-clicked");
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
    console.log(incValue);
    localStorage.setItem('incomeValue', incValue);
  } else {
    // Maybe call a function here that throws an error & tells user to input a number.
    console.log('Error');
  }
};

// Retrieves the value of weekly budget from home.html
document.addEventListener('readystatechange', _ => {
  console.log(localStorage.getItem('incomeValue'));
  if(weeklyBudget) {
    weeklyBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`;
  };
});







// initialize an empty array, that will be filled when user adds expense
let expenses = []

class Expense {
  constructor (description, category, amount, recurring, frequency){
    this.description=description;
    this.category=category;
    this.amount=amount;
    this.recurring=recurring;
    this.frequency=frequency; 
  }
}

let createExpense = () => {
  description = expDescription.value;
  category = expCategory.value;
  amount = Number(expAmount.value); 
  recurring = expRecurring.checked;
  frequency = expFrequency.value;
  expenses.push(new Expense(description, category, amount, recurring, frequency));
  console.log(expenses);
};

/** Loops through expenses array & sets expCategorySums equal to an object containing the sum of each category */
const getExpData = _ => {
  let entertainment = 0;
  let food = 0;
  let clothing = 0;
  let bills = 0;
  let other = 0;

  expenses.map(i => {
    switch(i.category) {
      case 'entertainment':
        entertainment += i.amount;
        break;
      case 'food':
        food += i.amount;
        break;
      case 'clothing':
        clothing += i.amount;
        break;
      case 'bills':
        bills =+ i.amount;
        break;
      default:
        other += i.amount;
    };
  });
  
  expCategorySums = {
    "entertainment" : entertainment, 
    "food" : food, 
    "clothing" : clothing, 
    "bills" : bills, 
    "other" : other
  };
  console.log(expCategorySums);
  localStorage.setItem('expenseCategorySums', expCategorySums);
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

