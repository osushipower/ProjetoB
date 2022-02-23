async function apiGetAirTable(authKey) {
    statusCode = ""
    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico",
        {
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
    .then((data) => console.log(data))
    // return console.log(response.json());
}

async function apiPostAirTable() {

}

async function apiUpdateAirTable() {

}

apiGetAirTable("key2CwkHb0CKumjuM")