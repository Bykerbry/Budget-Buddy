"use strict"

// DOM selectors
const $inc = document.getElementById('Income');
const $incFrequency = document.getElementById('Income2');
const $incSubmitBtn = document.getElementById('Submit');
const $staticBudget = document.getElementById('weekly-budget-static');
const $liveBudget = document.getElementById('weekly-budget-live');
const $expAddBtn = document.getElementById('exp-add-btn');
const $expFinishBtn = document.getElementById('exp-finish-btn');
const $expDescription = document.getElementById('exp-description');
const $expCategory = document.getElementById('exp-category-selector');
const $expAmount = document.getElementById('exp-amount');
const $expFrequency = document.getElementById('exp-frequency-selector');
const $expListOutput = document.getElementById('exp-list-output');
const $listPlaceholder = document.getElementById('list-placeholder');

// Global Variables that will get values from eventListeners.
let incFrequencyValue;
let incValue;
let liveBudget;

/**
 * Takes payment frequency + amount & returns the amount as a weekly payment.
 * @param {string} frequencyStr 
 * @param {number} amount 
 */
const convertToWeekly = (frequencyStr, amount) => {
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
};


/******************* 
    Home Section 
********************/

/** On submit btn click, uses inc & incFrequency values to set incValue. */
const weeklyBudgetCalc = _ => {
    incValue = convertToWeekly($incFrequency.value, Number($inc.value));
    localStorage.setItem('incomeValue', incValue);
};

// Retrieves the value of weekly budget from home.html
document.addEventListener('readystatechange', _ => {
  if($liveBudget) {
    $liveBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`;
    $staticBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`;
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

let onAddExpense = () => {
  if ($listPlaceholder.style.display !== "none") {
    $listPlaceholder.style.display = 'none';
    liveBudget = Number($liveBudget.innerText.split('').filter(i => i !== '$').join(''));
  };

  let expAmountValue = convertToWeekly($expFrequency.value, Number($expAmount.value));

  expenses.push(new Expense($expDescription.value, expAmountValue, 
    $expFrequency.value, $expCategory.value));

  $expListOutput.insertAdjacentHTML('beforeend', 
  `<div class="list-item">
    <div class="item-description">${$expDescription.value}</div>
    <div class="item-amount">- $${expAmountValue} </div>
    <i class="rmv-item-icon material-icons">highlight_off</i>
  </div>`);

  liveBudget -= expAmountValue;
  $liveBudget.innerText = `$ ${Math.round(liveBudget)}`; 
  $expDescription.value = '';
  $expAmount.value = '';
  $expFrequency.value = $expFrequency.options[0].value;
  $expCategory.value = $expCategory.options[0].value;
  $expDescription.select();
};


/** 
 * Loops through expenses array, creates & stores an object containing category sums. 
 * 1. Sets object keys from category options.
 * 2. Sets object values as sums of each category.
 * 3. Stores newly created expCategorySums object for use in analysis.html
 * */
const getExpData = _ => {
  let expCategorySums = {};
  for (let i = 1; i < $expCategory.options.length; i++) {
    expCategorySums[$expCategory.options[i].value] = 0;
  };
  expenses.map(i => {
    Object.keys(expCategorySums).map(c => {
      if (c === i.category) {
        expCategorySums[c] += i.amount;
      };
    })
  });
  localStorage.setItem('expenseCategorySums', expCategorySums);
};

// Event Listeners --- Wrapped in if statements to avoid errors from multiple linked HTML files.
if($incSubmitBtn) {
  $incSubmitBtn.addEventListener('click', weeklyBudgetCalc);
};

if($expAddBtn) {
  $expAddBtn.addEventListener("click", onAddExpense);
  $expFinishBtn.addEventListener("click", getExpData);
};



/******************* 
  Analysis Section 
********************/

// grab sum of amount from each category

// divide sums by income for %

// used % to create a bar: %=color leftover=white
  // default is white space


