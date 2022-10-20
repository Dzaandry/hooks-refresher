import React, { useState, useEffect, useRef } from "react";
import useHttp from "../../hooks/http";
import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import "./Search.css";

const Search = React.memo((props) => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const { onFilterIngredients } = props;
  const inputRef = useRef();
  const { isLoading, error, data, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter !== inputRef.current.value) return;
      const query = enteredFilter
        ? `?orderBy="title"&equalTo="${enteredFilter}"`
        : "";
      sendRequest(
        "https://react-http-dd8cb-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json" +
          query,
        "GET"
      );
    }, 500);
    return () => {
      console.log("CLEAN UP");
      clearTimeout(timer);
    };
  }, [enteredFilter, onFilterIngredients, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && data && !error) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onFilterIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onFilterIngredients]);

  return (
    <section className="search">
      <Card>
        {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
