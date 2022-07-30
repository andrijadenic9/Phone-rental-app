window.addEventListener('beforeunload', save);

// VIEWS
let usersView = document.querySelector('#users-view');
let newRentView = document.querySelector('#add-rent-view');
let editDeleteView = document.querySelector('#edit-delete-view');
let editRentView = document.querySelector('#edit-rent-view');

let usersTbody = usersView.querySelector('tbody');
let editDeleteTbody = editDeleteView.querySelector('tbody');

// Buttons
let usersTableBtn = document.querySelector('#users-view-btn');
let newRentBtn = document.querySelector('#new-rent-view-btn');
let saveBtn = document.querySelector('#save-btn');
let esaveBtn = document.querySelector('#esave-btn');
let editDeleteBtn = document.querySelector('#edit-delete-btn');

// Forms
let phoneSelect = document.querySelector('#phone-select');
let providerSelect = document.querySelector('#provider-select');
let inputId = document.querySelector('[name="input-id"]');
let inputUser = document.querySelector('[name="user"]');
let inputStartDate = document.querySelector('#startDate');
let inputEndDate = document.querySelector('#endDate');
let searchField = document.querySelector('[type="search"]');
// Edit Form
let ephoneSelect = document.querySelector('#ephone-select');
let eproviderSelect = document.querySelector('#eprovider-select');
let einputId = editRentView.querySelector('[name="input-id"]');
let einputUser = editRentView.querySelector('[name="user"]');
let einputStartDate = document.querySelector('#estartDate');
let einputEndDate = document.querySelector('#eendDate');


// Listeners
usersTableBtn.addEventListener('click', displayUsersView);
newRentBtn.addEventListener('click', displayNewRentView);
saveBtn.addEventListener('click', saveNewRent);
editDeleteBtn.addEventListener('click', displayEditDeleteView);
esaveBtn.addEventListener('click',editRentAccount);
searchField.addEventListener('input',getSearchTerm);


function save(){
    localStorage.db = JSON.stringify(db);
}

function getSearchTerm(){
    let term = this.value;
    let currentDb = db.filter(el => {
        return  el.user.indexOf(term) !== -1 ||
                el.phone.indexOf(term) !== -1 ||
                 el.provider.indexOf(term) !== -1
    })
    createUsersTable(currentDb);
}



function generateId() {
    let rand;
    let unique = false;
    while(!unique){
        unique = true;
        rand = Math.floor(Math.random()*100000);
        db.forEach(user => {
            if(parseInt(user.id) === rand){
                unique = false;
            }
        })
    }
    return rand.toString();
}

function saveNewRent() {
    let newRent = {
        id: generateId(),
        user: inputUser.value,
        phone: phoneSelect.value,
        provider: providerSelect.value,
        startDate: inputStartDate.value,
        endDate: inputEndDate.value
    }
    db.push(newRent);
    createUsersTable() // success
    displayUsersView() // ????
    resetInputForm()
}

function editRentAccount(){
    let currentUser = db.find(user => user.id === this.getAttribute('data-id'));
    currentUser.phone = ephoneSelect.value;
    currentUser.user = einputUser.value;
    currentUser.provider = eproviderSelect.value;
    currentUser.startDate = einputStartDate.value;
    currentUser.endDate = einputEndDate.value;
    createUsersTable();
    displayUsersView();
}

function resetInputForm() {
    inputId.value = ""
    inputUser.value = ""
    phoneSelect.value = ""
    providerSelect.value = ""
    inputStartDate.value = ""
    inputEndDate.value = ""
}

function displayUsersView(e) {

    if (e) {
        e.preventDefault()
    }
    newRentView.style.display = "none";
    editDeleteView.style.display = "none";
    editRentView.style.display = "none";
    usersView.style.display = "block";
}

function displayEditDeleteView(e) {
    if (e) {
        e.preventDefault()
    }
    createEditDeleteTable();
    usersView.style.display = "none";
    newRentView.style.display = "none";
    editRentView.style.display = "none";
    editDeleteView.style.display = "block";
}

function displayNewRentView(e) {
    e.preventDefault();
    createPhoneOptions();
    createProviderOptions();
    usersView.style.display = "none";
    editDeleteView.style.display = "none";
    editRentView.style.display = "none";
    newRentView.style.display = "block";
}

createUsersTable(db);

function createProviderOptions() {
    let text = ``;
    allProviders.forEach(p => {
        text += `
        <option value="${p}">${p}</option>
        `.trim()
    })
    providerSelect.innerHTML = text;
}

function createEditProviderOptions(provider) {
    let text = ``;
    allProviders.forEach(p => {
        text += `
        <option value="${p}" ${(p === provider) ? "selected" : ""}>${p}</option>
        `.trim()
    })
    eproviderSelect.innerHTML = text;
}

function createPhoneOptions() {
    let text = ``;
    allPhones.forEach(phone => {
        text += `
        <option value="${phone}">${phone}</option>
        `.trim()
    })
    phoneSelect.innerHTML = text;
}

function createEditPhoneOptions(currentPhone) {
    let text = ``;
    allPhones.forEach(phone => {
        text += `
        <option value="${phone}" ${(phone === currentPhone) ? "selected" : ""}>${phone}</option>
        `.trim()
    })
    ephoneSelect.innerHTML = text;
}

function createUsersTable(currentDb) {
    console.log(currentDb)
    if(!currentDb){
        currentDb = db;
    }
    let text = ``;
    currentDb.forEach(user => {
        text += `
         <tr>
            <td>${user.id}</td>
            <td>${user.user}</td>
            <td>${user.phone}</td>
            <td>${user.provider}</td>
            <td>${user.startDate}</td>
            <td>${user.endDate}</td>
         </tr>
        `.trim()
    })
    usersTbody.innerHTML = text;
}

function fillEditForm(currentUser) {
    createEditPhoneOptions(currentUser.phone);
    createEditProviderOptions(currentUser.provider);
    einputId.value = currentUser.id;
    einputUser.value = currentUser.user;
    einputStartDate.value = currentUser.startDate;
    einputEndDate.value = currentUser.endDate;
}

function displayEditView() {
    let id = this.getAttribute('data-id');
    esaveBtn.setAttribute('data-id',id);
    let currentUser = db.find(el => el.id === id);
    fillEditForm(currentUser);

    usersView.style.display = "none";
    editDeleteView.style.display = "none";
    newRentView.style.display = "none";
    editRentView.style.display = "block";
}

function createEditDeleteTable() {
    let text = ``;
    db.forEach((user, index) => {
        text += `
         <tr>
            <td>${user.id}</td>
            <td>${user.user}</td>
            <td>${user.phone}</td>
            <td>${user.provider}</td>
            <td>${user.startDate}</td>
            <td>${user.endDate}</td>
            <td><button class="btn btn-sm btn-danger delete-btns" data-id="${user.id}">Delete</button></td>
            <td><button class="btn btn-sm btn-warning edit-btns" data-id="${user.id}">Edit</button></td>
         </tr>
        `.trim()
    })
    editDeleteTbody.innerHTML = text;
    let allDeleteBtns = document.querySelectorAll('.delete-btns');
    let allEditBtns = document.querySelectorAll('.edit-btns')

    allDeleteBtns.forEach((btn, index) => {
        btn.addEventListener('click', deleteUser);
        allEditBtns[index].addEventListener('click', displayEditView);
    })
}

function deleteUser() {
    let id = this.getAttribute('data-id')
    db = db.filter(user => user.id !== id);
    createUsersTable()
    displayUsersView()
}


new XMLHttpRequest()

new Date()


