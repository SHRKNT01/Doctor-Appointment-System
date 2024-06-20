import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();

  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvailability = async () => {
    try {
      // Check if date and time are selected
      if (!date || !time) {
        return message.error("Please select both date and time.");
      }
  
      // Validate if selected date is in the past
      const selectedDate = moment(date, "DD-MM-YYYY");
      if (selectedDate.isBefore(moment(), "day")) {
        return message.error("Selected date cannot be in the past.");
      }
  
      // Check if selected time is within doctor's given time slots
      const startTime = moment(doctors.timings[0], "hh:mm A");
      const endTime = moment(doctors.timings[1], "hh:mm A");
      const selectedTime = moment(time, "hh:mm A");
  
      if (selectedTime.isBefore(startTime) || selectedTime.isAfter(endTime)) {
        return message.error("Selected time is not within doctor's working hours.");
      }
  
      // If selected time matches with doctor's working hours, show a message to the user
      if (selectedTime.isSameOrAfter(startTime) && selectedTime.isSameOrBefore(endTime)) {
        return message.success("Selected time matches with doctor's working hours.");
      }
  
      // Proceed with availability check
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availability",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        setIsAvailable(false); // Set availability to false if not available
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  

  const handleBooking = async () => {
    try {
      if (!date || !time) {
        return message.error("Date & Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <h3>Booking Page</h3>
      <div className="container m-2">
        {doctors && (
          <div>
            <h4>
              Dr.{doctors.firstName} {doctors.lastName}
            </h4>
            <h4>Fees : {doctors.feesPerCunsaltation}</h4>
            <h4>
              Timings : {doctors.timings && doctors.timings[0]} -{" "}
              {doctors.timings && doctors.timings[1]}{" "}
            </h4>
            <div className="d-flex flex-column w-50">
              <DatePicker
                aria-required={"true"}
                className="m-2"
                format="DD-MM-YYYY"
                disabledDate={(current) =>
                  current && current < moment().startOf("day")
                }
                onChange={(value) => {
                  setDate(moment(value).format("DD-MM-YYYY"));
                }}
              />

              <TimePicker
                aria-required={"true"}
                format="hh:mm A"
                className="mt-2"
                onChange={(value) => {
                  setTime(moment(value).format("hh:mm A"));
                }}
              />

              <button
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
              >
                Check Availability
              </button>

              <button className="btn btn-dark mt-2" onClick={handleBooking}>
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
