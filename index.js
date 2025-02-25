/**
 * Code for Landing page
 */
const URL = "https://pricey-atom-muskox.glitch.me/data";
const videoMQ = window.matchMedia("(max-width: 425px)");//https://stackoverflow.com/questions/44688393/detect-dynamic-media-queries-with-javascript-without-hardcoding-the-breakpoint-w

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBA9klNGF-yGWHsX4XM5SClzrZ8bIIz9Ko",
  authDomain: "recipe-finder-7370d.firebaseapp.com",
  projectId: "recipe-finder-7370d",
  storageBucket: "recipe-finder-7370d.firebasestorage.app",
  messagingSenderId: "513659245680",
  appId: "1:513659245680:web:dc06dcfcddf6ce961890b5"
};

import { getAuth, createUserWithEmailAndPassword,  signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();



window.addEventListener("load", async () => {
    let arrayOfUsers = await getCredentials();
    populateLogin(arrayOfUsers);
});

async function getCredentials() {
    let arrayOfUsers;
    try {
        let response = await fetch(URL, {method : "GET"});
        if (response.ok) {
            localStorage.setItem("arrayOfUsers", JSON.stringify(await response.json())); 
            arrayOfUsers = JSON.parse(localStorage.getItem("arrayOfUsers"));  
            console.log(arrayOfUsers);
        } else {
            throw new Error("Failed to get login data. Please try again after some time.")
        }
        return arrayOfUsers;
    } catch(error) {
        console.log(error.message);
    }
}

function checkCredentials(arrayOfUsers) {
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");
    let isUserPresent = false;
    for(user in arrayOfUsers) {
        if (Object.values(arrayOfUsers[user]).includes(emailInput.value) && Object.values(arrayOfUsers[user]).includes(passwordInput.value)) {
            isUserPresent = true;
        }
    };
    return isUserPresent;
}

async function postCredentials(userDetails) {
    try {
        let response = await fetch(URL, {
            method : "POST",
            headers : {"content-type" : "application/json"},
            body : JSON.stringify(userDetails)
        });
        if (response.ok) {
            console.log("Data saved successfully");
            return true;
        } else {
            throw new Error("Failed to save user data. Please try again after some time.");
        }
    } catch(error) {
        console.error(error.message);
    }
}

function populateLogin(arrayOfUsers) {
    let mainContainer = document.getElementById("maincontainer");
    let videoContainer = document.createElement("div");
    videoContainer.id = "videoContainer";
    videoMQ.addEventListener("change", (event) => {
        if(event.matches) {
            videoContainer.innerHTML = `<video autoplay loop muted width="100%"><source src="./loginvideolong.mp4" type="video/mp4"></video>`; // Video needs to muted in order for it to be autoplayed.
        } else {
            videoContainer.innerHTML = `<video autoplay loop muted width="100%"><source src="./loginvideo.mp4" type="video/mp4"></video>`; // Video needs to muted in order for it to be autoplayed.
        }
    })
    let divContainer = document.createElement("div");
    divContainer.id = "divContainer";
    let loginEmail = document.createElement("input");
    let loginPass = document.createElement("input");
    let signUpLink = document.createElement("a");
    signUpLink.id = "signUpLink";
    let forgotPasswordLink = document.createElement("a");
    forgotPasswordLink.id = "forgotPasswordLink";
    forgotPasswordLink.innerText = "I forgot my password!";
    signUpLink.innerText = "Sign Up!";
    loginEmail.setAttribute("type", "text");
    loginEmail.id = "email";
    loginPass.setAttribute("type", "password");
    loginPass.id = "password";
    loginEmail.setAttribute("placeholder", "Enter your email");
    loginPass.setAttribute("placeholder", "Enter your password");
    let button = document.createElement("button");
    button.id = "loginbutton";
    button.innerText = "Click me";
    let loginError = document.createElement("div");
    loginError.className = "loginError";
    loginError.innerText = "Invalid Credentials. Please check your credentials and try again."
    let messageContainer = document.createElement("div");
    messageContainer.id = "messageContainer";
    messageContainer.innerText = "Welcome back to the club!!";
    messageContainer.style.display = "none";
    divContainer.append(loginError, loginEmail, loginPass, button, signUpLink, forgotPasswordLink, messageContainer);
    mainContainer.append(videoContainer, divContainer);
    document.body.appendChild(mainContainer);

    button.addEventListener("click", () => {
    //     if (checkCredentials(arrayOfUsers)) {
    //     window.location.href = "./home.html";
    // } else if (!checkCredentials(arrayOfUsers)) {
        signInWithEmailAndPassword(auth, loginEmail.value, loginPass.value)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log(email,password)
                // messageContainer.style.display = "block";
                // setTimeout(5000, () => {
                //     messageContainer.style.display = "none";
                // })
                window.location.href = "./home.html";
                loginEmail.value = ""
                loginPass.value = ""
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                loginError.style.display = "block";
            });
    });

    populateForgotPassword(mainContainer, divContainer, forgotPasswordLink, arrayOfUsers, signUpLink);

    populateSignUp(mainContainer, divContainer, signUpLink, arrayOfUsers, forgotPasswordLink);
}

function populateSignUp(mainContainer, divContainer, signUpLink, arrayOfUsers, forgotPasswordLink) {    
    signUpLink.addEventListener("click", () => {
        divContainer.innerHTML = ''
        let signEmail = document.createElement("input");
        signEmail.id = "email";
        signEmail.setAttribute("type", "text");
        signEmail.setAttribute("placeholder", "Enter your username");
        let emailError = document.createElement("p");
        emailError.innerText = "Username must contain one small letter and one capital letter";
        emailError.classList.add("loginError");
        let signPass = document.createElement("input");
        signPass.setAttribute("type", "password");
        signPass.id = "password";
        signPass.setAttribute("placeholder", "Enter your password");
        let passError = document.createElement("p");
        passError.innerText = "Password must be 8 characters long, contain one small letter, one capital letter and one integer from 0-9";
        passError.classList.add("loginError");
        let text = document.createElement("p");
        let button = document.createElement("button");
        button.id = "signbutton";
        button.innerText = "Sign up!";
        button.addEventListener("click", () => {
            // if(checkCredentials(arrayOfUsers)) {
            //     text.innerText = "Looks like you're already a member. Refresh the page to login or if you don't remember it, click the forgot password link below."
            // } else {
                createUserWithEmailAndPassword(auth, signEmail.value, signPass.value)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    if(postCredentials(Object({"username" : `${signEmail.value}`, "password" : `${signPass.value}`}))) {
                    text.innerText = "We got your credentials. You can refresh the page to login.";
    } else {
                    text.innerText = "Uh-oh! we are unable to save your credentials due to a technical issue. Try again after some time.";
    }
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
        })
        signEmail.addEventListener("input", () => {
            if (!signEmail.value.match(/^[a-zA-Z]+$/)) {
            // if(regSmall.test(signEmail.value) && regBig.test(signEmail.value) && regInt.test(signEmail.value)) {
                emailError.style.display = "none";
            } else {
                emailError.style.display = "block";
            }
        })
        signPass.addEventListener("input", () => {
            if (signPass.value.match(/^[a-zA-Z0-9!@#]{8,}$/)) {
                // if(regSmall.test(signEmail.value) && regBig.test(signEmail.value) && regInt.test(signEmail.value)) {
                    passError.style.display = "none";
                } else {
                    passError.style.display = "block";
                }
        })
        divContainer.append(signEmail, emailError, signPass, passError, text, button, forgotPasswordLink);
        mainContainer.appendChild(divContainer);
    })

    
}

function populateForgotPassword(mainContainer, divContainer, forgotPasswordLink, arrayOfUsers, signUpLink) {
    forgotPasswordLink.addEventListener("click", () => {
        divContainer.innerHTML = ''
        let loginEmail = document.createElement("input");
        loginEmail.id = "email";
        loginEmail.setAttribute("type", "text");
        loginEmail.setAttribute("placeholder", "Enter your email");
        let passwordText = document.createElement("div");
        let secretPass = document.createElement("p");
        passwordText.className = "showPassword";
        passwordText.innerText = "We're gonna display your password for 5 seconds on the screen. Note it down before it's gone. Once done, refresh the page to go back to login."
        passwordText.appendChild(secretPass);
        let button = document.createElement("button");
        button.id = "forgotbutton";
        button.innerText = "Show me!";
        button.addEventListener("click", () => {
            // console.log(arrayOfUsers)
            for(let user of arrayOfUsers) {
                // console.log(user['username'] == loginEmail.value);
                // if(Object.values(arrayOfUsers[user]).includes(loginEmail.value)) {
                if(user['username'] == loginEmail.value) {
                    // secretPass.textContent = `Your password is : ${arrayOfUsers[user]['password']}`;
                    secretPass.textContent = `Your password is : ${user['password']}`;
                    setTimeout(() => {
                        secretPass.style.display = "none";
                    }, 5000);
                    break;
                } else {
                    secretPass.textContent = "Looks like you are not in the club.";
                    signUpLink.style.display = "block";
                }
                }       
        });
        divContainer.append(loginEmail, button, passwordText, signUpLink);
        mainContainer.appendChild(divContainer);
    })
}





