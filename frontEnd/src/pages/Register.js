import React, { useState } from "react";
import Layout from "../Components/Layouts/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [user_info, setinfo] = useState({
    name: "",
    email: "",
    address: "",
    phoneNo: "",
    password: "",
    answer:"",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setinfo({
      ...user_info,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        user_info
      );
      if (res.data.success) {
        alert(res.data.message)
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="register">
        <h1>Register Page</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 ">
            <input
              name="name"
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter your Name"
              value={user_info.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              value={user_info.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 ">
            <input
              name="email"
              type="emai"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter your email"
              value={user_info.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 ">
            <input
              name="address"
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter your Address"
              value={user_info.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 ">
            <input
              name="phoneNo"
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter your Phone Number"
              value={user_info.phoneNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 ">
            <input
              name="answer"
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter your Favourite movie character"
              value={user_info.answer}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
