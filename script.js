const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~!@#$%^&*(){}[]:"|+=_-/.>,<`'

let password = "";
let passwordlength = 8;
let checkCount = 0;
handleSlider();
// set data-indicator circle color to grey

// handleSlider() ...
// copyContent()
// generatePassword()
// setIndicator()...
// getRandomInteger(min , max)...
// getRandomUppercase() ...
// getRandomLowercase() ...
// getRandomNumbers() ...
// getRandomSymbols() ...
// calcStrength() ...

// Set password length
function handleSlider() {
    inputSlider.value = passwordlength;
    lengthDisplay.innerHTML = passwordlength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomUppercase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function getRandomLowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function getRandomNumbers() {
    return getRandomInteger(0, 9);
}

function getRandomSymbols() {
    const randomNum = getRandomInteger(0 , symbols.length);
    return symbols.charAt(randomNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasLower && hasUpper && hasNum && hasSym && passwordlength > 7) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordlength > 5) {
        setIndicator("#ff0");
    }
    else setIndicator("#f00");
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    // TO MAKE VISIBLE THE SPAN OF COPY
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.innerText = "";
        // copyMsg.classList.remove("active");
    }, 1000);
}

//shuffle array
function shufflePassword(array) {
    // fishing yates method
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((element) => (str += element));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    })

    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }
}

// listeners on checkbox
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// work of slider
inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleSlider();
})

// 
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

// 
generateBtn.addEventListener('click', () => {
    // none of the checkbox is checked
    if (checkCount == 0)
        return;

    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }

    // let's find the new password
    console.log("start");

    // remove old pass
    password = "";

    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(getRandomUppercase);
    if (lowercaseCheck.checked) funcArr.push(getRandomLowercase);
    if (numbersCheck.checked) funcArr.push(getRandomNumbers);
    if (symbolsCheck.checked) funcArr.push(getRandomSymbols);

    // compulsary addition
    for (let i = 0; i < funcArr.length; i++) password += funcArr[i]();
    console.log("compulsary");

    // remaining addition
    for (let i = 0; i < passwordlength - funcArr.length; i++) {
        let randIndex = getRandomInteger(0, funcArr.length);
        console.log("randindex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining");

    // shuffle the password
    password = shufflePassword(Array.from(password));
    // show password
    passwordDisplay.value = password;
    console.log("shuffle");
    // calc strength
    calcStrength();
})