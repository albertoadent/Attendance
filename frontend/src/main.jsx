import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { Modal, ModalProvider } from "./context/Modal.jsx";
import configureStore from "./redux/store.js";
import { csrfFetch } from "./redux/csrf.js";
import * as sessionActions from "./redux/session.js";

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

if (process.env.NODE_ENV !== "production") {
  window.store = store;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
