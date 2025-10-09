import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';
function setForLocalDev() {
  const dev_token = "access_tokeneyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NiIsImVtYWlsIjoiY2hhbmRyYXNtcmZ0QGdtYWlsLmNvbSIsIm5hbWUiOiJjaGFuZHJhIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNJTi1BUEktRlUtUlciLCJTVC1QLUNNVC1SVyIsIlNELVAtU0EtUlciLCJTSU4tUC1JQ0UtUiIsIkZFLVItRkEiLCJTRC1SLUxUIiwiRkUtUC1GRy1SVyIsIkZFLVAtRkdMLVIiLCJTSU4tQVBJLU9SLVJXIiwiU1QtUC1DTVQtUiIsIkZFLVAtRlMtUlciLCJGRS1QLUZSLVJXIiwiU0QtUC1ITVNDUy1SIiwiU0QtUC1ITVNHUC1SIiwiU0QtUC1URS1SVyIsIkZFLVAtRkdGLVIiLCJTRC1QLVRERS1SVyIsIlNELVAtSE1TQkQtUlciLCJTVC1QLUJSRC1SIiwiU0QtUC1ITVNTRC1SIiwiU0lOLUFQSS1JRi1SIiwiU1QtUC1UREwtUlciLCJTVC1QLURFUy1SVyIsIlNULVItQSIsIlNELVAtSE1TU1AtUiIsIlNJTi1BUEktU0YtUiIsIlNELVAtSE1TTEQtUiIsIkZFLVAtRkYtUlciLCJTVC1QLURFUy1SIiwiU0lOLUFQSS1JRi1SVyIsIkZFLVAtRkFMLVIiLCJTVC1BUEktRU1QLVIiLCJTVC1QLU5URi1SVyIsIlNELVAtUkQtUlciLCJTRC1QLUhNU1NTLVJXIiwiU1QtUC1UREwtUiIsIlNJTi1QLUdJQy1SIiwiU1QtQVBJLUNSRC1SVyIsIlNELVAtSE1TVEQtUiIsIlNULVAtTlRGLVIiLCJTRC1QLUhNU1BCLVJXIiwiU0QtUC1ITVNQUy1SVyIsIlNULUFQSS1CUkQtUlciLCJTRC1QLUhNU1VDLVJXIiwiU1QtQVBJLUFNQy1SVyIsIlNELVAtSE1TR0MtUiIsIlNELVAtUkctUlciLCJTVC1QLVNOTy1SVyIsIkZFLVAtRlVTLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NjAwMDIwMzQsImV4cCI6MTc2MDA4OTAzNCwianRpIjoiYzllZjc4ZTktNDYxNS00MzE4LTkwYzktZDMzYTAzNGRjNTkyIn0.BQOrxP8wjTX-jfqv4LbWnkGtnpMcdbDV6JaPcBT1LkL3it-cVlNa3QCY6KprzhJBUtGo5gXBvEn8zNRjsBAgvzPRIWbE0LB1cUGY7wZFe9_pBhvQAVXBUZQX5mkQPHIc6K1_nIexbPbmddydqgKbCNx18fOQzyLflwxw5GXuyAXQqrV8IypYX7onhoffboGx94L8mQASlgOE-OyUYaBK8fVBatkmNx_Qs5h6VH1Rk6P4rJ4Wi_pR3IXbGeYQMMF5U-eA7_tx21jTHobJ7DHx4cVzuvkNojFY5Saj3ZAWM78k2eFRlx1XNELikk9afaTvL1RLirwDN0Kl2yRdCCViIw";

  localStorage.setItem("access_token", dev_token);

  return dev_token;
}
function validate(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}
const BASE_PATH = process.env.PUBLIC_URL;
function RootRenderer() {
  const [isValidToken, setIsValidToken] = useState(false);
  useEffect(() => {
    let accessToken = localStorage.getItem("access_token");
    if (!accessToken && process.env.REACT_APP_LOCAL_DEV_ENVIRONMENT === 'true') {
      accessToken = setForLocalDev();
    }
    try {
      if (!accessToken) throw new Error("No token found");
      const payload = validate(accessToken);
      localStorage.setItem("user_payload", JSON.stringify(payload));
      setIsValidToken(true);
    } catch (err) {
      console.error("Token validation failed:", err.message);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_payload");
      // window.location.href = process.env.REACT_APP_LOGIN_REDIRECT_URL;
    }
  }, []);
  return isValidToken ? (
<BrowserRouter  basename={BASE_PATH}>
  <App />
</BrowserRouter>

  ) : null;
}
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <RootRenderer />
  </StrictMode>
);