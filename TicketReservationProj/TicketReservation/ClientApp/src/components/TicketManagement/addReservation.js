
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import "../../styles/formdata.module.css"
import PageTitle from '../PageTitle';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AgentHeader from '../Common/TravelAgentHeader';

function AddTicket() {

  const [referenceId, setreferenceId] = useState("");
  const [customerName, setcustomerName] = useState("");
  const [trainName, settrainName] = useState('');
  const [selecteddate, setselecteddate] = useState([]);
  const [selectedtime, setselectedtime] = useState([]);
  const [dateOfBooking, setdateOfBooking] = useState('');
  const [timeOfBooking, settimeOfBooking] = useState('');
  const [ticketCount, setticketCount] = useState("");

  const [schedule, setschedule] = useState([]);
  const [traindata, settraindata] = useState([]);


  // const [handletextarea, sethandletextarea] = useState(false)
  const [sucessfull, setSucessfull] = useState(false);
  var navigate = useNavigate();
  

  useEffect(() => {

    fetch("api/train").then(r => r.json()).then(response => {
      
      console.log(response)
      setschedule(response)

    }).catch(e => console.log("The error fetching all schedules", e))


    fetch("api/traindata/activated").then(r => r.json()).then(response => {
      console.log("Hi")
      console.log(response)
      settraindata(response)
      // const activatedtraindata = response.filter((train) => train.status === 'activated');
      // setactivatedtrains(activatedtraindata)
      console.log('Activated Trains:', response); 

    }).catch(e => console.log("The error fetching all schedules", e))



  }, [])



  async function submitSchedule(e) {
    e.preventDefault();


    // Get the current date
    const currentDate = new Date();

    // Parse the selected date from the input field
    const selectedDate = new Date(dateOfBooking);

    // Calculate the difference in milliseconds between the selected date and the current date
    const dateDifference = selectedDate - currentDate;

    // Calculate the number of days difference (30 days = 30 * 24 * 60 * 60 * 1000 milliseconds)
    const daysDifference = dateDifference / (24 * 60 * 60 * 1000);

    

    if (daysDifference < 0 || daysDifference > 30) {
      alert("Reservation date must be within 30 days from the current date.");
      return;
    }
    // If the train is not scheduled, proceed to submit the schedule
    
    setSucessfull(false);
    const newTicketData = {
      referenceId,
      customerName,
      trainName,
      dateOfBooking,
      timeOfBooking,
      ticketCount
    };
    console.log(newTicketData)
    // The rest of your code to submit the schedule goes here
    //console.log(newTicketData)
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };


    await axios.post(`api/ticket`, newTicketData, {
      headers: headers, // Use the headers with the CSRF token
      credentials: "include",
      mode: "cors",
    })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status == "Error") {
          alert(res.data.message)
        } else {
          toast.success('Ticket Data Added!', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          //console.log(res.data)  


           settrainName("");
           setdateOfBooking("");
           //setcustomerName("");
           //setreferenceId("");
           settimeOfBooking("")
        }


      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          // Display the error message in an alert or toast
          alert("Maximum 4 reservations per reference ID are allowed.");
        } else {
          // Handle other error cases as needed
          alert("An error occurred while submitting the schedule.");
        }

      });

  }



// Function to handle train name selection
const handleTrainNameChange = (e) => {
  
  const selectedTrainName = e.target.value;
  console.log(selectedTrainName)
  settrainName(selectedTrainName);
  
  console.log('trainSchedules:', schedule);
  

  const selectedTrainDates = schedule
  .filter((train) => train.trainName === selectedTrainName)
  .map((train) => {
    console.log(train.date); // Log the date here
    return train.date; // Return the date
  });

  const selectedTrainTimes = schedule
  .filter((train) => train.trainName === selectedTrainName)
  .map((train) => {
    console.log(train.startTime); // Log the date here
    return train.startTime; // Return the date
  });

  console.log(selectedTrainDates)
  console.log(selectedTrainTimes)
  setselecteddate(selectedTrainDates)
  setselectedtime(selectedTrainTimes)
};

// Function to handle train name selection
const handleTrainDateChange = (e) => {
  
  const selectedtraindate = e.target.value;
  console.log(selectedtraindate)
  setdateOfBooking(selectedtraindate);
  
  console.log('trainSchedules:', schedule);
  

  // const selectedTrainDates = schedule
  // .filter((train) => train.trainName === selectedTrainName)
  // .map((train) => {
  //   console.log(train.date); // Log the date here
  //   return train.date; // Return the date
  // });
  console.log(trainName)
  const selectedTrainTimes = schedule
  .filter((train) => train.date === selectedtraindate && train.trainName === trainName )
  .map((train) => {
    console.log(train.startTime); // Log the date here
    return train.startTime; // Return the date
  });

  //console.log(selectedTrainDates)
  console.log(selectedTrainTimes)
  console.log(timeOfBooking)
  //setselecteddate(selectedTrainDates)
  setselectedtime(selectedTrainTimes)
};


// Function to handle train name selection
const handleTrainTimeChange = (e) => {
  
  const selectedtraintime = e.target.value;
  console.log(selectedtraintime)
  settimeOfBooking(selectedtraintime);
  
  console.log('trainSchedules:', schedule);
};

  function clear() {
    settrainName("");
    setreferenceId("");
    setdateOfBooking("");
    settimeOfBooking("");
    setticketCount("");
    setcustomerName("");
  }

  return (
    <>
      <AgentHeader />
      <PageTitle pageTitle="Add New Reservation" />
      <div style={{ backgroundColor: '#ff762e', textalign: 'left', width: '100%', height: '2px' }}></div>
      <center>
        <div className="card" style={{
          width: "50rem", borderRadius: "2em",
          borderStyle: 'solid',
          borderColor: ' #ff762e', margin: "100px", padding: "50px",
          display: 'flex',
          justifyContent: 'center',
        }}
        >
          <div className="card-body">


            <div>
              <form onSubmit={submitSchedule} >
                <div class="form-group">
                  <label for="exampleFormControlInput1" style={{ float: "left" }}>ReferenceId</label>
                  <input value={referenceId} onChange={(e) => { setreferenceId(e.target.value) }} type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Reference Id" title="follow requested format Ex:([name@example.com])" required="required" />
                </div>
                <br></br>

                <div class="form-group">
                  <label for="exampleFormControlInput1" style={{ float: "left" }}>Customer Name</label>
                  <input value={customerName} onChange={(e) => { setcustomerName(e.target.value) }} type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Name" title="follow requested format Ex:([name@example.com])" required="required" />
                </div>
                <br></br>
                <div class="form-group">
                  <label for="exampleFormControlSelect1" style={{ float: "left" }}>Train Name</label>
                  <select value={trainName} onChange={handleTrainNameChange} class="form-control form-select" required>
                  <option value="" disabled>Select a Train Name</option>
                  {Array.from(new Set(schedule.map(train => train.trainName))).map(trainName => (
    <option key={trainName} value={trainName}>
      {trainName}
    </option>
  ))}
                  </select>
                </div>
                <br></br>
                <div class="form-group">
                  <label for="exampleFormControlInput1" style={{ float: "left" }}>Date</label>
                  <select value={dateOfBooking} onChange={handleTrainDateChange} class="form-control form-select" required>
                  <option value="" disabled>Select a Date</option>
                  {Array.from(new Set(selecteddate)).map((trainDate) => (
    <option key={trainDate} value={trainDate}>
      {trainDate}
          </option>
                    ))}
                  </select>
                 
                </div>
                <br></br>


                <div class="form-group">
                  <label for="exampleFormControlInput1" style={{ float: "left" }}> Time </label>
                  <select value={timeOfBooking} onChange={handleTrainTimeChange}  class="form-control form-select" required>
                  <option value="" disabled>Select a time</option>
                  {selectedtime.map((trainTime) => (
          <option  key={trainTime} value={trainTime}>
            {trainTime}
          </option>
                    ))}
                  </select>
                </div>

                <br></br>


<div class="form-group">
  <label for="exampleFormControlInput1" style={{ float: "left" }}> No of Ticket </label>
  <input value={ticketCount} onChange={(e) => { setticketCount(e.target.value) }} type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Number of tickets" title="follow requested format Ex:([name@example.com])" required="required" />
</div>

                <br></br> <br></br>
                <div class="form-group">

                  <button style={{ width: "100%", backgroundColor: "#ff762e" }} type="submit" className="btn btn-primary  ">Add Reservation</button>
                  <ToastContainer></ToastContainer>
                  <button style={{ width: "100%", backgroundColor: " #082344", marginTop: "10px" }} onClick={() => { clear() }} className="btn btn-primary ">Reset</button>
                </div>
              </form>
              {/* <button onClick={testCsurfClicked}>Test Csurf Post Call</button> */}
            </div>
          </div>
        </div>
      </center>
    </>
  );

}
export default AddTicket;


