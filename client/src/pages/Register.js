import React, { useState } from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "../styles/image.png";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Register Successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logoImage} alt="Logo" height="40" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        <h1 className="text-center mt-3">
          Welcome to Doctor Appointment Booking Portal
        </h1>
        <div className="form-container">
          <Form
            layout="vertical"
            onFinish={onFinishHandler}
            className="register-form"
          >
           <h3 className="text-center register-heading">Register</h3>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter your name",
                },
                {
                  pattern: /^[a-zA-Z\s]*$/,
                  message: "Please enter a valid name",
                },
              ]}
            >
              <Input type="text" placeholder="Enter Your Name" />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
                {
                  required: true,
                  message: "Please enter your email address",
                },
              ]}
            >
              <Input type="email" placeholder="Enter Email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password",
                },
              ]}
            >
              <Input.Password
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Link to="/login" className="m-2">
              Already have an account? Login Here
            </Link>
            <button className="btn btn-primary" type="submit">
              Register
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
