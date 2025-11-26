import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import "./index.scss";
import "./index.css";
import { HashRouter } from "react-router-dom";
import ScrollToTop from "./utils/ScrollToTop";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./redux/store";
import persistStore from "redux-persist/es/persistStore";

let persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <ScrollToTop />
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </HashRouter>
  </React.StrictMode>
);
