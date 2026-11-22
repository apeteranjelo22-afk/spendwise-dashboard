
// ========================================
// SPENDWISE INTERACTIVE BUDGET APPLICATION
// ========================================

// 1. VARIABLES AND ARRAYS

const currency = "KSh";

let monthlyBudget = 50000;

// Store multiple expense records in an array
let expenses = [
    {
        id: 1,
        name: "Buying food",
        category: "Food",
        amount: 8000
    },
    {
        id: 2,
        name: "Bus fare",
        category: "Transport",
        amount: 3000
    },
    {
        id: 3,
        name: "House rent",
        category: "Rent",
        amount: 12000
    },
    {
        id: 4,
        name: "Electricity",
        category: "Utilities",
        amount: 2000
    }
];

// 2. SELECT HTML ELEMENTS USING THE DOM

const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");

const expenseForm = document.getElementById("expense-form");
const expenseName = document.getElementById("expense-name");
const expenseCategory = document.getElementById("expense-category");
const expenseAmount = document.getElementById("expense-amount");

const budgetDisplay = document.getElementById("budget-display");
const expensesDisplay = document.getElementById("expenses-display");
const balanceDisplay = document.getElementById("balance-display");
const budgetStatus = document.getElementById("budget-status");

const expenseList = document.getElementById("expense-list");

// 3. FUNCTION TO FORMAT MONEY

function formatMoney(amount) {
    return currency + " " + amount.toLocaleString("en-KE", {
        maximumFractionDigits: 2
    });
}

// 4. FUNCTION TO CALCULATE TOTAL EXPENSES

function calculateTotalExpenses() {

    let total = 0;

    // Use a loop to process all expense records
    for (let i = 0; i < expenses.length; i++) {
        total += expenses[i].amount;
    }

    return total;
}

// 5. FUNCTION TO CALCULATE REMAINING BALANCE

function calculateBalance(budget, totalExpenses) {
    return budget - totalExpenses;
}

// 6. FUNCTION TO DISPLAY BUDGET STATUS

function updateBudgetStatus(balance) {

    // Remove the previous status style
    budgetStatus.classList.remove("over-budget");

    // Make decisions using conditionals
    if (balance > 0) {

        budgetStatus.textContent =
            "Good job! You have " +
            formatMoney(balance) +
            " remaining.";

    } else if (balance === 0) {

        budgetStatus.textContent =
            "You have used your entire monthly budget.";

    } else {

        budgetStatus.textContent =
            "Warning! You have exceeded your budget by " +
            formatMoney(Math.abs(balance)) + ".";

        budgetStatus.classList.add("over-budget");
    }
}

// 7. FUNCTION TO DISPLAY EXPENSE RECORDS

function displayExpenses() {

    // Clear the previous records
    expenseList.textContent = "";

    // Check if there are no expenses
    if (expenses.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.textContent =
            "No expenses recorded yet.";

        expenseList.appendChild(emptyMessage);

        return;
    }

    // Use forEach loop to display every expense
    expenses.forEach(function(expense) {

        const expenseItem = document.createElement("div");
        expenseItem.className = "expense-item";

        const details = document.createElement("div");
        details.className = "expense-details";

        const name = document.createElement("strong");
        name.textContent = expense.name;

        const category = document.createElement("p");
        category.textContent = "Category: " + expense.category;

        const amount = document.createElement("p");
        amount.textContent = "Amount: " + formatMoney(expense.amount);

        details.appendChild(name);
        details.appendChild(category);
        details.appendChild(amount);

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.dataset.id = expense.id;

        deleteButton.setAttribute(
            "aria-label",
            "Delete " + expense.name
        );

        expenseItem.appendChild(details);
        expenseItem.appendChild(deleteButton);

        expenseList.appendChild(expenseItem);
    });
}

// 8. FUNCTION TO UPDATE THE DASHBOARD

function updateDashboard() {

    let totalExpenses = calculateTotalExpenses();

    let remainingBalance = calculateBalance(
        monthlyBudget,
        totalExpenses
    );

    // Update HTML using textContent
    budgetDisplay.textContent = formatMoney(monthlyBudget);

    expensesDisplay.textContent = formatMoney(totalExpenses);

    balanceDisplay.textContent = formatMoney(remainingBalance);

    // Update budget status
    updateBudgetStatus(remainingBalance);

    // Update expense records
    displayExpenses();

    // Display report in the browser console
    console.log("===== SPENDWISE REPORT =====");
    console.log("Monthly Budget:", formatMoney(monthlyBudget));
    console.log("Total Expenses:", formatMoney(totalExpenses));
    console.log("Remaining Balance:", formatMoney(remainingBalance));
    console.log("Number of Expenses:", expenses.length);
    console.log("============================");
}

// 9. EVENT LISTENER FOR BUDGET FORM

budgetForm.addEventListener("submit", function(event) {

    // Prevent the page from refreshing
    event.preventDefault();

    let newBudget = Number(budgetInput.value);

    if (!Number.isFinite(newBudget) || newBudget <= 0) {

        alert("Please enter a valid budget greater than zero.");
        return;
    }

    monthlyBudget = newBudget;

    updateDashboard();

    budgetInput.value = "";

    alert("Your monthly budget has been updated!");
});

// 10. EVENT LISTENER FOR ADDING EXPENSES

expenseForm.addEventListener("submit", function(event) {

    event.preventDefault();

    let name = expenseName.value.trim();
    let category = expenseCategory.value;
    let amount = Number(expenseAmount.value);

    // Validate user input
    if (
        name === "" ||
        category === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert("Please enter valid expense information.");
        return;
    }

    // Create a new expense object
    const newExpense = {
        id: Date.now(),
        name: name,
        category: category,
        amount: amount
    };

    // Add the new expense to the array
    expenses.push(newExpense);

    // Update the dashboard
    updateDashboard();

    // Clear the form
    expenseForm.reset();

    alert("Expense added successfully!");
});

// 11. EVENT LISTENER FOR DELETING EXPENSES

expenseList.addEventListener("click", function(event) {

    if (event.target.classList.contains("delete-btn")) {

        let expenseId = Number(event.target.dataset.id);

        // Remove the selected expense from the array
        expenses = expenses.filter(function(expense) {
            return expense.id !== expenseId;
        });

        // Refresh dashboard
        updateDashboard();

        console.log("Expense deleted successfully.");
    }
});

// 12. DISPLAY INITIAL DASHBOARD

updateDashboard();
