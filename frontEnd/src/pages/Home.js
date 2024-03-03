import React, { useState, useEffect } from "react";
import Layout from "../Components/Layouts/Layout";

import axios from "axios";
import toast from "react-hot-toast";

import { Checkbox, Radio } from "antd";
import { genComponentStyleHook } from "antd/es/theme/internal";
import { prices } from "../Components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Components/Layouts/context/cart";
const Home = () => {
  const navigate = useNavigate();
  const [item, setItem] = useCart([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(false);

  //get total count

  //Getting All the Categories
  const getAllCategory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/category/getall-category"
      );

      if (res.data.success) {
        setCategories(res?.data.category);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const getTotal = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/product/product-count"
      );
      setTotal(res.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //Getting all the products
  const getAllproducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8080/api/v1/product/product-list/${page}`
      );
      setLoading(false);

      setProducts(res.data?.products);
      console.log(res.data.products);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (!checked.length && !radio.length) getAllproducts();
  }, [checked, radio]);

  const handleFilter = (value, id) => {
    console.log(id);
    let arr = [...checked];
    if (value) {
      arr.push(id);
    } else {
      arr = arr.filter((c) => c !== id);
    }
    console.log(arr);

    setChecked(arr);
  };

  //Filterd Products
  const FilterProducts = async () => {
    const res = await axios.post(
      "http://localhost:8080/api/v1/product/product-filter",
      { checked, radio }
    );
    try {
      setProducts(res.data?.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (checked.length || radio.length) FilterProducts();
  }, [checked, radio]);

  const LoadMore = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/product/product-list/${page}`
      );
      setLoading(true);
      setProducts((prevProducts) => [...prevProducts, ...res.data.products]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    LoadMore();
  }, [page]);

  return (
    <Layout>
      <div className="row mt-3 ">
        <div className="col-md-3">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories.map((c) => (
              <Checkbox
                key={c?._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c?.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {prices.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </button>
          </div>
        </div>
        <div className="col-md-9 ">
          {JSON.stringify(radio, null, 4)}
          <h1>All Products</h1>
          <div className="d-flex ">
            <div className="d-flex flex-wrap">
              {products.map((p) => (
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`http://localhost:8080/api/v1/product/get-productphoto/${p?._id}`}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p?.name}</h5>
                    <p className="card-text">
                      {p?.description.substring(0, 30)}
                    </p>
                    <p className="card-text">${p?.price}</p>
                    <button
                      className="btn btn-primary m-2"
                      onClick={(e) => {
                        navigate(`/product/${p.slug}`);
                      }}
                    >
                      More details
                    </button>
                    <button
                      className="btn btn-secondary m-2"
                      onClick={() => {setItem([...item, p])
                      toast.success("Product is added to cart")
                      localStorage.setItem('cart',JSON.stringify([...item,p]))
                      }
                      }
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {total}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading...." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
