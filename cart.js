/**
 *  Code for Cart page
 */
import { searchBasedOnInput, populateSearchModal, populateHeaderSection, getData, allIngredientsURL, categorySearchURL, returnBackButton, returnModal, displayLoader, populateFooterSection } from "./importexport.js";

class cook {
    name;
    price; 
    userQuantity; 
    image; 
    ref;
    constructor(name, price, userQuantity, image, ref) {
        this.name = name;
        this.price = price;
        this.userQuantity = userQuantity;
        this.image = image;
        this.ref = ref;
    }};
var andy = new cook("andy", 69, 0, "https://cookdinehost.com/cdn/shop/files/ANDYCOOKSFRONTCOVER_Edited.jpg?v=1693440960&width=1000", "https://cookdinehost.com/products/andy-cooks-the-cookbook?utm_source=Website&utm_medium=Menu&utm_campaign=Cookbook");
var gary = new cook("gary", 89, 0, "https://m.media-amazon.com/images/I/51e4jQDr8rL.jpg", "https://www.amazon.in/Favourites-Over-Recipes-Cook-Home/dp/1921383305");
var roger = new cook("roger", 49, 0, "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSfU7F05Yn0WX0LvxK8qsh2gznBJcqE_S_YKCAImU9LRloXi7v0LDmPPvZXqiY8Wv0J5PzN", "https://www.amazon.com/Use-Your-Finger-rice-cooking/dp/B08VYR29FW");
const cooks = [andy, gary, roger];

window.addEventListener("load", () => {
    displayLoader(3000)
    populateHeaderSection();
    populateMainSection();
    populateFooterSection();
});

function populateMainSection() {
    let mainSection = document.getElementById("mainContainer");
    let searchModal = returnModal("searchModal");
    searchModal.id = "searchModal";
    let sectionHeader = document.createElement("div");
    sectionHeader.id = "cartSectionHeader";
    sectionHeader.classList.add("dancing-script-text");
    sectionHeader.innerText = "Choose from our collection of best cookbooks!."
    let itemsTable = document.createElement("table");
    itemsTable.id = "itemsTable";
    let itemsTablehead = document.createElement("tr");
    itemsTablehead.id = "itemsTableHead";
    let itemsTableBook = document.createElement("th");
    itemsTableBook.id = "itemsTableBook";
    itemsTableBook.innerText = "Cookbooks";
    itemsTableBook.classList.add("dancing-script-text");
    let itemsTablePrice = document.createElement("th");
    itemsTablePrice.id = "itemsTablePrice";
    itemsTablePrice.classList.add("dancing-script-text");
    itemsTablePrice.innerText = "Price";
    let itemsTableQuantity = document.createElement("th");
    itemsTableQuantity.id = "itemsTableQuantity";
    itemsTableQuantity.classList.add("dancing-script-text");
    itemsTableQuantity.innerText = "Quantity";
    let itemsTableIndividualCost = document.createElement("th");
    itemsTableIndividualCost.id = "itemsTableIndividualCost";
    itemsTableIndividualCost.classList.add("dancing-script-text");
    itemsTableIndividualCost.innerText = "Total Cost";
    let cartTotalAmount = document.createElement("tr");
    cartTotalAmount.id = "cartTotalAmount";
    cartTotalAmount.classList.add("itemsTableRow");
    let cartTotalText = document.createElement("td");
    cartTotalText.setAttribute("colspan", "2");
    cartTotalText.classList.add("dancing-script-text");
    cartTotalText.innerText = "Grand Total";
    let cartTotalQuantity = document.createElement("td");
    cartTotalQuantity.id = "cartTotalQuantity";
    cartTotalQuantity.innerText = "$0";
    cartTotalQuantity.classList.add("dancing-script-text");
    let cartTotalAmountColumn = document.createElement("td");
    cartTotalAmountColumn.id = "cartTotalAmountColumn";
    cartTotalAmountColumn.classList.add("dancing-script-text");
    cartTotalAmountColumn.innerText = `$0`;
    cartTotalAmount.append(cartTotalText, cartTotalQuantity, cartTotalAmountColumn);
    let buyNowButtonRow = document.createElement("tr");
    buyNowButtonRow.id = "buyNowButtonRow";
    let buyNowButton = document.createElement("td");
    buyNowButton.id = "buyNowButton";
    buyNowButton.setAttribute("colspan" , "4");
    buyNowButton.innerHTML = `<button>Buy Now!!</button>`;
    buyNowButton.classList.add("dancing-script-text");
    buyNowButtonRow.appendChild(buyNowButton);
    itemsTablehead.append(itemsTableBook, itemsTablePrice, itemsTableQuantity, itemsTableIndividualCost);
    itemsTable.appendChild(itemsTablehead);
    cooks.forEach((cook) => {
        itemsTable.appendChild(getItemsTableRows(cook, cartTotalAmountColumn, cartTotalQuantity));
    });

    itemsTable.append(cartTotalAmount, buyNowButtonRow);
    mainSection.append(searchModal, sectionHeader, itemsTable);
    buyNowButtonRow.addEventListener("click", () => {
        mainSection.innerHTML = ``;
        let delivery = document.createElement("div");
        delivery.id = "delivery";
        delivery.classList.add("dancing-script-text");
        delivery.innerHTML = `<img src="./delivery.gif" alt="delivery gif">`;
        let deliveryText = document.createElement("p");
        deliveryText.innerText = "We will deliver your product shortly. Refresh this page to go back to cart page."
        delivery.appendChild(deliveryText);
        mainSection.appendChild(delivery);
    });
}

let getItemsTableRows = function (cook, cartTotalAmountColumn, cartTotalQuantity) {
    let itemsTableRow = document.createElement("tr");
    itemsTableRow.className = "itemsTableRow";
    itemsTableRow.id = "itemsTableRow" + `${cook['name']}`;
    let itemsTableBook = document.createElement("td");
    itemsTableBook.id = "itemsTableBook" + `${cook['name']}`;
    itemsTableBook.innerHTML = `<img src=${cook['image']}>`;
    let itemsTablePrice = document.createElement("td");
    itemsTablePrice.id = "itemsTablePrice" + `${cook['price']}`
    itemsTablePrice.classList.add("dancing-script-text");
    itemsTablePrice.innerHTML = `$${cook['price']}`;
    let itemsTableIndividualCost = document.createElement("td");    
    itemsTableIndividualCost.id = "itemsTableTotalCost" + `${cook['name']}`;
    let itemsTableQuantity = document.createElement("td");
    itemsTableQuantity.id = "itemsTableQuantity" + `${cook['name']}`;
    itemsTableQuantity.classList.add("dancing-script-text");
    let plusButton = document.createElement("button");
    plusButton.id = `${cook['name']}` + "plus";
    plusButton.innerText = " + ";
    plusButton.addEventListener("click", () => {
        cook['userQuantity'] += 1; 
        quantityDisplay.innerHTML = `${cook['userQuantity']}`;
        itemsTableIndividualCost.innerHTML = `$${(cook['price'] * cook['userQuantity'])}`;
        let quant = 0
        let total = 0;
        cooks.forEach((element) => {
            quant += element['userQuantity']
            total += element['userQuantity'] * element['price'];
        })
        cartTotalQuantity.innerHTML = `${quant}`;
        cartTotalAmountColumn.innerHTML = `$${total};`
    });
    let minusButton = document.createElement("button");
    minusButton.id = `${cook['name']}` + "minus";
    minusButton.innerText = " - ";
    minusButton.addEventListener("click", () => {
        (cook['userQuantity'] === 0) ? 0 : (cook['userQuantity'] -= 1);
        quantityDisplay.innerHTML = `${cook['userQuantity']}`;
        itemsTableIndividualCost.innerHTML = `$${(cook['price'] * cook['userQuantity'])}`;
        let quant = 0; let total = 0;
        cooks.forEach((element) => {
            quant += element['userQuantity']
            total += (element['userQuantity'] * element['price']);
        })
        cartTotalQuantity.innerHTML = `${quant}`;
        cartTotalAmountColumn.innerHTML = `$${total}`;
    });
    let quantityDisplay = document.createElement("div");
    quantityDisplay.id = "quantityDisplay";
    quantityDisplay.innerHTML = `${cook['userQuantity']}`;
    itemsTableQuantity.append(plusButton, quantityDisplay, minusButton);
    itemsTableIndividualCost.innerHTML = `$${(cook['price'] * cook['userQuantity'])}`;
    itemsTableIndividualCost.classList.add("dancing-script-text");
    itemsTableIndividualCost.classList.add("individualTotals");
    itemsTableRow.append(itemsTableBook, itemsTablePrice, itemsTableQuantity, itemsTableIndividualCost);
    return itemsTableRow;    
}