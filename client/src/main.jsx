import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store.js"; 
import { PersistGate } from "redux-persist/integration/react"; 
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from "./components/themeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
