// Lucas DePaola, 2023
// not a component, created from scratch, if using this code a citation would be appreciated.
//
//
const typeDiv = document.getElementById("typing");
const containerDiv = document.getElementById("wordList");
const cursorDiv = document.getElementById("cursor");
let englishWords = grabEnglishWords();
let clickCount = 0;
let keyIndex = 0;
let englishWordString = "";
let percent = 0;
let startTime;
let endTime;
let testStarted = false;

function grabEnglishWords() {
  fetch("./en200.txt")
    .then((words) => {
      words.text()
        .then((eng) => {
          englishWords = eng;
          englishWords = englishWords.split(/\r?\n/);
        });
    });
}

function getTest(wordCount) {
  const test = [];
  for (let i = 0; i < wordCount; i++) {
    test.push(englishWords[generateRandomNumber(199)]);
  }
  return test;
}

function generateRandomNumber(max) { // get random number for english words.
  return Math.ceil(Math.random() * max);
}

typeDiv.addEventListener("click", () => {
  startTest(); //create the test.
  createInputListener(); // create the keyboard event detector.
  cursorDiv.style.left = (containerDiv.getBoundingClientRect().left + 5) + "px"; //constant cursor due to tape mode being enabled.
  cursorDiv.style.top = (containerDiv.getBoundingClientRect().top + 12) + "px";
});

function startTest() {
  document.getElementById("wpmoutput").innerText = ""; //get rid of typing test prompt.
  testStarted = false;
  percent = 0;
  containerDiv.style.transform = "translateX(" + 0 + "%)";
  keyIndex = 0;
  englishWordString = "";
  containerDiv.innerHTML = "";
  const wordTestList = getTest(25);
  containerDiv.innerText = "";
  containerDiv.style.marginLeft = "0%";
  typeDiv.style.marginLeft = "50%";
  for (let i = 0; i < wordTestList.length; i++) {
    containerDiv.innerHTML += wordTestList[i] + " ";
    englishWordString += wordTestList[i] + " ";
  }
  englishWordString = englishWordString.slice(0, -1);
  clickCount++;
}

function calculateWpm() { // based on the typing test standard of 5 characters per word.
  const timeInSeconds = (endTime - startTime) / 1000;
  return (keyIndex / 5) / timeInSeconds * 60;
}

function createInputListener() {
  if (clickCount > 1) return;
  document.addEventListener("keydown", (key) => {
    if (!testStarted) { //on keydown event, if the test is not started, set the date for the test.
      startTime = new Date();
      testStarted = true;
    }
    if (key.key === englishWordString[keyIndex]) {
      keyIndex++;
      percent -= (1 / englishWordString.length) * 100;
      containerDiv.style.transform = "translateX(" + percent + "%)";
      if (keyIndex >= englishWordString.length) {
        endTime = new Date();
        const wpm = calculateWpm();
        document.getElementById("wpmoutput").innerText += "your wpm is " +
          Math.round(wpm);
      }
    } else if (
      key.key === "Escape" || key.key === "Tab" || key.key === "Control"
    ) {
      endTime = new Date();
      key.preventDefault();
      startTest();
    }
  });
}
