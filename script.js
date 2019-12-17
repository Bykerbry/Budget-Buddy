"use strict"

<<<<<<< HEAD
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
=======
const inc = document.getElementById('Income');
const incFrequency = document.getElementById('inc-frequency');
const incSubmitBtn = document.getElementById('inc-submit');
const weeklyBudget = document.getElementById('weekly-budget');
const expAddBtn = document.getElementById('exp-add-btn');
const expFinishBtn = document.getElementById("exp-finish-btn");

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
if(incSubmitBtn) {
  incFrequency.addEventListener('change', getIncFrequency);
  incSubmitBtn.addEventListener('click', weeklyBudgetCalc);
};

// Retrieves the value of weekly budget from home.html
document.addEventListener('readystatechange', _ => {
  if(weeklyBudget) {
    weeklyBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`;
  };
});
>>>>>>> afd7a8162f9585ab97eb0f6091f16c2e0666b589







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
  description = document.getElementById("exp-description").value;
  category = document.getElementById("exp-category-selector").value;
  amount = Number(document.getElementById("exp-amount").value); 
  recurring = document.getElementById("recurring").checked;
  frequency = document.getElementById("exp-frequency-selector").value;
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
  localStorage.setItem('expenseCategorySums', expCategorySums);
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

