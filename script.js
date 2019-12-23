"use strict"

// DOM selectors
const $inc = document.getElementById('Income');
const $incFrequency = document.getElementById('Income2');
const $incSubmitBtn = document.getElementById('Submit');
const $menuBtn = document.querySelector('.menu-icon');
const $navMenu = document.querySelector('.nav-menu');
const $staticBudget = document.getElementById('weekly-budget-static');
const $liveBudget = document.getElementById('weekly-budget-live');
const $expAddBtn = document.getElementById('exp-add-btn');
const $expFinishBtn = document.getElementById('exp-finish-btn');
const $expDescription = document.getElementById('exp-description');
const $expCategory = document.getElementById('exp-category-selector');
const $expAmount = document.getElementById('exp-amount');
const $expFrequency = document.getElementById('exp-frequency-selector');
const $expListOutput = document.getElementById('exp-list-output');
const $listPlaceholder = document.getElementById('list-placeholder-container');
const $descriptionLabel = document.getElementById('exp-description-label');
const $amountLabel = document.getElementById('exp-amount-label');
const $frequencyLabel = document.getElementById('exp-frequency-label');
const $categoryLabel = document.getElementById('exp-category-label');
const $savingsPercent = document.getElementById('savingsPercentage');
const $savingsTotal = document.getElementById('savingsTotal');
const $rating = document.getElementById('rating');
const $ratingSummary = document.getElementById('rating-summary');
const $saveOrDeficit = document.getElementById('save-or-deficit');
const $star = document.querySelectorAll('.star');


// Global Variables that will get values from eventListeners.
let incFrequencyValue;
let incValue;
let liveBudget;
let categorySumsObj;

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
      return amount / 4.345;
    case 'Quarterly':
      return amount / 13.044;
    case 'Semi-Annually':
      return amount / 26.088;
    case 'Annually':
      return amount / 52.1775;
    default:  
      return amount;
  };
};

const menuToggler = _ => {
  $navMenu.classList.toggle('toggler');
};

/******************* 
    Home Section 
********************/

/** On submit btn click, uses inc & incFrequency values to set incValue. */
const weeklyBudgetCalc = _ => {
    incValue = Math.floor(convertToWeekly($incFrequency.value, Number($inc.value)));
    localStorage.setItem('incomeValue', incValue);
};

// Retrieves values from storage 
const getValues = _ => {
  if($expAddBtn) {
    $liveBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`;
    $staticBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`;
  };
  if($staticBudget) {
    $staticBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`;
    incValue = Number(localStorage.getItem('incomeValue'));
    return incValue;
  };
  if($rating) {
    $liveBudget.innerText = `$ ${Math.round(localStorage.getItem('savings'))}`;
  }
}; 

incValue = getValues();

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

const resetLabels = _ => {
  $descriptionLabel.style.color = '#FEEEDA';
  $amountLabel.style.color = '#FEEEDA';
  $frequencyLabel.style.color = '#FEEEDA';
  $categoryLabel.style.color = '#FEEEDA';
}

const checkInputs = _ => {
  let error = 0;
  resetLabels();
  if (!$expDescription.value) {
    $descriptionLabel.style.color = '#DB4437';
    error++;
  };
  if (!$expAmount.value) {
    $amountLabel.style.color = '#DB4437'; 
    error++;
  };
  if ($expFrequency.value === 'default') {
    $frequencyLabel.style.color = '#DB4437';
    error++;
  };
  if ($expCategory.value === 'default') {
    $categoryLabel.style.color = '#DB4437';
    error++;
  };
  return !error 
};

const onAddExpense = () => {
  if (checkInputs()){
    if ($listPlaceholder.style.display !== "none") {
      $listPlaceholder.style.display = 'none';
      liveBudget = Number($liveBudget.innerText.split('').filter(i => i !== '$').join(''));
    };
    let expAmountValue = convertToWeekly($expFrequency.value, Number($expAmount.value));
    $expListOutput.insertAdjacentHTML('beforeend', 
    `<div class="list-item">
      <div class="item-description">${$expDescription.value}</div>
      <div class="item-amount">- $${Math.round(expAmountValue)} </div>
      <div class="rmv-item-icon" onclick="onRemoveItem(event)">
        <i class="rmv-item-icon material-icons">highlight_off</i>
      </div>
    </div>`);

    liveBudget -= expAmountValue;
    if (liveBudget < 0) {
      $liveBudget.style.color = "red";
    };
    
    expenses.push(new Expense($expDescription.value, expAmountValue, $expFrequency.value, $expCategory.value));
    $liveBudget.innerText = `$ ${Math.round(liveBudget)}`; 
    resetLabels();
    $expDescription.value = '';
    $expAmount.value = '';
    $expFrequency.value = $expFrequency.options[0].value;
    $expCategory.value = $expCategory.options[0].value;
    $expDescription.select();
  };
};

/** 
 * Loops through expenses array, creates & stores an object containing category sums. 
 * 1. Sets object keys from category options.
 * 2. Sets object values as sums of each category.
 * 3. Stores newly created expCategorySums object & liveBudget value for use in analysis.html
 * */
const getExpData = _ => {
  let expCategorySums = {};
  for (let i = 1; i < $expCategory.options.length; i++) {
    expCategorySums[$expCategory.options[i].value] = 0;
  };
  expenses.map(exp => {
    Object.keys(expCategorySums).map(key => {
      if (key === exp.category) {
        expCategorySums[key] += exp.amount;
      };
    })
  });
  localStorage.setItem('savings', liveBudget);
  localStorage.setItem('expenseCategorySums', JSON.stringify(expCategorySums));
};

/** Removes selected item from DOM, updates budget remaining & expenses array */
const onRemoveItem = e => {
  expenses = expenses.filter(i => {
    if (i.description !== e.target.parentNode.parentNode.childNodes[1].innerText) {
      return true;
    } else {
      liveBudget += i.amount;
      if (liveBudget > 0) {
        $liveBudget.style.color = "#FEEEDA";
      };
      $liveBudget.innerText = `$ ${Math.round(liveBudget)}`;
      return false;
    };
  });
  e.target.parentNode.parentNode.remove();
};


/******************* 
  Analysis Section 
********************/

// grab sum of amount from each category & converts to %
categorySumsObj = JSON.parse(localStorage.getItem('expenseCategorySums'));

const getPercent = key => ((categorySumsObj[key]/incValue) * 100);

const setAnalysis = (divId, textId, key) => {
  document.getElementById(divId).style.width = `${getPercent(key)}%`;
  document.getElementById(textId).innerHTML = `${key.charAt(0).toUpperCase() 
    + key.substring(1)} Total: $${Math.round(categorySumsObj[key])} \u00A0 (${Math.round(getPercent(key))}%)`;
};

if($savingsPercent) {
  setAnalysis('billsPercentage', 'billsTotal', 'bills');
  setAnalysis('foodPercentage','foodTotal','food');
  setAnalysis('entertainmentPercentage','entertainmentTotal','entertainment');
  setAnalysis('clothesPercentage', 'clothesTotal', 'clothes');
  setAnalysis('otherPercentage', 'otherTotal', 'other');
  let getSavings = localStorage.getItem('savings') > 0 ? localStorage.getItem('savings') : 0;
  let getSavingsPercent = Math.round(getSavings/incValue * 100);
  $savingsPercent.style.width = `${getSavingsPercent}%`;
  $savingsTotal.innerHTML = `Savings Total: $${Math.round(getSavings)} \u00A0 (${getSavingsPercent}%)`;
  
  if (localStorage.getItem('savings') < 0) {
    let deficit = localStorage.getItem('savings')
    document.querySelector('.hard_budget').insertAdjacentHTML('beforebegin', 
    `<div id='deficit'>Your spending exceeded your income by: <div id='deficit-amount'>${Math.round(Math.abs(deficit/incValue) * 100)}% \u00A0($${Math.round(Math.abs(deficit))})</div></div>`)
  }
};



/******************* 
  Report Section 
********************/
  

// Same code as before, just refactored slightly so 1 function fills the stars & added HTML selectors.

const fillStars = num => {
  for(let i=0; i <= num; i++) {
    $star[i].style.color = '#F4B400';
  };
};

if($rating){
  let getSavings = localStorage.getItem('savings');
  $savingsTotal.innerHTML = `$${Math.round(getSavings)}`;

  if (getSavings < 0) {
    $saveOrDeficit.innerText = 'deficit';
    $savingsTotal.style.color = '#DB4437';
  };

  const rating = getSavings/incValue;
  if (rating >= 0.75){
    fillStars(4); 
    $ratingSummary.innerHTML="You're right on the money!";
  } else if (rating >= 0.5 && rating < 0.75){
    fillStars(3);
    $ratingSummary.innerHTML='Great job! But you can definitely afford more things in your life.';
  } else if (rating >= 0.25 && rating < 0.5){
    fillStars(2);
    $ratingSummary.innerHTML='Pretty solid. But you are cutting it close and we recommend you spend less incase of emergency situations.'; 
  } else if (rating > 0 && rating < 0.25){
    fillStars(1);
    $ratingSummary.innerHTML='You need to dial the spending back quite a bit.';
  } else {
    fillStars(0); 
    $ratingSummary.innerHTML='...You need financial help.';
  };
};


// Event Listeners --- Wrapped in if statements to avoid errors from multiple linked HTML files.
if($incSubmitBtn) {
  $incSubmitBtn.addEventListener('click', weeklyBudgetCalc);
};
if($expAddBtn) {
  $expAddBtn.addEventListener("click", onAddExpense);
  $expFinishBtn.addEventListener("click", getExpData);
};
if($menuBtn) {
  $menuBtn.addEventListener('click', menuToggler);
};
