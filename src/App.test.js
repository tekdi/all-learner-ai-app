import React from "react";
import { render, screen } from "@testing-library/react";
// import '@testing-library/jest-dom/extend-expect';
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import App from "./App";

const mockStore = configureStore([]);
const initialState = {
  snackbar: {
    open: false,
    message: "",
    type: "",
  },
  user: {
    virtulId: null,
  },
};
const store = mockStore(initialState);

test("renders learn react link", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
