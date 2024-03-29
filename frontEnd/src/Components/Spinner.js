import React, { useState, useEffect } from "react";
import { useNavigate ,useLocation} from "react-router-dom";

const Spinner = ({path="login"}) => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const location=useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((preValue) => 
        --preValue
      );
    }, 1000);
    if(count===0)
     navigate(`/${path}`,{
    state:location.pathname,});
    return () => clearInterval(interval);
  }, [count, navigate,location,path]);

  return (
    <div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1 className="Text-center">Redirecting to you in {count} seconds</h1>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
