document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startButton");
  const gesture = document.getElementById("gesture");
  const video = document.getElementById("video");
  const gameResult = document.getElementById("gameResult");

  const modelUrl =
    "https://teachablemachine.withgoogle.com/models/LCFjaO7WV/model.json";
  let userChoice = "";
  let classifier = ml5.imageClassifier(modelUrl, modelLoaded);

  function modelLoaded() {
    console.log("Model Loaded");
    startVideo();
  }

  async function startVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.play();
    classifyGesture();
  }

  function classifyGesture() {
    classifier.classify(video, (results) => {
      userChoice = results[0].label;
      gesture.innerText = `Your gesture: ${userChoice}`;
      classifyGesture();
    });
  }

  startBtn.addEventListener("click", () => {
    playGame(userChoice);
  });

  function playGame(userChoice) {
    let choices = ["Rock", "Paper", "Scissors"];
    let randomNumber = Math.floor(Math.random() * choices.length);
    let computerChoice = choices[randomNumber];
    let result = "";
    if (userChoice === computerChoice) {
      result = "It's a tie!";
    } else if (
      (userChoice === "Rock" && computerChoice === "Scissors") ||
      (userChoice === "Scissors" && computerChoice === "Paper") ||
      (userChoice === "Paper" && computerChoice === "Rock")
    ) {
      result = "You win!";
    } else {
      result = "You lose!";
    }
    gameResult.innerText = `Computer chose: ${computerChoice}. ${result}`;
  }
});
