import React from "react";
import { useSearch } from "../Layouts/context/search.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useSearch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res  = await axios.get(
        `http://localhost:8080/api/v1/product/search/${search.keyword}`
      );
      setSearch({ ...search, results: res?.data?.results });
      
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form className="d-flex" role="search" onSubmit={handleSubmit}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={search.keyword}
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
