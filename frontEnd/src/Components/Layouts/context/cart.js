import axios from "axios";
import { useState, useEffect, useContext, createContext } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [item, setItem] = useState([]);
   
  useEffect(()=>{
 
    let existing=localStorage.getItem("cart");
    if(existing) setItem(JSON.parse(existing))

  },[])

  return (
    <CartContext.Provider value={[item, setItem]}>
      {children}
    </CartContext.Provider>
  );
};

//Custom Hook

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
