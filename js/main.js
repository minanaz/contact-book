const inpName = document.getElementsByClassName('input-name')[0];
const inpSurname = document.getElementsByClassName('input-surname')[0];
const inpNumber = document.getElementsByClassName('input-number')[0];
const inpImg = document.getElementsByClassName('input-img')[0];
const addBtn = document.getElementsByClassName('add-btn')[0];
const contacts = document.getElementsByClassName('contacts')[0];
const modal = document.getElementsByClassName('modal-wrapper')[0];

const editName = document.getElementsByClassName('modal-input-name')[0];
const editSurname = document.getElementsByClassName('modal-input-surname')[0];
const editNumber = document.getElementsByClassName('modal-input-number')[0];
const editImg = document.getElementsByClassName('modal-input-img')[0];
const saveBtn = document.getElementsByClassName('modal-save')[0];
const closeBtn = document.getElementsByClassName('close-btn')[0]
render()
addBtn.addEventListener('click', async function (){
    if(!inpName.value.trim()
    || !inpSurname.value.trim()
    || !inpNumber.value.trim()
    || !inpImg.value.trim()
    ) {
        alert('Fill inputs')
        return
    }
 const newContact = {
        name: inpName.value,
        surname: inpSurname.value,
        number: inpNumber.value,
        img: inpImg.value
 }
 await setDataToStorage(newContact);
 console.log(inpSurname.value);
 render()
})

async function setDataToStorage (newContact){
    const options = {
        method: "POST",
        body: JSON.stringify(newContact),
        headers: {
            "Content-Type": 'application/json'
        }
    }
    await fetch('http://localhost:8008/contacts', options)
};

async function getDataFromStorage(){
    const data = await fetch('http://localhost:8008/contacts');
    const result = await data.json();
    return result
};

async function render () {
    const data = await getDataFromStorage();
    contacts.innerHTML = ''
    data.forEach(item => {
    let newDiv = document.createElement("div") 
    newDiv.setAttribute("class", "contact-data") 
    newDiv.innerHTML += `
    <div class="contact-img">
        <img src="${item.img}" alt="">
    </div>
    <div class="contact-info">
        <div class="contact-name">
            <p><b>Name:</b></p>
            <p>${item.name}</p>
        </div>
        <div class="contact-surname">
            <p><b>Surname:</b></p>
            <p>${item.surname}</p>
        </div>
        <div class="contact-number">
            <p><b>Number:</b></p>
            <p>${item.number}</p>
        </div>
        
    </div>
`
    const btnDelete = document.createElement('button');
      btnDelete.innerText = 'Delete';
      btnDelete.classList.add('delete-btn');
      btnDelete.id = item.id
      btnDelete.addEventListener('click', function (e){
        // e.stopPropagation();
        deleteContact(e.target.id);
    });
    newDiv.appendChild(btnDelete);

    const btnEdit = document.createElement('button');
    btnEdit.innerText = 'Edit';
    btnEdit.classList.add('edit-btn');
    btnEdit.addEventListener('click', function (e){
      e.stopPropagation()
      editContact(item.id)
    });
    newDiv.appendChild(btnEdit)
   
    contacts.append(newDiv)
    })
}


async function deleteContact (id){
    await fetch(`http://localhost:8008/contacts/${id}`, {method: "DELETE"});
    render()
}

async function editContact(id){
    const response = await fetch(`http://localhost:8008/contacts/${id}`);
    const itemToEdit = await response.json();
    modal.style.display = 'block';
    console.log(itemToEdit);
    editName.value = itemToEdit.name;
    editSurname.value = itemToEdit.surname;
    editNumber.value = itemToEdit.number;
    editImg.value = itemToEdit.img
    saveBtn.id = id;
};

closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});


saveBtn.addEventListener('click', async (e) => {
    if(!editName.value.trim()
    || !editSurname.value.trim()
    || !editNumber.value.trim()
    ) {
        alert("Fill inputs")
        return
    }
    modal.style.display = 'none';
    let options = {
        method: "PATCH",
        body: JSON.stringify({name: editName.value, surname: editSurname.value, number: editNumber.value, img: editImg.value}),
        headers: {
            "Content-Type": 'application/json'
          }
    }
    await fetch(`http://localhost:8008/contacts/${e.target.id}`, options)
    render()
})