const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");

const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const type = document.getElementById("type");

const localStorageTransactions =
JSON.parse(localStorage.getItem("transactions"));

let transactions =
localStorage.getItem("transactions") !== null
? localStorageTransactions
: [];

let chart;

function addTransactionDOM(transaction){

const sign = transaction.amount < 0 ? "-" : "+";

const item = document.createElement("li");

item.classList.add(
transaction.amount < 0 ? "minus" : "plus"
);

item.innerHTML = `
${transaction.text}
<span>${sign}₹${Math.abs(transaction.amount)}</span>
<button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
`;

list.appendChild(item);
}

function updateValues(){

const amounts = transactions.map(
transaction => transaction.amount
);

const total = amounts
.reduce((acc,item) => (acc += item),0)
.toFixed(2);

const inc = amounts
.filter(item => item > 0)
.reduce((acc,item) => (acc += item),0)
.toFixed(2);

const exp = (
amounts
.filter(item => item < 0)
.reduce((acc,item) => (acc += item),0) * -1
).toFixed(2);

balance.innerText = `₹${total}`;
income.innerText = `₹${inc}`;
expense.innerText = `₹${exp}`;

drawChart(inc,exp);
}

function drawChart(inc,exp){

const ctx = document.getElementById("expenseChart");

if(chart){
chart.destroy();
}

chart = new Chart(ctx,{
type:"pie",
data:{
labels:["Income","Expense"],
datasets:[{
data:[inc,exp],
backgroundColor:["green","red"]
}]
}
});
}

function removeTransaction(id){

transactions = transactions.filter(
transaction => transaction.id !== id
);

updateLocalStorage();
init();
}

function addTransaction(e){

e.preventDefault();

if(text.value.trim() === "" || amount.value.trim() === ""){
alert("Please enter description and amount");
return;
}

let value = Number(amount.value);

if(type.value === "expense"){
value = -Math.abs(value);
}

const transaction = {
id: generateID(),
text: text.value,
amount: value
};

transactions.push(transaction);

addTransactionDOM(transaction);

updateValues();

updateLocalStorage();

text.value="";
amount.value="";
}

function generateID(){
return Math.floor(Math.random()*100000000);
}

function updateLocalStorage(){
localStorage.setItem("transactions",JSON.stringify(transactions));
}

function init(){

list.innerHTML="";

transactions.forEach(addTransactionDOM);

updateValues();
}

init();

form.addEventListener("submit",addTransaction);