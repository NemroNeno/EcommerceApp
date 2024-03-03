import React from 'react'
import {Link} from "react-router-dom"


const Footer = () => {
  return (
    <div className="footer">
        <h4 className='text-center'>All Right reserved &copy; Nemro Neno</h4>
        <p className='text-center mt-3'>
         
         <Link to="/about">About Us </Link>
         <Link to="/contact"> Contact Us </Link>
         <Link to="/policy"> User Policy</Link>

        </p>
    </div>
  )
}

export default Footer