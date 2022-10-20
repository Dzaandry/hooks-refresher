import React, { useCallback, useReducer, useMemo, useEffect } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

const ingredientsReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...state, action.ingredient];
    case "DELETE":
      return state.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Shouldn't be here!");
  }
};

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientsReducer, []);
  const { isLoading, error, data, sendRequest, extra, identifier, clear } =
    useHttp();

  useEffect(() => {
    if (identifier === "ADD_INGREDIENT") {
      dispatch({ type: "ADD", ingredient: { ...extra, id: data.name } });
    } else if (identifier === "DELETE_INGREDIENT") {
      dispatch({ type: "DELETE", id: extra });
    }
  }, [data, extra, identifier]);

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(
    async (ingredient) => {
      const url = `https://react-http-dd8cb-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json`;
      sendRequest(
        url,
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    async (id) => {
      const url = `https://react-http-dd8cb-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${id}.json`;
      sendRequest(url, "DELETE", null, id, "DELETE_INGREDIENT");
    },
    [sendRequest]
  );

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        loading={isLoading}
        onAddIngredient={addIngredientHandler}
      />

      <section>
        <Search onFilterIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
