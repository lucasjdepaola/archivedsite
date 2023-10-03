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

// https://api.monkeytype.com/users/LD_/profile
async function grabTypingStats() {
  const link = await fetch("https://api.monkeytype.com/users/LD_/profile", {
    headers: { "content-type": "application/json" },
    method: "GET",
  });
  const data = await link.json();
  return data;
}

async function displayTypingStats() {
  //data.data.personalBests.time[15][0]; to get the 15s wpm number exactly
  const data = await grabTypingStats();
  const wpmfifteen = data.data.personalBests.time[15][0].wpm;
  const wpmsixty = data.data.personalBests.time[60][0].wpm;
  const fifteen = data.data.allTimeLbs.time[15].english;
  const sixty = data.data.allTimeLbs.time[60].english;
  if (fifteen === "undefined" || sixty === "undefined") {
    document.getElementById("15").innerText = "300";
    document.getElementById("60").innerText = "609";
  } else {
    document.getElementById("15").innerText += fifteen,
      " global (15s)",
      " at ",
      wpmfifteen,
      " wpm, ";
    document.getElementById("60").innerText += fifteen,
      " global (60s)",
      " at ",
      wpmsixty,
      " wpm";
  }
}
displayTypingStats();

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
