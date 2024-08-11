const data = [
  { hoursStudied: 5, attendance: 90, schoolExamScore: 85, stateExamScore: 88 },
  { hoursStudied: 3, attendance: 80, schoolExamScore: 75, stateExamScore: 78 },
  { hoursStudied: 7, attendance: 95, schoolExamScore: 90, stateExamScore: 92 },
  { hoursStudied: 2, attendance: 70, schoolExamScore: 65, stateExamScore: 68 },
  { hoursStudied: 6, attendance: 85, schoolExamScore: 80, stateExamScore: 84 },
  { hoursStudied: 4, attendance: 75, schoolExamScore: 70, stateExamScore: 73 },
  { hoursStudied: 8, attendance: 98, schoolExamScore: 92, stateExamScore: 94 },
  { hoursStudied: 1, attendance: 60, schoolExamScore: 55, stateExamScore: 57 },
  { hoursStudied: 9, attendance: 99, schoolExamScore: 95, stateExamScore: 96 },
  { hoursStudied: 10, attendance: 100, schoolExamScore: 98, stateExamScore: 99 },
  { hoursStudied: 3.5, attendance: 82, schoolExamScore: 78, stateExamScore: 80 },
  { hoursStudied: 4.5, attendance: 88, schoolExamScore: 83, stateExamScore: 86 },
  { hoursStudied: 6.5, attendance: 93, schoolExamScore: 88, stateExamScore: 90 },
  { hoursStudied: 2.5, attendance: 72, schoolExamScore: 67, stateExamScore: 69 },
  { hoursStudied: 5.5, attendance: 87, schoolExamScore: 82, stateExamScore: 85 },
  { hoursStudied: 7.5, attendance: 97, schoolExamScore: 90, stateExamScore: 92 },
  { hoursStudied: 1.5, attendance: 65, schoolExamScore: 58, stateExamScore: 60 },
  { hoursStudied: 8.5, attendance: 99, schoolExamScore: 94, stateExamScore: 96 },
  { hoursStudied: 0.5, attendance: 50, schoolExamScore: 45, stateExamScore: 48 },
  { hoursStudied: 9.5, attendance: 100, schoolExamScore: 96, stateExamScore: 97 },
  { hoursStudied: 6, attendance: 85, schoolExamScore: 81, stateExamScore: 83 },
  { hoursStudied: 4, attendance: 78, schoolExamScore: 74, stateExamScore: 76 },
  { hoursStudied: 7, attendance: 95, schoolExamScore: 89, stateExamScore: 91 },
  { hoursStudied: 2, attendance: 68, schoolExamScore: 64, stateExamScore: 66 },
  { hoursStudied: 5, attendance: 80, schoolExamScore: 76, stateExamScore: 78 }
];

// Step 1 : Setup backend to webgl
ml5.setBackend("webgl")

// Step 2 : Initialize the neural network 
const brain = ml5.neuralNetwork({
  task: 'regression',
  debug: true
});

// Step 3 : Add data to the neural network 
data.forEach(item => {
  const input = {
    hoursStudied: item.hoursStudied,
    attendance: item.attendance,
    schoolExamScore: item.schoolExamScore
  };
  const output = {
    stateExamScore: item.stateExamScore
  };
  brain.addData(input, output);
});

// Step 4 : Normalize Data to make feature similar scale
brain.normalizeData();

const trainingOptions = {
  epochs: 32,
  batchSize: 12
};

// Step 5 : Train the model 
brain.train(trainingOptions, finishedTraining);

function finishedTraining() {
  console.log('Model training finished');
}

function predictScore() {
  const input = {
    hoursStudied: parseFloat(document.getElementById('hoursStudied').value),
    attendance: parseFloat(document.getElementById('attendance').value),
    schoolExamScore: parseFloat(document.getElementById('schoolExamScore').value)
  };

  //Step 6 : Make prediction with custom model 
  brain.predict(input, (results) => {
    document.getElementById('result').textContent = results[0].value.toFixed(2);
  });
}

// Add event listener to predict button
document.getElementById('predictBtn').addEventListener('click', predictScore);