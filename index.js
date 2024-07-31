import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-c83cb-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
const toDoListInDB = ref(database, "toDoList")
const connectedRef = ref(database, ".info/connected")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

const inputFieldElTwo = document.getElementById("input-field-two")
const addButtonElTwo = document.getElementById("add-button-two")
const toDoListEl = document.getElementById("to-do-list")


onValue(connectedRef, function (snapshot) {
    if (snapshot.val() === true) {
        console.log("Connected to the database.")
    } else {
        console.log("Disconnected from the database.")
    }
})

function addItemToCart() {
    let inputValue = inputFieldEl.value

    if (inputValue) {
        push(shoppingListInDB, inputValue)
        clearInputFieldEl()
    }
}

function addItemToDo() {
    let inputValue = inputFieldElTwo.value

    if (inputValue) {
        push(toDoListInDB, inputValue)
        clearInputFieldElTwo()
    }
}

addButtonEl.addEventListener("click", addItemToCart)

addButtonElTwo.addEventListener("click", addItemToDo)

inputFieldEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addItemToCart()
    }
})

inputFieldElTwo.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addItemToDo()
    }
})

onValue(shoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        clearShoppingListEl()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]

            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet"

    }
})

onValue(toDoListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        clearToDoListEl()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemId = currentItem[0]
            let currentItemValue = currentItem[1]

            appendItemToToDoListEl(currentItem)
        }
    } else {
        toDoListEl.innerHTML = "Plenty to do"
    }
})



function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearToDoListEl() {
    toDoListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function clearInputFieldElTwo() {
    inputFieldElTwo.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    newEl.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)

        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}

function appendItemToToDoListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    newEl.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `toDoList/${itemID}`)

        remove(exactLocationOfItemInDB)
    })

}