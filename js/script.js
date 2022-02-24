// Variables

const input_value = document.getElementById('price');
const table_body = document.getElementById('table-body');
var arrayTransactions = []

// Functions

function initializer() {
    apiGetAirTable("key2CwkHb0CKumjuM");
}

async function apiGetAirTable(authKey) {
    statusCode = ""
    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?filterByFormula=" + encodeURI("({Responsavel} = '1812')"),
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authKey}`
            }
        }
    )
        .then((response) => {
            statusCode = response.status;
            console.log(statusCode)
            return response.json()
        })
        .then((data) => {
            data["records"].forEach((record) => {
                if ("Json" in record.fields) {
                    record.fields.Json = JSON.parse(record.fields.Json)
                    let transactions = record.fields.Json;
                    transactions.forEach((transaction) => {

                        arrayTransactions.push({ id: record.id, type: transaction.type, name: transaction.name, value: transaction.value })
                    })
                }
            })
        })
    reloadTable();
}

async function apiPostAirTable(type, name, value, authKey) {
    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico",
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    records: [
                        {
                            fields: {
                                Responsavel: '1812',
                                Json: JSON.stringify([
                                    {
                                        type,
                                        name,
                                        value
                                    }
                                ])
                            }
                        }
                    ]
                }
            )
        }
    )
        .then((response) => {
            return response.json()
        })
        .then((data) => console.log(data))
    
    location.reload();
}

async function apiDeleteAirTable(authKey) {
    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico",
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    records: []
                }
            )
        }
    )
        .then((response) => {
            return response.json()
        })
        .then((data) => console.log(data))
}

async function apiUpdateAirTable(authKey) {

    let arrayToBeDeleted = [];
    arrayTransactions.forEach((item) => {
        arrayToBeDeleted.push(
            {
                id: item.id,
                fields: {
                    Responsavel: '1812',
                    Json: ""
                }
            }
        )
    });

    console.log(arrayToBeDeleted);

    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico",
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${authKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    records: arrayToBeDeleted
                }
            )
        }
    )
        .then((response) => {
            return response.json()
        })
        .then((data) => console.log(data))

    location.reload();
}

function submitForm() {
    let select = document.getElementById("transaction");

    var transaction = select.options[select.selectedIndex].text;
    var merch = document.getElementById("merch").value;
    var price = document.getElementById("price").value;

    (transaction === "Compra") ? (transaction = "-") : (transaction = "+")

    alert(`Compra: ${transaction} | Mercadoria: ${merch} | Valor: ${price}`);

    apiPostAirTable(transaction, merch, price, "key2CwkHb0CKumjuM");
}

function format() {
    let val = +input_value.value;
    let valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).formatToParts(val).map(
        p => p.type != 'literal' && p.type != 'currency' ? p.value : ''
    ).join('');
}

function reloadTable() {

    let totalValue = 0.0;

    arrayTransactions.forEach((transaction) => {

        (transaction.type === '+') ? (totalValue += Number(transaction.value)) : (totalValue -= Number(transaction.value));

        let newRow = table_body.insertRow(-1);
        let cellType = newRow.insertCell(0);
        let cellName = newRow.insertCell(1);
        let cellPrice = newRow.insertCell(2);

        let typeText = document.createTextNode(transaction.type);
        let nameText = document.createTextNode(transaction.name);
        let priceText = document.createTextNode("R$ " + transaction.value.toLocaleString('pt-br', { minimumFractionDigits: 2 }));

        cellType.classList.add("project_b_table_operator");
        cellName.classList.add("project_b_table_product_name");
        cellPrice.classList.add("project_b_table_value");

        cellType.appendChild(typeText);
        cellName.appendChild(nameText);
        cellPrice.appendChild(priceText);

        console.log(transaction);

    })

    // Last Calculation
    let balance = "";
    (totalValue >= 0) ? (balance = "[LUCRO]") : (balance = "[Prejuízo]");

    // Adding last rows

    let emptyRow = table_body.insertRow(-1);
    emptyRow.insertCell(0);
    emptyRow.insertCell(1);
    emptyRow.insertCell(2);

    let totalValueRow = table_body.insertRow(-1);
    totalValueRow.insertCell(0);

    let totalValueTextCell = totalValueRow.insertCell(1);
    let totalValuePriceCell = totalValueRow.insertCell(2);

    let totalValueText = document.createTextNode("Total");
    let totalValuePrice = document.createTextNode("R$ " + totalValue.toLocaleString('pt-br', { minimumFractionDigits: 2 }));
    let totalBalance = document.createTextNode(balance);

    totalValueTextCell.classList.add("project_b_table_product_name");
    totalValuePriceCell.classList.add("project_b_table_value");

    totalValueTextCell.appendChild(totalValueText);
    totalValuePriceCell.appendChild(totalValuePrice);
    totalValuePriceCell.appendChild(totalBalance);

    console.log("Total Value: R$ ", totalValue);
}

function clearEntries() {
    apiUpdateAirTable("key2CwkHb0CKumjuM");
}

// Events

input_value.addEventListener("input", format, false);

// Calls

initializer();