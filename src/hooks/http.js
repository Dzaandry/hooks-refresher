import { useReducer, useCallback } from "react";

const initialState = {
  isLoading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (state, action) => {
  switch (action.type) {
    case "SEND":
      return {
        isLoading: true,
        error: null,
        data: null,
        extra: null,
        identifier: null,
      };

    case "RESPONSE":
      return {
        error: null,
        isLoading: false,
        data: action.data,
        extra: action.extra,
        identifier: action.identifier,
      };

    case "ERROR":
      return {
        isLoading: false,
        error: action.errorMessage,
        data: null,
        extra: null,
        identifier: null,
      };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Shouldn't be reached!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, []);

  const sendRequest = useCallback(
    async (url, method, body, extra, identifier) => {
      dispatchHttp({ type: "SEND" });
      try {
        const response = await fetch(url, {
          method,
          body,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        dispatchHttp({ type: "RESPONSE", data, extra, identifier });
      } catch (err) {
        dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong!" });
      }
    },
    []
  );
  return {
    isLoading: httpState.isLoading,
    error: httpState.error,
    data: httpState.data,
    sendRequest,
    extra: httpState.extra,
    identifier: httpState.identifier,
    clear,
  };
};

export default useHttp;
