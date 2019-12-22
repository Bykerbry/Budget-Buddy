"use strict"

// DOM selectors
const $inc = document.getElementById('Income');
const $incFrequency = document.getElementById('Income2');
const $incSubmitBtn = document.getElementById('Submit');
const $menuBtn = document.querySelector('.menu-icon');
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
const $graphBar = document.getElementsByClassName('graph-bar');
const $rating = document.getElementById('rating');


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
  document.querySelector('.nav-menu').classList.toggle('toggler');
}

/******************* 
    Home Section 
********************/

/** On submit btn click, uses inc & incFrequency values to set incValue. */
const weeklyBudgetCalc = _ => {
    incValue = Math.floor(convertToWeekly($incFrequency.value, Number($inc.value)));
    localStorage.setItem('incomeValue', incValue);
};

// Retrieves the value of weekly budget from home.html


const getValues = _ => {
  if($expAddBtn) {
    $liveBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`;
    $staticBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`;
  };
  if($staticBudget) {
    $staticBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`
    incValue = Number(localStorage.getItem('incomeValue'));
    return incValue;
  };
  if($rating) {
    $liveBudget.innerText = `$ ${localStorage.getItem('incomeValue')}`;
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

let onAddExpense = () => {
  if ($listPlaceholder.style.display !== "none") {
    $listPlaceholder.style.display = 'none';
    liveBudget = Number($liveBudget.innerText.split('').filter(i => i !== '$').join(''));
  };

  let expAmountValue = convertToWeekly($expFrequency.value, Number($expAmount.value));
  expenses.push(new Expense($expDescription.value, expAmountValue, 
    $expFrequency.value, $expCategory.value));
  console.log(expenses);
  $expListOutput.insertAdjacentHTML('beforeend', 
  `<div class="list-item">
    <div class="item-description">${$expDescription.value}</div>
    <div class="item-amount">- $${Math.round(expAmountValue)} </div>
    <div class="rmv-item-icon" onclick="onRemoveItem(event)">
      <i class="rmv-item-icon material-icons">highlight_off</i>
    </div>
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
  localStorage.setItem('expenseCategorySums', JSON.stringify(expCategorySums));
};

/** Removes selected item from DOM, updates budget remaining & expenses array */
const onRemoveItem = e => {
  expenses = expenses.filter(i => {
    if (i.description !== e.target.parentNode.parentNode.childNodes[1].innerText) {
      return true;
    } else {
      liveBudget += i.amount;
      $liveBudget.innerText = `$ ${Math.round(liveBudget)}`;
      return false;
    };
  });
  e.target.parentNode.parentNode.remove();
}


// Event Listeners --- Wrapped in if statements to avoid errors from multiple linked HTML files.
if($incSubmitBtn) {
  $incSubmitBtn.addEventListener('click', weeklyBudgetCalc);
  $menuBtn.addEventListener('click', menuToggler)
};

if($expAddBtn) {
  $expAddBtn.addEventListener("click", onAddExpense);
  $expFinishBtn.addEventListener("click", getExpData);
  $menuBtn.addEventListener('click', menuToggler);
};
if($graphBar) {
  $menuBtn.addEventListener('click', menuToggler);
}



/******************* 
  Analysis Section 
********************/

// grab sum of amount from each category & converts to %
categorySumsObj = JSON.parse(localStorage.getItem('expenseCategorySums'))

const getPercent = key => ((categorySumsObj[key]/incValue) * 100).toString();

const setAnalysis = (divId, textId, key) => {
  document.getElementById(divId).style.width = `${getPercent(key)}%`;
  document.getElementById(textId).innerHTML = `${key.charAt(0).toUpperCase() 
    + key.substring(1)} Total: $${Math.round(categorySumsObj[key])}`;
};

if(document.getElementById('billsPercentage')) {
  setAnalysis('billsPercentage', 'billsTotal', 'bills');
  setAnalysis('foodPercentage','foodTotal','food');
  setAnalysis('entertainmentPercentage','entertainmentTotal','entertainment');
  setAnalysis('clothesPercentage', 'clothesTotal', 'clothes');
  setAnalysis('otherPercentage', 'otherTotal', 'other');
};



// grab sum of amount from each category & converts to %
// console.log(JSON.parse(localStorage.getItem('expenseCategorySums'))['bills']);
// ^^^ to verify the budget is correct

// let percentageBills = () => {
//   let percentageBillsObj = JSON.parse(localStorage.getItem('expenseCategorySums'))['bills']; 
//   return (percentageBillsObj/incValue)*100;
// }
// let percentageFood = () => {
//   let percentageFoodObj = JSON.parse(localStorage.getItem('expenseCategorySums'))['food']; 
//   return (percentageFoodObj/incValue)*100; 
// }
// let percentageEntertainment = () => {
//   let percentageEntertainmentObj = JSON.parse(localStorage.getItem('expenseCategorySums'))['entertainment']; 
//   return (percentageEntertainmentObj/incValue)*100; 
// }
// let percentageClothes = () => {
//   let percentageClothesObj = JSON.parse(localStorage.getItem('expenseCategorySums'))['clothes']; 
//   return (percentageClothesObj/incValue)*100; 
// }
// let percentageOther = () => {
//   let percentageOtherObj = JSON.parse(localStorage.getItem('expenseCategorySums'))['other']; 
//   return (percentageOtherObj/incValue)*100; 
// }



// converts category % to modify div width
// if(document.getElementById('billsPercentage')) {
  // document.getElementById('billsPercentage').style.width = `${percentageBills().toString()}%`;
  // document.getElementById('billsTotal').innerHTML = `Bills Total: $${Math.round(JSON.parse(localStorage.getItem('expenseCategorySums'))['bills'])}`;

  // document.getElementById('foodPercentage').style.width = `${percentageFood().toString()}%`;
  // document.getElementById('foodTotal').innerHTML = `Food Total: $${Math.round(JSON.parse(localStorage.getItem('expenseCategorySums'))['food'])}`;
  
  // document.getElementById('entertainmentPercentage').style.width = `${percentageEntertainment().toString()}%`;
  // document.getElementById('entertainmentTotal').innerHTML = `Entertainment Total: $${Math.round(JSON.parse(localStorage.getItem('expenseCategorySums'))['entertainment'])}`;

  // document.getElementById('clothesPercentage').style.width = `${percentageClothes().toString()}%`;
  // document.getElementById('clothesTotal').innerHTML = `Clothes Total: $${Math.round(JSON.parse(localStorage.getItem('expenseCategorySums'))['clothes'])}`;

  // document.getElementById('otherPercentage').style.width = `${percentageOther().toString()}%`;
  // document.getElementById('otherTotal').innerHTML = `Other Total: $${Math.round(JSON.parse(localStorage.getItem('expenseCategorySums'))['other'])}`;
// }



/******************* 
  Report Section 
********************/

// try to display leftover budget (live budget) in top right header...not working though

if($rating){
const rating = () => (Number($liveBudget))/Number($staticBudget);
  if (rating >= 0.5 && rating < 0.75){
    document.getElementById('star1','star2','star3','star4','star5').style.color='#F4B400'; 
    document.getElementById('rating-summary').innerHTML='Your right on the money! You got 5 stars';
    console.log('you got 5 stars');
  } else if (rating >= 0.75){
    document.getElementById('star1','star2','star3','star4').style.color='#F4B400'; 
    document.getElementById('rating-summary').innerHTML='Great job! But you can definitely afford more things in your life. You got 4 stars';
    console.log('you got 4 stars');
  } else if (rating >= 0.25 && rating < 0.5){
    document.getElementById('star1','star2','star3').style.color='#F4B400';
    document.getElementById('rating-summary').innerHTML='Pretty solid. But you are cutting it close and we recommend you spend less incase of emergency situations. You got 3 stars'; 
    console.log('you got 3 stars');
  } else if (rating > 0 && rating < 0.25){
    document.getElementById('star1','star2').style.color='#F4B400'; 
    document.getElementById('rating-summary').innerHTML='You need to dial the spending back quite a bit. You got 2 stars';
    console.log ('you got 2 stars')
  } else {
    console.log('you need financial help')
    document.getElementById('rating-summary').innerHTML='...You need financial help.';
  }
}
  