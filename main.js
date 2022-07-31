window.addEventListener('beforeunload', saveData);

// * VIEWS
let usersView = document.querySelector('#users-view');
let newRentView = document.querySelector('#add-rent-view');
let editDeleteView = document.querySelector('#edit-delete-view');
let editRentView = document.querySelector('#edit-rent-view');

// * tbody
let usersTbody = usersView.querySelector('tbody');
let editDeleteTbody = editDeleteView.querySelector('tbody');

// * BUTTONS
let usersTableBtn = document.querySelector('#users-view-btn');
let newRentBtn = document.querySelector('#new-rent-view-btn');
let editDeleteBtn = document.querySelector('#edit-delete-btn');
let saveBtn = document.querySelector('#save-btn');
let esaveBtn = document.querySelector('#esave-btn');

// * FORMS
let phoneSelect = document.querySelector('#phone-select');
let providerSelect = document.querySelector('#provider-select');
let inputId = document.querySelector('[name="input-id"]');
let inputUser = document.querySelector('[name="user"]');
let inputStartDate = document.querySelector('#startDate');
let inputEndDate = document.querySelector('#endDate');
let searchField = document.querySelector('[type="search"]');

// * edit Form
let ephoneSelect = document.querySelector('#ephone-select');
let eproviderSelect = document.querySelector('#eprovider-select');
let einputId = editRentView.querySelector('[name="input-id"]');
let einputUser = editRentView.querySelector('[name="user"]');
let einputStartDate = document.querySelector('#estartDate');
let einputEndDate = document.querySelector('#eendDate');

// * EVENT LISTENERS
usersTableBtn.addEventListener('click', displayUsersView);
newRentBtn.addEventListener('click', displayNewRentView);
editDeleteBtn.addEventListener('click', displayEditDeleteView);
saveBtn.addEventListener('click', saveNewRent);
esaveBtn.addEventListener('click', editRentAccount);
searchField.addEventListener('input', getSearchTerm);

createUsersTable(db);

// * create user's table view
function createUsersTable(currentDb) {
    // * according if there is passed 'currentDb' (searched term) or not
    if (!currentDb) {
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

// * create providers options from database
function createProviderOptions() {
    let text = ``;
    allProviders.forEach(provider => {
        text += `
        <option value="${provider}">${provider}</option>
        `.trim()
    })
    providerSelect.innerHTML = text;
}

// * get provider on edit view according user's selection
function createEditProviderOptions(currentProvider) {
    let text = ``;
    allProviders.forEach(provider => {
        text += `
        <option value="${provider}" ${(provider === currentProvider) ? "selected" : ""}>${provider}</option>
        `.trim()
    })
    eproviderSelect.innerHTML = text;
}

// * create phone options from database
function createPhoneOptions() {
    let text = ``;
    allPhones.forEach(phone => {
        text += `
        <option value="${phone}">${phone}</option>
        `.trim()
    })
    phoneSelect.innerHTML = text;
}

// * create edit phone options according user's selection
function createEditPhoneOptions(currentPhone) {
    let text = ``;
    allPhones.forEach(phone => {
        text += `
        <option value="${phone}" ${(phone === currentPhone) ? "selected" : ""}>${phone}</option>
        `.trim()
    })
    ephoneSelect.innerHTML = text;
}

// * filling edit form
function fillEditForm(currentUser) {
    einputId.value = currentUser.id;
    einputUser.value = currentUser.user;
    einputStartDate.value = currentUser.startDate;
    einputEndDate.value = currentUser.endDate;
    createEditPhoneOptions(currentUser.phone);
    createEditProviderOptions(currentUser.provider);
}

// * create edit delete table
function createEditDeleteTable() {
    let text = ``;
    db.forEach(user => {
        text += `
         <tr>
            <td>${user.id}</td>
            <td>${user.user}</td>
            <td>${user.phone}</td>
            <td>${user.provider}</td>
            <td>${user.startDate}</td>
            <td>${user.endDate}</td>
            <td><button class="btn btn-sm btn-warning edit-btns" data-id="${user.id}">Edit</button></td>
            <td><button class="btn btn-sm btn-danger delete-btns" data-id="${user.id}">Delete</button></td>
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

// * delete specific user
function deleteUser() {
    let id = this.getAttribute('data-id')
    db = db.filter(user => user.id !== id);
    createUsersTable()
    displayUsersView()
}

// * before unload get all data from local storage and set it to db array
function saveData() {
    localStorage.db = JSON.stringify(db);
}

// * on every input check
function getSearchTerm() {
    displayUsersView();
    let term = this.value.toLowerCase();
    let currentDb = db.filter(el => {
        return el.user.toLowerCase().indexOf(term) !== -1 ||
            el.phone.toLowerCase().indexOf(term) !== -1 ||
            el.provider.toLowerCase().indexOf(term) !== -1
    })
    createUsersTable(currentDb);
}

// * generate random user's ID
function generateId() {
    let rand;
    let unique = false;
    while (!unique) {
        unique = true;
        rand = Math.floor(Math.random() * 100000);
        db.forEach(user => {
            if (parseInt(user.id) === rand) {
                unique = false;
            }
        })
    }
    return rand.toString();
}

// * save new rent
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
    createUsersTable();
    displayUsersView();
    resetInputForm();
}

// * edit account and updateing database
function editRentAccount() {
    let currentUser = db.find(user => user.id === this.getAttribute('data-id'));
    currentUser.phone = ephoneSelect.value;
    currentUser.user = einputUser.value;
    currentUser.provider = eproviderSelect.value;
    currentUser.startDate = einputStartDate.value;
    currentUser.endDate = einputEndDate.value;
    createUsersTable();
    displayUsersView();
}

// * reset all inputs from previous selection
function resetInputForm() {
    inputId.value = "";
    inputUser.value = "";
    phoneSelect.value = "";
    providerSelect.value = "";
    inputStartDate.value = "";
    inputEndDate.value = "";
}

// * DISPLAY VIEWS FUNCTIONS
function displayUsersView(e) {
    if (e) { e.preventDefault() }
    toggleActivLink(usersTableBtn, editDeleteBtn, newRentBtn);
    usersTableBtn.classList.add('active');
    newRentBtn.classList.remove('active');
    editDeleteBtn.classList.remove('active');
    newRentView.style.display = "none";
    editDeleteView.style.display = "none";
    editRentView.style.display = "none";
    usersView.style.display = "block";
}

function displayEditDeleteView(e) {
    if (e) { e.preventDefault() }
    toggleActivLink(editDeleteBtn, usersTableBtn, newRentBtn);
    createEditDeleteTable();
    usersView.style.display = "none";
    newRentView.style.display = "none";
    editRentView.style.display = "none";
    editDeleteView.style.display = "block";
}

function displayNewRentView(e) {
    e.preventDefault();
    toggleActivLink(newRentBtn, usersTableBtn, editDeleteBtn);
    createPhoneOptions();
    createProviderOptions();
    usersView.style.display = "none";
    editDeleteView.style.display = "none";
    editRentView.style.display = "none";
    newRentView.style.display = "block";
}

function displayEditView() {
    let id = this.getAttribute('data-id');
    esaveBtn.setAttribute('data-id', id);
    let currentUser = db.find(el => el.id === id);
    fillEditForm(currentUser);

    usersView.style.display = "none";
    editDeleteView.style.display = "none";
    newRentView.style.display = "none";
    editRentView.style.display = "block";
}

function toggleActivLink(add, remove1, remove2) {
    add.classList.add('active');
    remove1.classList.remove('active');
    remove2.classList.remove('active');
}