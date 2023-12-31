import { useState, useEffect } from "react";
import axios from 'axios';
import React from "react";
import "../../styles/formdata.module.css"
import { useParams } from "react-router-dom"
import PageTitle from "../PageTitle";
import {  toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import TrainScheduleManagementHeader from "./trainScheduleManagementHeader";

const UpdateSchedule = () => {

  const [trainName, settrainName] = useState("Ruhunu Kumari");
  const [date, setdate] = useState("");
  const [starttime, setstarttime] = useState("");
  const [endtime, setendtime] = useState("");
  const [source, setsource] = useState("");
  const [destination, setdestination] = useState("");
  const [sucessfull, setSucessfull] = useState(false);
  const { id } = useParams();
  const [traindata, settraindata] = useState([]);




  useEffect(() => {

    axios.get(`api/train/${id}`).then((res) => {


      settrainName(res.data.trainName)
      setdate(res.data.date)
      setstarttime(res.data.startTime)
      setendtime(res.data.endTime)
      setsource(res.data.source)
      setdestination(res.data.destination)

      fetch("api/traindata/activated").then(r => r.json()).then(response => {
        console.log("Hi")
        console.log(response)
        settraindata(response)
        // const activatedtraindata = response.filter((train) => train.status === 'activated');
        // setactivatedtrains(activatedtraindata)
        console.log('Activated Trains:', response); 
  
      }).catch(e => console.log("The error fetching all schedules", e))


    }).catch((err) => {
      console.log(err)
    })

  }, [])


  function UpdateSchedule(e) {
    e.preventDefault();
    if (destination.length >= 1) {
      setSucessfull(false);
      const newupdatedSchedule = {
        trainName,
        date,
        starttime,
        endtime,
        source,
        destination
      }
      console.log(newupdatedSchedule)
      axios.put(`api/train/${id}`, newupdatedSchedule).then((res) => {
        console.log(res)
        console.log("Hi")
        e.target.reset();
        alert("Schedule Updated Successfully")
        toast.success('Schedule Updated Successfully!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }).catch((err) => {
        console.log(err)
      })
    } else {
      setSucessfull(true)
    }
  }

  return (
    <>
      <TrainScheduleManagementHeader />
      <PageTitle pageTitle="Update Schedule" />
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
              <form onSubmit={UpdateSchedule} >
                <div class="form-group">
                  <label for="exampleFormControlSelect1" style={{ float: "left" }}>Train Name</label>
                  <select value={trainName} onChange={(e) => { settrainName(e.target.value) }} class="form-control form-select" required>
                  {traindata.map((train) => (
          <option key={train.Id} value={train.trainName}>
            {train.trainName}
          </option>
                    ))}
                  </select>
                </div>
                <br></br>
                <div class="form-group">
                  <label for="exampleFormControlInput1" style={{ float: "left" }}>Date</label>
                  <input value={date} onChange={(e) => { setdate(e.target.value) }} type="date" class="form-control" id="exampleFormControlInput1" required />
                </div>
                <br></br>


                <div class="form-group">
                  <label for="exampleFormControlInput1" style={{ float: "left" }}>Start Time </label>
                  <input value={starttime} onChange={(e) => { setstarttime(e.target.value) }} type="time" class="form-control" id="exampleFormControlInput1" placeholder="Enter Schedule Id" title="follow requested format Ex:([name@example.com])" required="required" />
                </div>
                <br></br>
                <div class="form-group">
                  <label for="exampleFormControlInput1" style={{ float: "left" }}>End Time </label>
                  <input value={endtime} onChange={(e) => { setendtime(e.target.value) }} type="time" class="form-control" id="exampleFormControlInput1" placeholder="Enter Schedule Id" title="follow requested format Ex:([name@example.com])" required="required" />
                </div>

                <br></br>
                <div class="form-group">
                  <label for="exampleFormControlInput1" style={{ float: "left" }}>Source </label>
                  <input value={source} onChange={(e) => { setsource(e.target.value) }} type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Schedule Id" title="follow requested format Ex:([name@example.com])" required="required" />
                </div>
                <div class="form-group">
                  <br></br>
                  <div class="form-group">
                    <label for="exampleFormControlInput1" style={{ float: "left" }}>Destination </label>
                    <input value={destination} onChange={(e) => { setdestination(e.target.value) }} type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Schedule Id" title="follow requested format Ex:([name@example.com])" required="required" />
                  </div>
                  <div class="form-group"></div>

                </div>
                <br></br> <br></br>
                <div class="form-group">
                  <br></br>
                  <div class="form-group">
                    <button style={{ width: "100%", backgroundColor: "#ff762e", }} type="submit" className="btn btn-primary  ">Update Schedule</button>
                    <br />
                  </div>
                </div>
              </form>
              {/* <button onClick={testCsurfClicked}>Test Csurf Post Call</button> */}
            </div>
          </div>
        </div>
      </center>
    </>
  )
}

export default UpdateSchedule
