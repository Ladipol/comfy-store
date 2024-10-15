//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./store.js";

createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<ToastContainer position='top-center' />
		<App />
	</Provider>,
);
