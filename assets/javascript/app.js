// Steps to complete:

// 1. Create Firebase link
// 2. Create initial train data in database
// 3. Create button for adding new trains - then update the html + update the database
// 4. Create a way to retrieve trains from the trainlist.
// 5. Create a way to calculate the time way. Using difference between start and current time.
//    Then take the difference and modulus by frequency. (This step can be completed in either 3 or 4)


// Initialize Firebase



	// 2. Populate Firebase Database with initial data (in this case, I did this via Firebase GUI)
	// 3. Button for adding trains

	// Grabs user input

	// Creates local "temporary" object for holding train data

	// Uploads train data to the database

	// Logs everything to console

	// Alert

	// Clears all of the text-boxes

	// Determine when the next train arrives.



// 4. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry


// Store everything into a variable.


// If the first train is later than the current time, sent arrival to the first train time


// Calculate the minutes until arrival using hardcore math
// To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
// and find the modulus between the difference and the frequency.
	// To calculate the arrival time, add the tMinutes to the currrent time



// Add each train's data into the table



// Assume the following situations.

// (TEST 1)
// First Train of the Day is 3:00 AM
// Assume Train comes every 3 minutes.
// Assume the current time is 3:16 AM.... (1 minute has passed) last train was at 3:15 AM
// What time would the next train be...? ( Let's use our brains first)
// It would be 3:18 -- 2 minutes away

// (TEST 2)
// First Train of the Day is 3:00 AM
// Assume Train comes every 7 minutes.
// Assume the current time is 3:16 AM....(2 minutes have passed) last train was at 3:14 AM
// What time would the next train be...? (Let's use our brains first)
// It would be 3:21 -- 5 minutes away


// ==========================================================

// Solved Mathematically
// Test case 1:
// 16 - 00 = 16   current minutes - starting minutes
// 16 % 3 = 1 (Modulus is the remainder) train comes every 3 minutes (one minute has passed since the last train)
// 3 - 1 = 2 minutes away
// 2 + 3:16 = 3:18

// Solved Mathematically
// Test case 2:
// 16 - 00 = 16 minutes since the first train
// 16 % 7 = 2 (Modulus is the remainder) train comes every 7 minutes (two minutes have passed since the last train)
// 7 - 2 = 5 minutes away 
// 5 + 3:16 = 3:21

$(document).ready(function(){
	// Initialize Firebase
  var config = {
	  apiKey: "AIzaSyAN778XOtE_ectIxDtwFsS-nsRrEyddxp0",
	  authDomain: "train-time-af659.firebaseapp.com",
	  databaseURL: "https://train-time-af659.firebaseio.com",
	  projectId: "train-time-af659",
	  storageBucket: "train-time-af659.appspot.com",
	  messagingSenderId: "156471752988"
  };
  firebase.initializeApp(config);


	var trainDB = firebase.database();

	// create a variable that holds today's date and time using moment.js
	var currentdatetime = moment().format("MM/DD/YY hh:mm");
	console.log(currentdatetime)
	$("#currentTime").text(currentdatetime)

	// on click of #submit button 
	// prevent default – refreshing of the page
	// grab the values from each input and trim any white space
	// create a object that has 4 keys with the value that are stored as variables
	$("#submitForm").on("click", function(event){
	  event.preventDefault()
	  console.log("forms submit")

	  var destination =    $("#destination").val().trim()
	  var trainName =      $("#trainName").val().trim()
	  var firstTrainTime = $("#firstTrainTime").val().trim()
	  var frequency =      $("#frequency").val().trim()

	  // firebase object
	  var train = {
		  name: trainName,
		  destination: destination,
		  firstTrainTime: firstTrainTime,
		  frequency: frequency
	  }
	  console.log(train)
	 // call on the trainDB and add (push) the firebase object to it
	  trainDB.ref().push(train)

	  // let the user kcurrentTimeConverted that their train imput was added
	  $("#imputAlert").modal("show")

	  // reset form 
	  // find each input by ID and make the value an empty string
	  $("#destination, #trainName, #firstTrainTime, #frequency").val("");
	  //$("#trainName").val("")
	  //$("#firstTrainTime").val("")
	  //$("#frequency").val("")
  })
  
  
  // calling firebase getting all the data back
// store data in a variable
// calculate next arrival time
// calculate minutes away
// format the data
// display it on page


/*

<tr>
  <td>train name</td>
  <td>train destination</td>
  <td>frequency</td>
  <td>next arrival time</td>
  <td>minutes away</td>      
</tr> 

*/
  trainDB.ref().on("child_added", function(childSnapshot, prevChildKey) {
	  // VARIABLES
	  // console.log(childSnapshot.val());
	  // name of train
	  var dbTrainName = childSnapshot.val().name
	 // console.log(dbTrainName)

	  // train destination
	  var dbDestination = childSnapshot.val().destination

	  // first time train ran
	  var dbFirstTrainTime = childSnapshot.val().firstTrainTime

	  // frequency of train schedule
	  var dbFrequency = childSnapshot.val().frequency
	  console.log("dbFirstTrainTime", dbFirstTrainTime)

	  // store how many minutes until train arrives
	  var minutesAway = null;

	  // store when next train will arrive
	  var nextArrivalTime = null;

	  // TRAIN TIME MATH
	  // first time train arrived (Moment Object)
	  var firstTime = moment(dbFirstTrainTime, "HH:mm").subtract(1, "years");
	  // current time (Moment Object)
	  var currentTime = moment();
	  
	  // frequency - parseInt changes the string into a number
	  var frequency = parseInt(dbFrequency)

	  // Calculate the minutes away variable and the next arrival variable when the first train time is earlier than the current time.
	  // .isBefore is a MomentJS method
	  if (firstTime.isBefore(currentTime)) {
		  // .diff is a MomentJS method
		  var timeSinceFirstTrain = currentTime.diff(firstTime, "minutes");
		  console.log("timeSinceFirstTrain", timeSinceFirstTrain)

		  var timeSinceLastTrain = timeSinceFirstTrain % frequency;
		  console.log("timeSinceLastTrain", timeSinceLastTrain)

		  minutesAway = Math.floor(frequency - timeSinceLastTrain);
		  
		  // same as above except in a single line
		  // minutesAway = (frequencyConverted - ((currentTimeConverted - firstTimeConverted) % frequencyConverted)) / 60000;
		  console.log("minutesAway:",minutesAway)
		  
	  // Calculate the minutes away variable and the next arrival variable when the first train time is later than the current time.
	  } else {
		  // .diff is a MomentJS method
		  minutesAway = firstTime.diff(currentTime, "minutes");
		  console.log("minutesAway:",minutesAway)
	  } 

	  // adds minutesAway to current datetime
	  // .add is a MomentJS method
	  nextArrivalTime = currentTime.add(minutesAway, "minutes").format("h:mm A");
	  console.log(nextArrivalTime)


	  // template literal allows multi line strings; using ${} allows for  insersion of variables into the string
	  $("tbody").append(`<tr>
							  <td>${dbTrainName}</td>
							  <td>${dbDestination}</td>
							  <td>${dbFrequency}</td>
							  <td>${nextArrivalTime}</td>
							  <td>${minutesAway}</td>      
						  </tr> `)



/*
use back tick to use multi lines

<tr>
  <td>train name</td>
  <td>train destination</td>
  <td>frequency</td>
  <td>next arrival time</td>
  <td>minutes away</td>      
</tr> 

*/

  })
})