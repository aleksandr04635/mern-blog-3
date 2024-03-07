import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./components/ThemeProvider.jsx";

import { Helmet, HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <HelmetProvider>
        {/*  this Helmet component can be enywhere in the project */}
        <Helmet>
          <title>My Blog - Main page</title>
          <meta
            name="description"
            content="A demonstration project of a MERN blogspot with a rich text editor 
  with images uploading from it and comment tree structure created with Redux Toolkit Query."
          />
          <meta property="og:title" content="Your Open Graph Title" />
          <meta
            property="og:description"
            content="Your Open Graph Description"
          />
          <meta property="og:image" content="url-to-your-image" />
          {/*   <title>{`${admin ? "Admin Title" : "Client Title"}`}</title>
        <meta name="description" content={`${admin ? "Admin Content" : "Client Content"}`} /> */}
        </Helmet>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </HelmetProvider>
    </Provider>
  </PersistGate>,
);
