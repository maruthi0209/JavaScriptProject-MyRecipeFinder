/**
 *  Code for randomData
 */
const allIngredientsURL = "https://www.themealdb.com/api/json/v1/1/list.php?i=list";
const categorySearchURL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";

window.addEventListener("load", () => {
    displayLoader()
    populateHeaderSection();
    populateMainContentSection();
    populateFooterSection();
     
});

function displayLoader() {
    quoteArrays = ['"Let food be thy medicine and medicine be thy food." - Hippocrates', 
        '"People who love to eat are always the best people." - Julia Child',
        '"The only way to get rid of a temptation is to yield to it." - Oscar Wilde',
        '"First we eat, then we do everything else." - M.F.K. Fisher',
        '"Food should be fun." - Thomas Keller'];
    animationArrays = ["./bbqGiphy.gif", "./gokGiphy.gif", "./panGiphy.gif", "./playGiphy.gif", "./potGiphy.gif"];
    let loaderScreen = document.createElement("div");
    loaderScreen.id = "loaderScreen";
    let loaderAnimation = document.createElement("div");
    loaderAnimation.id = "loaderAnimation";
    loaderAnimation.innerHTML = `<img src=${animationArrays[Math.floor(Math.random() * animationArrays.length)]} alt="Cooking Gif for you darling!">`;
    let loaderQuote = document.createElement("div");
    loaderQuote.id = "loaderQuote";
    loaderQuote.classList.add("dancing-script-text");
    loaderQuote.innerText = quoteArrays[Math.floor(Math.random() * quoteArrays.length)];
    loaderScreen.append(loaderAnimation, loaderQuote);
    console.log(loaderQuote.innerText, loaderAnimation.innerHTML);
    loaderScreen.style.display = "block";
    setTimeout(()=>{
        loaderScreen.style.display = "none";
    }, 3000);
    document.body.appendChild(loaderScreen);
}

async function getData(URL) {
    let responseData;
    try {
        // let response = await fetch(URL, {
        //     method : "GET",
        //     headers : {"content-type" : "application/json", "Access-Control-Allow-Origin": "*"}
        // });
        let response = await fetch(URL);
        if (response.ok) { 
            responseData = await response.json();
            return responseData;
        } else {
            throw new Error("There was an error fetching the data. Please try again later.");
        }        
    } catch (error) {
        console.error(error);
    }
}

// async function searchBasedOnInput(searchBarValue) {
async function searchBasedOnInput(searchList) {
    let allIngredients = await getData(allIngredientsURL);
    // console.log(allIngredients['meals'], searchBarValue)
    var searchResults = new Array()
    allIngredients['meals'].forEach((meal) => {
        for(searchValue of searchList) {
            if (meal['strIngredient'].toLowerCase().includes(searchValue)){
                // console.log(meal['strIngredient'])
                fetch(categorySearchURL + meal['strIngredient'])
                .then((response) => {
                    if(response.ok) {
                        return response.json()
                    } else {
                        throw new error("There was a problem trying to fetch the data. Please try again later.")
                }})
                .then((meallist) => {
                    if (meallist['meals'] != null) {
                    // if (meallist['meals'].length != 0) {
                        console.log(meallist['meals'])
                    meallist['meals'].forEach((meal) => {
                        searchResults.push(meal)
                    }) } 
                })
            }
        }
        
    })
    return searchResults;
}

async function populateSearchModal(mealsList) {
    if(mealsList.length == 0) {
        badCook = ["./fire-cooking.gif", "bad-bad-cook.gif"]
        noMealFound = {
            "strMeal" : "Sorry! No recipes found. Try another ingredient or modify your search",
            "strMealThumb" : `${badCook[Math.floor(Math.random() * badCook.length)]}`
        }
        mealsList.push(noMealFound)
    }
    console.log(mealsList)
    let searchModal = document.getElementById("searchModal")
    let searchModalBackButton = returnBackButton(searchModal)
    let modalBody = document.createElement("div");
    (mealsList[0]['strMeal'].includes("Sorry!"))? modalBody.id ="searchModalBodyEmpty" : modalBody.id = "searchModalBody";
    mealsList.forEach((meal) => {
        // console.log(meal)
        let mealCard = document.createElement("div");
        (mealsList[0]['strMeal'].includes("Sorry!"))? mealCard.id ="mealCardEmpty" : mealCard.id = "searchMealCard";
        let mealCardImageContainer = document.createElement("div");
        mealCardImageContainer.id = "mealCardImageContainer";
        mealCardImageContainer.innerHTML = `<img src="${meal['strMealThumb']}">`;
        let mealCardName = document.createElement("div");
        mealCardName.id = "mealCardName"
        mealCard.classList.add("dancing-script-text");
        mealCardName.innerText = `${meal['strMeal']}`;
        mealCard.append(mealCardImageContainer, mealCardName);
        modalBody.appendChild(mealCard);

        mealCard.addEventListener("click", async () => {
        // await getData(idURL + `${meal['idMeal']}`);
        // console.log((await getData(idURL + `${meal['idMeal']}`))['meals']);
        setLocalStorage((await getData(idURL + `${meal['idMeal']}`))['meals'][0], "randomData");
        window.location.href = "./randomData.html";
        })
    })
    searchModal.append(searchModalBackButton, modalBody)    
}

function returnModal(name) {
    let modalName = document.createElement("div");
    modalName.id = `${name}` + "Modal";
    modalName.style.display = "none";
    return modalName;
}
function returnBackButton(containerName) {
    let backButtonContainer = document.createElement("div");
    backButtonContainer.id = "backButtonCategoryContainer";
    let backButton = document.createElement("button");
    backButton.id = "backbuttonCategory";
    backButton.textContent = "Back to Recipes"
    backButton.addEventListener("click",() => {
        containerName.innerHTML = '';
        containerName.style.display = "none";
    });
    backButtonContainer.appendChild(backButton);
    return backButtonContainer;
}
    

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
    searchBar.placeholder = "Search ingredients";
    searchBar.style.paddingLeft = "10px";
    // searchBar.addEventListener("input", () => {
    //     searchBasedOnInput(searchBar)
    // })
    // searchBar.placeholder.classList.add("dancing-script-text");
    let searchButton = document.createElement("button");
    searchButton.id = "searchButton";
    searchButton.innerHTML = `<ion-icon name="search-outline"></ion-icon>`;
    searchButton.addEventListener("click",async () => { // https://medium.com/@cgustin/tutorial-simple-search-filter-with-vanilla-javascript-fdd15b7640bf

        // console.log(mealsList)
        let searchModal = document.getElementById("searchModal")
        searchModal.innerHTML = ``;
        searchModal.style.display = "block";
        let searchLoader = document.createElement("div")
        searchLoader.id = "searchLoader";
        searchLoader.className = "loader";
        searchLoader.style.display = "block";
        searchModal.appendChild(searchLoader);
        let searchList = []
        searchBar.value.split(",").forEach((searchword)=>{
            searchList.push(searchword.trim())
        })
        console.log(searchList)
        // let mealsList = await searchBasedOnInput(searchBar.value)
        let mealsList = await searchBasedOnInput(searchList)
        setTimeout(() => {
            searchLoader.style.display = "none";
            populateSearchModal(mealsList)
        }, 5000)
    })
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

function populateFooterSection() {
    let footerSection = document.getElementById("footer");
    footerSection.style.display = "none";
    setTimeout(()=> {
        footerSection.style.display = "block";
    }, 3000);
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