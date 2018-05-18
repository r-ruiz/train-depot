// Initialize Firebase
var config = {
    apiKey: "AIzaSyASpLFGYexLCO2am3X-nfQxDTD39pM-WI0",
    authDomain: "trainsched-b53b7.firebaseapp.com",
    databaseURL: "https://trainsched-b53b7.firebaseio.com",
    projectId: "trainsched-b53b7",
    storageBucket: "trainsched-b53b7.appspot.com",
    messagingSenderId: "763834440348"
};
firebase.initializeApp(config);
var database = firebase.database();
  
function addTrain(){
  $("#alertMe").hide();
  $("#addTrainbtn").on("click", function(event) {
    event.preventDefault();

    //check to see if there are no blank fields
    if ($.trim($("#trainNameInput").val()) === "" || $.trim($("#trainDestInput").val()) === "" || $.trim($("#trainTimeInput").val()) === "" ||$.trim($("#trainFreqInput").val()) === ""){
      $("#myModal").modal("toggle");
      return;
    }
  
    // Grabs user input
    var trainName = $("#trainNameInput").val().trim();
    var trainDest = $("#trainDestInput").val().trim();
    var trainTime = moment($("#trainTimeInput").val().trim(), "HH:mm").format("X");
    var trainFreq = $("#trainFreqInput").val().trim();
  
    // Creates local object for holding train data
    var newTrain = {
      train: trainName,
      dest: trainDest,
      time: trainTime,
      freq: trainFreq
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.train);
    console.log(newTrain.dest);
    console.log(newTrain.time);
    console.log(newTrain.freq);
  
    // Clears all of the text-boxes
    $("#trainNameInput").val("");
    $("#trainDestInput").val("");
    $("#trainTimeInput").val("");
    $("#trainFreqInput").val("");
  });

  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().train;
    var trainDest = childSnapshot.val().dest;
    var trainTime = childSnapshot.val().time;
    var trainFreq = childSnapshot.val().freq;
  
    // Train Info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainTime);
    console.log(trainFreq);

    // Get time before current time
    var setTime = moment(trainTime, "HH:mm").subtract(1, "years");
    console.log("show time before current time: " + setTime);
    //var currentTime = moment();
    //var prettyCurrent = moment(currentTime).format("hh:mm a");

    // Difference between the times
    var diffTime = moment().diff(moment(setTime), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart using the remainder
    var tRemainder = diffTime % trainFreq;
    console.log(tRemainder);

    // Minutes until next Train
    var minAway = trainFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minAway);

    // Next Train time
    var nextArr = moment().add(minAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextArr).format("hh:mm a"));

    //make a nicer time format 
    var prettyTime = moment(nextArr).format("hh:mm a");

    // Add each train's data into the table
    $("#trainDisp > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
    trainFreq + "</td><td>" + prettyTime + "</td><td>" + minAway + "</td></tr>");
  });
}

function refreshTime(){
  var currentTime = moment();
  var prettyCurrent = moment(currentTime).format("hh:mm a");
  $("#Time").text("The current time is: " + prettyCurrent);
}

$(document).ready(function(){
    addTrain();
    window.setInterval('refreshTime()', 100);
});
