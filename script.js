document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("transaction-modal");
    const btn = document.getElementById("new-transaction-btn");
    const span = document.getElementsByClassName("close-button")[0];
    const form = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");
    const currentBalance = document.getElementById("current-balance");
    let balance = 0;
    let transactions = [];

    // Open the modal
    btn.onclick = function() {
        modal.style.display = "flex";
    }

    // Close the modal when clicking on the close button
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Close the modal when clicking outside the modal content
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    // Handle form submission
    form.onsubmit = function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const amount = parseFloat(formData.get("amount"));
        const type = formData.get("type");
        const name = formData.get("name");
        const cardNumber = formData.get("card-number");
        const expiryDate = formData.get("expiry-date");
        const cvv = formData.get("cvv");
        const transactionId = Math.floor(Math.random() * 1000000000);

        const transaction = {
            id: transactionId,
            amount,
            type,
            name,
            cardNumber,
            expiryDate,
            cvv,
        };

        transactions.push(transaction);

        if (type === "deposit") {
            balance += amount;
        } else if (type === "withdrawal") {
            balance -= amount;
        }

        updateBalance();
        updateTransactionList();

        modal.style.display = "none";
        form.reset();
    }

    function updateBalance() {
        currentBalance.textContent = `$${balance.toFixed(2)}`;
    }

    function updateTransactionList() {
        transactionList.innerHTML = "";
        transactions.forEach(transaction => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="transaction-info">
                    <span>${transaction.name}</span>
                    <span>Transaction ID: ${transaction.id}</span>
                    <span>${transaction.type}</span>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    $${transaction.amount.toFixed(2)}
                </div>
            `;
            transactionList.appendChild(li);
        });
    }

    updateBalance();
    updateTransactionList();
});