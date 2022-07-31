// * SIMULATE DATABASE
let db = [];

// * if there is data in local storage, assign it to the db array
if (localStorage.db) {
    db = JSON.parse(localStorage.db);
}

// * phones and provides options
let allPhones = ["Samsung Note 10", "Samsung Ultra 20", "iPhone 10"];
let allProviders = ["MTS", "OBS", "MTL"];
