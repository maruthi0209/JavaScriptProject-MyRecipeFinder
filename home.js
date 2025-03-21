/**
 * Code for Home page
 */

// import the contents of importexport.js file
import { searchBasedOnInput, populateSearchModal, populateHeaderSection, getData, allIngredientsURL, categorySearchURL, returnBackButton, returnModal, displayLoader, populateFooterSection } from "./importexport.js";

const categoryURL = "https://pricey-atom-muskox.glitch.me/categories";
const ingredientURL = "https://pricey-atom-muskox.glitch.me/ingredient";
const randomURL = "https://pricey-atom-muskox.glitch.me/random";
const alphabetURL = "https://www.themealdb.com/api/json/v1/1/search.php?f=";
// array of alphabets created dynamically using below formula.
const alphabetArray = [...Array(26)].map((_, i) => String.fromCharCode(i + 65));  // source : https://hasnode.byrayray.dev/how-to-generate-an-alphabet-array-with-javascript
const areaURL = "https://www.themealdb.com/api/json/v1/1/filter.php?a=";
const idURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
// a map containing countries as key and respective flags as values.
const listOfCountries = new Map([["American", 'https://www.countryflags.com/wp-content/uploads/united-states-of-america-flag-png-large.png'], // source : https://www.countryflags.com/
["British", 'https://www.countryflags.com/wp-content/uploads/united-kingdom-flag-png-large.png'], 
["Canadian", 'https://www.countryflags.com/wp-content/uploads/canada-flag-png-large.png'], 
["French", 'https://www.countryflags.com/wp-content/uploads/france-flag-png-large.png'], 
["Spanish", 'https://www.countryflags.com/wp-content/uploads/spain-flag-png-large.png'], 
["Italian", 'https://www.countryflags.com/wp-content/uploads/italy-flag-png-large.png'], 
["Japanese", 'https://www.countryflags.com/wp-content/uploads/japan-flag-png-large.png'], 
["Greek", 'https://www.countryflags.com/wp-content/uploads/greece-flag-png-large.png'], 
["Turkish", 'https://www.countryflags.com/wp-content/uploads/turkey-flag-png-large.png'], 
["Russian", 'https://www.countryflags.com/wp-content/uploads/russia-flag-png-large.png'], 
["Indian", 'https://www.countryflags.com/wp-content/uploads/india-flag-png-large.png'], 
["Chinese", 'https://www.countryflags.com/wp-content/uploads/china-flag-png-large.png'], 
["Mexican", 'https://www.countryflags.com/wp-content/uploads/mexico-flag-png-large.png']]);

// On window load, perform the following
window.addEventListener("load", () => {
        displayLoader(5000);
        populateHeaderSection();
        populateMainSection();
        populateFooterSection();
})

// function to set the local storage with recipe information
function setLocalStorage(localStorageData, localStorageItem) {
    try {
        localStorage.setItem(localStorageItem, JSON.stringify(localStorageData));
    } catch(error) {
        console.error(error);
    }
}

// function to populate the main section
function populateMainSection() {
    let mainSection = document.getElementById("mainContainer");
    mainSection.style.display = "none";
    setTimeout(()=> {
        mainSection.style.display = "block"; // display the contents after 3 seconds
    }, 3000);
    let searchModal = returnModal("searchModal");
    searchModal.id = "searchModal";
    let categoryContainer = document.createElement("div");
    categoryContainer.id = "categoryContainer";
    let ingredientContainer = document.createElement("div");
    ingredientContainer.id = "ingredientContainer";
    let randomContainer = document.createElement("div");
    randomContainer.id = "randomContainer";
    let alphabetContainer = document.createElement("div");
    alphabetContainer.id = "alphabetContainer";
    let areaContainer = document.createElement("div");
    areaContainer.id = "areaContainer";

    populateCategorySection(categoryContainer);
    populateIngredientSection(ingredientContainer);
    populateRandomSection(randomContainer);
    populateAlphabetSection(alphabetContainer);
    populateAreaSection(areaContainer);
    mainSection.append(searchModal, categoryContainer, ingredientContainer, randomContainer, alphabetContainer, areaContainer);
}

// function to populate category section 
async function populateCategorySection(categoryContainer) {
    let categoryData = await getData(categoryURL);
    let categoryTitle = document.createElement("div");
    categoryTitle.id = "categoryTitle";
    categoryTitle.classList.add("corinthia-bold");
    categoryTitle.innerText = "Popular Categories";
    let categoryModal = returnModal("category");
    let categoryCardContainer = document.createElement("div");
    categoryCardContainer.id = "categoryCardContainer";
    categoryContainer.append(categoryTitle, categoryModal, categoryCardContainer);
    categoryData.forEach(async category => {
        let listOfRecipes = await getData(categorySearchURL + `${category['strCategory']}`)
        let categoryCard = document.createElement("div");
        categoryCard.id = "categoryCard" + `${category['strCategory']}`;
        categoryCard.classList.add("categoryCard");
        let categoryImgContainer = document.createElement("div");
        categoryImgContainer.id = "categoryImgContainer"+ `${category['strCategory']}`;
        categoryImgContainer.classList.add("categoryImgContainer");
        let categoryImg = document.createElement("img");
        categoryImg.src = `${category['strCategoryThumb']}`;
        categoryImgContainer.appendChild(categoryImg);
        let categoryTitleContainer = document.createElement("div");
        categoryTitleContainer.id = "categoryTitleContainer"+ `${category['strCategory']}`;
        categoryTitleContainer.innerText = `${category['strCategory']}`;
        categoryTitleContainer.classList.add("corinthia-regular");
        categoryTitleContainer.classList.add("categoryTitleContainer");
        categoryCard.append(categoryImgContainer, categoryTitleContainer);
        categoryCardContainer.appendChild(categoryCard);
        categoryCard.addEventListener("click", () => { // event listener when category card is clicked
            categoryModal.style.display = "block";
            displayCategoryModal(categoryModal, category, listOfRecipes);
            document.body.style.position = "float"; //https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
            // document.body.style.top = `-${window.scrollY}px`;
        });
    });
}

// function to display category modal 
function displayCategoryModal(categoryModal, category, listOfRecipes) {
    categoryModal.innerHTML = '';
    let backButtonContainer = returnBackButton(categoryModal);
    let contentContainer = document.createElement("div");
    contentContainer.id = "contentContainerCategory" + `${category['strCategory']}`;
    contentContainer.classList.add("strCategoryThumbContainer");
    contentContainer.classList.add("dancing-script-text");
    contentContainer.innerHTML = `${category['strCategoryDescription']}`;
    let contentContainerRecipes = document.createElement("div");
    contentContainerRecipes.id = "contentContainerRecipes";
    contentContainer.appendChild(contentContainerRecipes);
    listOfRecipes['meals'].forEach( async meal => {
        let strCategoryRecipes = document.createElement("div");
        strCategoryRecipes.id = "strCategoryRecipes"+ `${meal['strMeal']}`;
        strCategoryRecipes.classList.add("dancing-script-text");
        strCategoryRecipes.classList.add("strCategoryRecipes");
        let strCategoryRecipesText = document.createElement("div");
        strCategoryRecipesText.classList.add("strCategoryRecipesText");
        strCategoryRecipesText.innerText = `${meal['strMeal']}`;
        let strCategoryThumbContainer = document.createElement("div");
        strCategoryThumbContainer.id = "strCategoryThumbContainer" + `${meal['strMeal']}`;
        strCategoryThumbContainer.innerHTML = `<img src=${meal['strMealThumb']}>`;
        strCategoryRecipes.append(strCategoryThumbContainer, strCategoryRecipesText);
        contentContainerRecipes.appendChild(strCategoryRecipes);
        strCategoryRecipes.addEventListener("click", async () => { // event listener for clicking each of the category recipes.
            await getData(idURL + `${meal['idMeal']}`);
            setLocalStorage((await getData(idURL + `${meal['idMeal']}`))['meals'][0], "randomData"); // sets local storage with recipe details.
            window.location.href = "./randomData.html";
        });
    });
    // contentContainer.append(strCategory, strCategoryDescription);//, strCategoryThumbContainer);
    categoryModal.append(backButtonContainer, contentContainer);
}

// function to populate ingredient section 
async function populateIngredientSection(ingredientContainer) {
    let ingredientData = await getData(ingredientURL);
    let ingredientTitle = document.createElement("div");
    ingredientTitle.id = "ingredientTitle";
    ingredientTitle.innerText = "Popular Recipes";
    ingredientTitle.classList.add("corinthia-bold");
    let ingredientCardContainer = document.createElement("div");
    ingredientCardContainer.id = "ingredientCardContainer";
    ingredientContainer.appendChild(ingredientTitle);
    ingredientData.forEach(async ingredient => {
        let ingredientRecipeInfo = await getData(idURL + `${ingredient['idMeal']}`);
        let ingredientCard = document.createElement("div");
        ingredientCard.id = "ingredientCard" + `${ingredient['idMeal']}`;
        ingredientCard.classList.add("ingredientCard");
        let ingredientImgContainer = document.createElement("div");
        ingredientImgContainer.id = "ingredientImgContainer";
        let ingredientImg = document.createElement("img");
        ingredientImg.src = `${ingredient['strMealThumb']}`;
        ingredientImgContainer.appendChild(ingredientImg);
        let ingredientTitleContainer = document.createElement("div");
        ingredientTitleContainer.id = "ingredientTitleContainer";
        ingredientTitleContainer.innerText = `${ingredient['strMeal']}`;
        ingredientTitleContainer.classList.add("dancing-script-text");
        ingredientCard.append(ingredientImgContainer, ingredientTitleContainer);
        ingredientCardContainer.appendChild(ingredientCard);
        ingredientContainer.appendChild(ingredientCardContainer);
        ingredientCard.addEventListener("click", () => { // event listener when ingredient card is clicked.
            setLocalStorage(ingredientRecipeInfo['meals'][0], "randomData"); // set local storage with recipe details.
            window.location.href = "./randomData.html";
        });
    });
}

// function to populate random section
async function populateRandomSection(randomContainer) {
    let randomDataArray = await getData(randomURL);
    setTimeout(() => { // populate this section after 2 seconds of window load.
        let randomData = randomDataArray[Math.floor(Math.random() * 6)]; // source: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript // get a random recipe from available ones in glitch repo
        if (randomData == undefined) { // if there is delay in fetching data from glitch repo, reload the window.
            window.location.reload();
        } else {
            let randomTitle = document.createElement("div");
            randomTitle.id = "randomTitle";
            randomTitle.classList.add("corinthia-bold");
            randomTitle.innerText = "Recipe of the Day!" ;
            let randomRecipeName = document.createElement("div");
            randomRecipeName.id = "randomRecipeName";
            randomRecipeName.classList.add("dancing-script-text");
            randomRecipeName.innerText = `${randomData['strMeal']}`;
            let randomImgContainer = document.createElement("div");
            randomImgContainer.id = "randomImgContainer";
            randomImgContainer.innerHTML = `<img src=${randomData['strMealThumb']}>`
            randomContainer.append(randomTitle, randomRecipeName, randomImgContainer);
            randomContainer.addEventListener("click", () => { // event handler for clicking random container
                setLocalStorage(randomData, "randomData"); // set the local storage with random recipe details
                window.location.href = "./randomData.html";
            });
            }
    }, 2000);
}

// function to populate the alphabet section
function populateAlphabetSection(alphabetContainer) {
    let alphabetTitle = document.createElement("div");
    alphabetTitle.id = "alphabetTitle";
    alphabetTitle.innerText = "Select cuisines based on alphabets.";
    alphabetTitle.classList.add("corinthia-bold");
    let alphabetModal = returnModal("alphabet");
    let alphabetCardContainer = document.createElement("div");
    alphabetCardContainer.id = "alphabetCardContainer";
    alphabetContainer.append(alphabetTitle, alphabetModal);
    alphabetArray.forEach(alphabet => {
        let alphabetCard = document.createElement("div");
        alphabetCard.id = "alphabetCard" + `${alphabet}`;
        alphabetCard.innerText = `${alphabet}`;
        alphabetCard.classList.add("alphabetCard");
        alphabetCard.classList.add("dancing-script-text");
        alphabetCardContainer.appendChild(alphabetCard);
        alphabetContainer.appendChild(alphabetCardContainer);
        alphabetCard.addEventListener("click", async () => { // event handler for clicking alphabet card
            let alphabetData = await getData(alphabetURL + alphabet); // fetch the details as per the alphabet
            alphabetModal.style.display = "block";
            displayAlphabetModal(alphabetModal, alphabetData);
        });
    });  
}

// function to display alphabet modal
function displayAlphabetModal(alphabetModal, alphabetData) {
    alphabetModal.innerHTML = ``; // in order to newly display the details everytime without adding to existing details in modal.
    let backButtonContainer = returnBackButton(alphabetModal);
    alphabetModal.appendChild(backButtonContainer);
    let contentContainer = document.createElement("div");
    contentContainer.id = "contentContainerAlphabet";
    if (alphabetData['meals'] == null) { // if there are no recipes to be displayed.
        contentContainer.classList.add("dancing-script-text");
        contentContainer.style.textAlign = "center";
        contentContainer.style.fontSize = "1.5rem";
        contentContainer.innerText = "Sorry! No available recipes. Try another alphabet."
        alphabetModal.appendChild(contentContainer);
    } else { // if there are recipes to be displayed.
        alphabetData['meals'].forEach(meal => {
            let alphabetCard = document.createElement("div");
            alphabetCard.id = "alphabetCard";
            let mealName = document.createElement("div");
            mealName.id = "mealName";
            mealName.classList.add("dancing-script-text");
            // mealName.innerText = `${meal['strMeal']}`;
            mealName.innerHTML = `${meal['strMeal']} <br> Category : ${meal['strCategory']}`;
            // let mealCategory = document.createElement("div");
            // mealCategory.id = "mealCategory";
            // mealCategory.classList.add("dancing-script-text");
            // mealCategory.innerText = `Category : ${meal['strCategory']}`;
            let strMealThumbcontainer = document.createElement("div");
            strMealThumbcontainer.id = "alphabetThumbContainer";
            strMealThumbcontainer.innerHTML = `<img src=${meal['strMealThumb']}> <hr>`;
            alphabetCard.append(strMealThumbcontainer, mealName);
            alphabetCard.addEventListener("click", () => { // event handler for clicking alphabet card
                setLocalStorage(meal, "randomData"); // set the local storage with recipe details.
                window.location.href = "./randomData.html";
            });
            contentContainer.appendChild(alphabetCard);
            alphabetModal.appendChild(contentContainer);
        });    
    }
}

// function to display area section 
function populateAreaSection(areaContainer) {
    let areaTitle = document.createElement("div");
    areaTitle.id = "areaTitle";
    areaTitle.innerText = "Select cuisines by nation";
    areaTitle.classList.add("corinthia-bold");
    let areaModal = returnModal("area");
    areaContainer.append(areaTitle, areaModal);
    let areaCardContainer = document.createElement("div");
    areaCardContainer.id = "areaCardContainer";
    listOfCountries.forEach((value, key) => {
        let areaCard = document.createElement("div");
        areaCard.id = "areaCard" + `${key}`;
        areaCard.innerHTML = `<img src=${value}>`;
        areaCard.classList.add("areaCard");
        areaCard.addEventListener("click", async () => { // event handler when area card is clicked
            let areaData = await getData(areaURL + `${key}`);
            areaModal.style.display = "block";
            displayAreaModal(areaModal, areaData);
        });
        areaCardContainer.appendChild(areaCard);
        areaContainer.appendChild(areaCardContainer);
    });
}

// function to display area modal
function displayAreaModal(areaModal, areaData) {
    areaModal.innerHTML = ``;
    let backButtonContainer = returnBackButton(areaModal);
    areaModal.appendChild(backButtonContainer);
    let contentContainer = document.createElement("div");
    contentContainer.id = "contentContainerArea"; 
    areaData['meals'].forEach(meal => {
        let mealsCard = document.createElement("div");
        mealsCard.id = "mealsCard";
        let mealName = document.createElement("div");
        mealName.id = "mealName";
        mealName.classList.add("dancing-script-text");
        mealName.innerText = `${meal['strMeal']}`
        let mealThumb = document.createElement("div");
        mealThumb.id = "mealThumb";
        mealThumb.innerHTML = `<img src=${meal['strMealThumb']}>`;
        mealsCard.append(mealThumb, mealName);
        mealsCard.addEventListener("click", async () => {  // event handler for clicking mealscard
            let mealId = await getData(idURL + `${meal['idMeal']}`);
            console.log(mealId)
            setLocalStorage(mealId['meals'][0], "randomData"); // set local storage with recipe details.
            window.location.href = "./randomData.html";
        });
        contentContainer.appendChild(mealsCard);
    });
    areaModal.appendChild(contentContainer);
}
