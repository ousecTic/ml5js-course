// Helper functions for data conversion
const jobToNumeric = (job) =>
  ({ teacher: 0, health: 1, services: 2, at_home: 3, other: 4 }[job] || 4);
const reasonToNumeric = (reason) =>
  ({ home: 0, reputation: 1, course: 2, other: 3 }[reason] || 3);
const guardianToNumeric = (guardian) =>
  ({ mother: 0, father: 1, other: 2 }[guardian] || 2);
const boolToNumeric = (value) => (value === "yes" ? 1 : 0);

// Step 1: Setup backend to webgl
ml5.setBackend("webgl");

// Step 2: Initialize the neural network
const brain = ml5.neuralNetwork({
  task: "regression",
  debug: true,
});

// Step 3: Load and add data to the neural network
async function loadAndProcessData() {
  const response = await fetch("data.json");
  const data = await response.json();

  data.forEach((item) => {
    const input = {
      school: item.school === "GP" ? 1 : 0,
      sex: item.sex === "F" ? 1 : 0,
      age: item.age,
      address: item.address === "U" ? 1 : 0,
      famsize: item.famsize === "GT3" ? 1 : 0,
      Pstatus: item.Pstatus === "A" ? 1 : 0,
      Medu: item.Medu,
      Fedu: item.Fedu,
      Mjob: jobToNumeric(item.Mjob),
      Fjob: jobToNumeric(item.Fjob),
      reason: reasonToNumeric(item.reason),
      guardian: guardianToNumeric(item.guardian),
      traveltime: item.traveltime,
      studytime: item.studytime,
      failures: item.failures,
      schoolsup: boolToNumeric(item.schoolsup),
      famsup: boolToNumeric(item.famsup),
      paid: boolToNumeric(item.paid),
      activities: boolToNumeric(item.activities),
      nursery: boolToNumeric(item.nursery),
      higher: boolToNumeric(item.higher),
      internet: boolToNumeric(item.internet),
      romantic: boolToNumeric(item.romantic),
      famrel: item.famrel,
      freetime: item.freetime,
      goout: item.goout,
      Dalc: item.Dalc,
      Walc: item.Walc,
      health: item.health,
      absences: item.absences,
      G1: item.G1,
      G2: item.G2,
    };

    const output = { G3: item.G3 };

    brain.addData(input, output);
  });

  console.log("Data loaded and processed");
}

// Step 4: Normalize data
function normalizeData() {
  brain.normalizeData();
  console.log("Data normalized");
}

// Step 5: Train the model
const trainingOptions = {
  epochs: 32,
  batchSize: 12,
};

function trainModel() {
  brain.train(trainingOptions, finishedTraining);
  brain.save();
}

function finishedTraining() {
  console.log("Model training finished");
  document.getElementById("predictBtn").disabled = false;
}

// Step 6: Make prediction with custom model
function predictScore() {
  const input = {
    school: document.getElementById("school").value === "GP" ? 1 : 0,
    sex: document.getElementById("sex").value === "F" ? 1 : 0,
    age: parseFloat(document.getElementById("age").value),
    address: document.getElementById("address").value === "U" ? 1 : 0,
    famsize: document.getElementById("famsize").value === "GT3" ? 1 : 0,
    Pstatus: document.getElementById("Pstatus").value === "A" ? 1 : 0,
    Medu: parseFloat(document.getElementById("Medu").value),
    Fedu: parseFloat(document.getElementById("Fedu").value),
    Mjob: jobToNumeric(document.getElementById("Mjob").value),
    Fjob: jobToNumeric(document.getElementById("Fjob").value),
    reason: reasonToNumeric(document.getElementById("reason").value),
    guardian: guardianToNumeric(document.getElementById("guardian").value),
    traveltime: parseFloat(document.getElementById("traveltime").value),
    studytime: parseFloat(document.getElementById("studytime").value),
    failures: parseFloat(document.getElementById("failures").value),
    schoolsup: document.getElementById("schoolsup").value === "yes" ? 1 : 0,
    famsup: document.getElementById("famsup").value === "yes" ? 1 : 0,
    paid: document.getElementById("paid").value === "yes" ? 1 : 0,
    activities: document.getElementById("activities").value === "yes" ? 1 : 0,
    nursery: document.getElementById("nursery").value === "yes" ? 1 : 0,
    higher: document.getElementById("higher").value === "yes" ? 1 : 0,
    internet: document.getElementById("internet").value === "yes" ? 1 : 0,
    romantic: document.getElementById("romantic").value === "yes" ? 1 : 0,
    famrel: parseFloat(document.getElementById("famrel").value),
    freetime: parseFloat(document.getElementById("freetime").value),
    goout: parseFloat(document.getElementById("goout").value),
    Dalc: parseFloat(document.getElementById("Dalc").value),
    Walc: parseFloat(document.getElementById("Walc").value),
    health: parseFloat(document.getElementById("health").value),
    absences: parseFloat(document.getElementById("absences").value),
    G1: parseFloat(document.getElementById("G1").value),
    G2: parseFloat(document.getElementById("G2").value),
  };

  brain.predict(input, (results) => {
    document.getElementById(
      "result"
    ).textContent = `Predicted Final Grade (G3): ${results[0].value.toFixed(
      2
    )}`;
  });
}

async function init() {
  try {
    await loadAndProcessData();
    normalizeData();
    trainModel();
    document
      .getElementById("predictBtn")
      .addEventListener("click", predictScore);
  } catch (error) {
    console.error("Error initializing:", error);
  }
}

init();
