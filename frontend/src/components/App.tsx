import React, { useState, useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./../pages/Home";
import { Register } from "./../pages/Register";
import { Login } from "./../pages/Login";
import { Logout } from "../pages/Logout";

export type UserInfo = {
  name: string;
  error?: string;
};

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const { pathname } = useLocation();

  useEffect(() => {
    if (!userInfo) {
      setLoading(true);

      fetch("http://localhost:8080/api/user", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((data) => data.json())
        .then((info: UserInfo) => {
          if (!info.error) {
            setUserInfo(info);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userInfo, pathname]);

  return (
    <>
      {!loading && (
        <nav>
          <div>
            <Link to="/">Home</Link>
          </div>
          {!Boolean(userInfo) && (
            <div>
              <Link to="/login">Login</Link>
            </div>
          )}
          {!Boolean(userInfo) && (
            <div>
              <Link to="/register">Register</Link>
            </div>
          )}

          {Boolean(userInfo) && (
            <div>
              <Link to="/logout">Logout</Link>
            </div>
          )}
        </nav>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Home isAuthenticaed={Boolean(userInfo)} userInfo={userInfo} />
          }
        />
        <Route
          path="/register"
          element={<Register isAuthenticaed={Boolean(userInfo)} />}
        />
        <Route
          path="/login"
          element={<Login isAuthenticaed={Boolean(userInfo)} />}
        />
        <Route path="/logout" element={<Logout setUserInfo={setUserInfo} />} />
      </Routes>
    </>
  );
};
