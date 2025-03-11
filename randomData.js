/**
 *  Code for randomData
 */

import { searchBasedOnInput, populateSearchModal, populateHeaderSection, getData, allIngredientsURL, categorySearchURL, returnBackButton, returnModal, displayLoader, populateFooterSection } from "./importexport.js";

window.addEventListener("load", () => {
    displayLoader(3000)
    populateHeaderSection();
    populateMainContentSection();
    populateFooterSection();
     
});  

function getLocalStorage(localStorageItem) {
    let localStorageData = JSON.parse(localStorage.getItem(localStorageItem));
    return localStorageData;
}

function populateMainContentSection() {
    let mainContainer = document.getElementById("mainContainerRandom")
    let randomData = getLocalStorage("randomData");
    // localStorage.removeItem("randomData");// console.log(randomData); 
    mainContainer.style.display = "none";
    setTimeout(()=> {
        mainContainer.style.display = "block";
    }, 3000);
    let searchModal = returnModal("searchModal");
    searchModal.id = "searchModal";
    let randomFlex = document.createElement("div");
    randomFlex.id = "randomFlex";
    let randomDetails = document.createElement("div");
    randomDetails.id = "randomDetails";
    randomDetails.classList.add("dancing-script-text");
    let randomName = document.createElement("div");
    randomName.id = "randomName";
    randomName.classList.add("corinthia-bold");
    randomName.innerText = `${randomData['strMeal']}`;
    let randomCategory = document.createElement("div");
    randomCategory.id = "randomCategory";
    randomCategory.innerHTML = `<b>Category</b> : ${randomData['strCategory']}`;
    let randomArea = document.createElement("div");
    randomArea.id = "randomArea";
    randomArea.innerHTML = `<b>Country</b> : ${randomData['strArea']}`;
    let randomInstructions = document.createElement("div");
    randomInstructions.id = "randomInstructions";
    randomInstructions.classList.add("dancing-script-text");
    randomInstructions.innerText = `${randomData['strInstructions']}`;
    let randomThumb = document.createElement("div");
    randomThumb.id = "randomThumb";
    randomThumb.innerHTML = `<img src="${randomData['strMealThumb']}">`;
    let randomIFrame = document.createElement("div");
    randomIFrame.id = "randomIFrame";
    let iFrame = document.createElement("iframe");
    iFrame.title = "randomIFrame"; // to acheive 16:9 aspect ratio, refer: https://stackoverflow.com/questions/35814653/automatic-height-when-embedding-a-youtube-video
    iFrame.src = `${randomData['strYoutube']}`.replace("watch?v=", "embed/");
    iFrame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    iFrame.allowFullscreen = true;
    iFrame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    randomIFrame.appendChild(iFrame);
    let randomIngredients = createIngredientsMap(randomData);
    randomDetails.append(randomCategory, randomArea, randomIngredients);
    randomFlex.append(randomThumb, randomDetails);
    
    mainContainer.append(searchModal, randomName, randomFlex, randomInstructions, randomIFrame);
    if (randomData['strSource'] !== null || randomData['strSource'] !== "" || randomData['strSource'] !== " ") {
        let randomSource = document.createElement("div");
        randomSource.id = "randomSource";
        randomSource.classList.add("dancing-script-text");
        randomSource.innerHTML = `You can find more details <a href="${randomData['strSource']}">here</a>`;
        mainContainer.appendChild(randomSource);
    }
}

function createIngredientsMap(randomData) {
    let ingredientsMap = new Map();
    for(let i=0; i<19; i++) {
        if (Object.values(randomData)[9+i] !== "" || Object.values(randomData)[9+i] !== null || Object.values(randomData)[9+i] !== " ") {
            ingredientsMap.set(Object.values(randomData)[9+i], Object.values(randomData)[29+i]);
        }
    // console.log(Object.values(randomData)[9+i], Object.values(randomData)[29+i])  ;      
    }
    let randomIngredients = document.createElement("div");
    randomIngredients.id = "randomIngredients";
    let ingredientsTable = document.createElement("table");
    let tableHeaderRow = document.createElement("tr");
    tableHeaderRow.id = "tableHeaderRow";
    let tableIngredientColumn = document.createElement("th");
    tableIngredientColumn.id = "tableIngredientColumn";
    tableIngredientColumn.innerText = "Ingredients";
    tableIngredientColumn.classList.add("dancing-script-bold");
    tableIngredientColumn.style.border = "1px solid black";
    let tableQuantityColumn = document.createElement("th");
    tableQuantityColumn.id = "tableQuantityColumn";
    tableQuantityColumn.innerText = "Quantity";
    tableQuantityColumn.classList.add("dancing-script-bold");
    tableQuantityColumn.style.border = "1px solid black";
    tableHeaderRow.append(tableIngredientColumn, tableQuantityColumn);
    ingredientsTable.append(tableHeaderRow);
    ingredientsMap.forEach((value, key) => {
        let ingredientRow = document.createElement("tr");
        let ingredientColumn = document.createElement("td");
        ingredientColumn.classList.add("ingredientColumn");
        ingredientColumn.textContent = `${key}`;
        let quantityColumn = document.createElement("td");
        quantityColumn.textContent = `${value}`;
        quantityColumn.classList.add("quantityColumn");
        ingredientRow.append(ingredientColumn, quantityColumn);
        ingredientsTable.appendChild(ingredientRow);
    });
    return randomIngredients.appendChild(ingredientsTable);
}