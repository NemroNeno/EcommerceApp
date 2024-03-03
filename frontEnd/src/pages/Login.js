import React, { useState } from "react";
import Layout from "../Components/Layouts/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import { useAuth } from "../Components/Layouts/context/auth";

const Login = () => {

  const [auth,setAuth]=useAuth()
  const navigate = useNavigate();
  const location=useLocation();
  const [user_info, setinfo] = useState({
    email: "",

    password: "",
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
        "http://localhost:8080/api/v1/auth/login",
        user_info
      );
      if (res.data.success) {
        alert(res.data.message);
        setAuth({
          ...auth,
          user:res.data.user,
          token:res.data.token

        })
        localStorage.setItem("auth",JSON.stringify(res.data));
        navigate(location.state||"/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error.response);
      toast.error("Something went wrong");
    }
  };



  return (
    <Layout>
      <div className="register">
        <h1>Login Page</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 ">
            <input
              name="email"
              type="emai"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter your email"
              value={user_info.email}
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

          <button type="submit" className="btn btn-primary">
            Login
          </button>


          <button  onClick={()=>{

          navigate("/forgetPassword")

          }} className="btn btn-primary ">
            Forgot Password
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
