/**
 *  Code for randomData
 */
window.addEventListener("load", () => {

    populateHeaderSection();
    populateMainContentSection();
    populateFooterSection();
     
});

function getLocalStorage(localStorageItem) {
    let localStorageData = JSON.parse(localStorage.getItem(localStorageItem));
    return localStorageData;
}

function populateHeaderSection() {
    let headerSection = document.getElementById("header");
    let logoContainer = document.createElement("div");
    logoContainer.id = "logoContainer";
    logoContainer.innerHTML = "<img src='./MyRecipeFinder.png'>"
    logoContainer.addEventListener("click", () => {
        window.location.href = "./home.html";
    });
    let searchbarContainer = document.createElement("div");
    searchbarContainer.id = "searchContainer";
    let searchBar = document.createElement("input");
    searchBar.id = "searchbar";
    searchBar.type = "text";
    searchBar.placeholder = "Search ingredient or category";
    let searchButton = document.createElement("button");
    searchButton.id = "searchButton";
    searchButton.innerHTML = `<ion-icon name="search-outline"></ion-icon>`;
    searchbarContainer.append(searchBar, searchButton);
    let navLinksContainer = document.createElement("div");
    navLinksContainer.id = "navLinksContainer";
    let cartLink = document.createElement("a");
    cartLink.href = "./cart.html";
    cartLink.innerHTML = `<img src="./cookbook.png">`; // https://cdn-icons-png.flaticon.com/512/3839/3839530.png
    let userIcon = document.createElement("a");
    userIcon.href = "./index.html";
    userIcon.innerHTML = `<img src="./logout.png">`; // https://img.icons8.com/?size=100&id=JesOX3f2LVdM&format=png&color=000000
    navLinksContainer.append(cartLink, userIcon);
    let navLinkCheckBox = document.createElement("input");
    navLinkCheckBox.type = "checkbox";
    navLinkCheckBox.id = "navLinkCheckBox";
    navLinkCheckBox.setAttribute("name", "checkbox");
    let navLinkCheckBoxLabel = document.createElement("label");
    navLinkCheckBoxLabel.id = "navLinkCheckBoxLabel";
    navLinkCheckBoxLabel.setAttribute("for", "navLinkCheckBox");
    navLinkCheckBoxLabel.innerHTML = `<ion-icon name="menu-outline" class="menu-outline"></ion-icon>`;
    let searchCheckBox = document.createElement("input");
    searchCheckBox.type = "checkbox";
    searchCheckBox.id = "searchCheckBox";
    searchCheckBox.setAttribute("name", "searchCheckbox");
    let searchCheckBoxLabel = document.createElement("label");
    searchCheckBoxLabel.id = "searchCheckBoxLabel";
    searchCheckBoxLabel.setAttribute("for", "searchCheckBox");
    searchCheckBoxLabel.innerHTML = `<ion-icon name="search-outline" class="search-outline"></ion-icon`;
    headerSection.append(logoContainer, navLinkCheckBox, searchCheckBox, searchbarContainer, searchCheckBoxLabel, navLinksContainer, navLinkCheckBoxLabel);
}

function populateMainContentSection() {
    let mainContainer = document.getElementById("mainContainerRandom")
    let randomData = getLocalStorage("randomData");
    // localStorage.removeItem("randomData");// console.log(randomData); 
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
    iFrame.title = "randomIFrame";
    iFrame.src = `${randomData['strYoutube']}`;
    randomIFrame.appendChild(iFrame);
    let randomIngredients = createIngredientsMap(randomData);
    randomDetails.append(randomCategory, randomArea, randomIngredients);
    randomFlex.append(randomThumb, randomDetails);
    
    mainContainer.append(randomName, randomFlex, randomInstructions, randomIFrame);
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

function populateFooterSection() {
    let footerSection = document.getElementById("footer");
    let aboutContainer = document.createElement("div");
    aboutContainer.id = "aboutContainer";
    let aboutContentHeading = document.createElement("h2");
    aboutContentHeading.classList.add("corinthia-bold");
    aboutContentHeading.innerText = "About Me";
    aboutContent = document.createElement("p");
    aboutContent.id = "aboutContent";
    aboutContent.classList.add("dancing-script-text");
    aboutContent.innerText = "Hi, My name is Sethu Maruthi and I'm the creator of My Recipe Finder. I like cooking various recipes that I come across my travels to various new places. Hope you find a recipe that touches your heart and fills you with joy. " + ``;
    aboutContainer.append(aboutContentHeading, aboutContent);
    let contactContainer = document.createElement("div");
    contactContainer.id = "contactContainer";
    let contactContentHeading = document.createElement("h2");
    contactContentHeading.classList.add("corinthia-bold");
    contactContentHeading.innerText = "Contact Me";
    contactContent = document.createElement("p");
    contactContent.id = "contactContent";
    contactContent.classList.add("dancing-script-text");
    contactContent.innerText = "You can reach out to me at sethumaruthi93@gmail.com."
    contactContainer.append(contactContentHeading, contactContent);
    let copyright = document.createElement("div");
    copyright.id = "copyright";
    copyright.innerHTML = ` &copy; Copyright 2025. All rights reserved.`;

    footerSection.append(aboutContainer, contactContainer, copyright);
}