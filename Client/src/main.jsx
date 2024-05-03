import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// CSS imports
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '../src/assets/main.css';
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './vendor/bootstrap/css/bootstrap.min.css'
import './vendor/jquery/jquery.min.js'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'boxicons/css/boxicons.min.css';
import 'react-toastify/dist/ReactToastify.css'; // Importa el CSS para react-toastify
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Tema
import 'primereact/resources/primereact.min.css';                 // core css
import 'primeicons/primeicons.css';   

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
