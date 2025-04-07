export {getData, searchBasedOnInput, populateSearchModal, populateHeaderSection, returnModal, returnBackButton, displayLoader, populateFooterSection, allIngredientsURL, categorySearchURL}

const allIngredientsURL = "https://www.themealdb.com/api/json/v1/1/list.php?i=list"; // get all recipes based on particular ingredient.
const categorySearchURL = "https://www.themealdb.com/api/json/v1/1/filter.php?i="; // get recipes based on particular category.
const idURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

// function to display loader with parameter in milliseconds.
function displayLoader(timeInMilliseconds) {
    let quoteArrays = ['"Let food be thy medicine and medicine be thy food." - Hippocrates', 
        '"People who love to eat are always the best people." - Julia Child',
        '"The only way to get rid of a temptation is to yield to it." - Oscar Wilde',
        '"First we eat, then we do everything else." - M.F.K. Fisher',
        '"Food should be fun." - Thomas Keller'];
    let animationArrays = ["./bbqGiphy.gif", "./gokGiphy.gif", "./panGiphy.gif", "./playGiphy.gif", "./potGiphy.gif"];
    let loaderScreen = document.createElement("div");
    loaderScreen.id = "loaderScreen";
    let loaderAnimation = document.createElement("div");
    loaderAnimation.id = "loaderAnimation";
    loaderAnimation.innerHTML = `<img src=${animationArrays[Math.floor(Math.random() * animationArrays.length)]} alt="Cooking Gif for you darling!">`; // selects a random gif from the animation array
    let loaderQuote = document.createElement("div");
    loaderQuote.id = "loaderQuote";
    loaderQuote.classList.add("dancing-script-text");
    loaderQuote.innerText = quoteArrays[Math.floor(Math.random() * quoteArrays.length)]; // selects a quote from the quote array
    loaderScreen.append(loaderAnimation, loaderQuote);
    loaderScreen.style.display = "block";
    setTimeout(()=>{ // display for x seconds where x is equal to parameter timeInMilliSeconds.
        loaderScreen.style.display = "none";
    }, timeInMilliseconds);
    document.body.appendChild(loaderScreen);
}

// sets the local storage
function setLocalStorage(localStorageData, localStorageItem) {
    try {
        localStorage.setItem(localStorageItem, JSON.stringify(localStorageData));
    } catch(error) {
        console.error(error);
    }
}

// returns a modal with id equal to its parameter name
function returnModal(name) {
    let modalName = document.createElement("div");
    modalName.id = `${name}` + "Modal";
    modalName.style.display = "none";
    return modalName;
}

// returns a back button inside the loader.
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

// asynchronous function to fetch data based on given parameter url
async function getData(URL) {
    let responseData;
    try {
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

// async function to search for recipes based on list of keywords entered in search input field. {
async function searchBasedOnInput(searchList) {
    let allIngredients = await getData(allIngredientsURL); // get all meals into an object
    var searchResults = new Array()
    allIngredients['meals'].forEach((meal) => { // iterate through the list of ingredients to match the keyword
        for(let searchValue of searchList) {
            if (meal['strIngredient'].toLowerCase().includes(searchValue)){ // if there is match
                fetch(categorySearchURL + meal['strIngredient']) // get details based on id
                .then((response) => {
                    if(response.ok) {
                        return response.json()
                    } else {
                        throw new error("There was a problem trying to fetch the data. Please try again later.") /// or throw an error
                }})
                .then((meallist) => {
                    if (meallist['meals'] != null) {
                    // if (meallist['meals'].length != 0) {
                        // console.log(meallist['meals'])
                    meallist['meals'].forEach((meal) => {
                        searchResults.push(meal)
                    }) } 
                })
            }
        }
        
    })
    return searchResults; 
}

// asynchronous function populate search modal
async function populateSearchModal(mealsList) {
    if(mealsList.length == 0) {
        let badCook = ["./fire-cooking.gif", "./bad-bad-cook.gif"]
        let noMealFound = {
            "strMeal" : "Sorry! No recipes found. Try another ingredient or modify your search",
            "strMealThumb" : `${badCook[Math.floor(Math.random() * badCook.length)]}`
        }
        mealsList.push(noMealFound) // if no recipes found, push this object into the modal.
    }
    let searchModal = document.getElementById("searchModal")
    let searchModalBackButton = returnBackButton(searchModal)
    let modalBody = document.createElement("div");
    (mealsList[0]['strMeal'].includes("Sorry!"))? modalBody.id ="searchModalBodyEmpty" : modalBody.id = "searchModalBody"; // assign the modal body id based on  search results.
    mealsList.forEach((meal) => {
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
        mealCard.addEventListener("click", async () => { // event listener for click of mealCard 
        // await getData(idURL + `${meal['idMeal']}`);
        setLocalStorage((await getData(idURL + `${meal['idMeal']}`))['meals'][0], "randomData"); // set the local storage value to given recipe details.
        window.location.href = "./randomData.html";
        })
    })
    searchModal.append(searchModalBackButton, modalBody)    
}

// function to populate header section of the pages
function populateHeaderSection() {
    let headerSection = document.getElementById("header");
    let logoContainer = document.createElement("div");
    logoContainer.id = "logoContainer";
    logoContainer.innerHTML = "<img src='./MyRecipeFinder.png'>"
    logoContainer.addEventListener("click", () => { // clicking on home should redirect to home page.
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
    searchButton.addEventListener("click",async () => { // https://medium.com/@cgustin/tutorial-simple-search-filter-with-vanilla-javascript-fdd15b7640bf   // clicking on search button should trigger api call 
        let searchModal = document.getElementById("searchModal")
        searchModal.innerHTML = ``;
        searchModal.style.display = "block";
        let searchLoader = document.createElement("div")
        searchLoader.id = "searchLoader";
        searchLoader.className = "loader";
        searchLoader.style.display = "block";
        searchModal.appendChild(searchLoader);
        let searchList = []
        searchBar.value.split(",").forEach((searchword)=>{ // split each word from input field and perform search seperately for each
            searchList.push(searchword.trim())
        })
        // let mealsList = await searchBasedOnInput(searchBar.value)
        let mealsList = await searchBasedOnInput(searchList)
        setTimeout(() => { // display the search loader for 5 seconds before displaying search results.
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

// function to populate the footer section 
function populateFooterSection() {
    let footerSection = document.getElementById("footer");
    footerSection.style.display = "none";
    setTimeout(()=> { // display the footer after 3 seconds of loader screen.
        footerSection.style.display = "block";
    }, 3000);
    let aboutContainer = document.createElement("div");
    aboutContainer.id = "aboutContainer";
    let aboutContentHeading = document.createElement("h1");
    aboutContentHeading.classList.add("corinthia-bold");
    aboutContentHeading.innerText = "About Me";
    let aboutContent = document.createElement("p");
    aboutContent.id = "aboutContent";
    aboutContent.classList.add("dancing-script-text");
    aboutContent.innerText = "Hi, My name is Sethu Maruthi and I'm the creator of My Recipe Finder. I like cooking various recipes that I come across my travels to various new places. Hope you find a recipe that touches your heart and fills you with joy. " + ``;
    aboutContainer.append(aboutContentHeading, aboutContent);
    let contactContainer = document.createElement("div");
    contactContainer.id = "contactContainer";
    let contactContentHeading = document.createElement("h1");
    contactContentHeading.classList.add("corinthia-bold");
    contactContentHeading.innerText = "Contact Me";
    let contactContent = document.createElement("p");
    contactContent.id = "contactContent";
    contactContent.classList.add("dancing-script-text");
    contactContent.innerText = "You can reach out to me at sethumaruthi93@gmail.com."
    contactContainer.append(contactContentHeading, contactContent);
    let copyright = document.createElement("div");
    copyright.id = "copyright";
    copyright.innerHTML = ` &copy; Copyright 2025. All rights reserved.`;
    footerSection.append(aboutContainer, contactContainer, copyright);
}
