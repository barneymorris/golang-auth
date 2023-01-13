import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

type Props = {
  isAuthenticaed?: boolean;
};

export const Login: React.FC<Props> = ({ isAuthenticaed }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then(async (res) => {
          if (res.status > 299) {
            const body = await res.json();
            throw body.error;
          }

          navigate("/");
        })
        .catch((e) => {
          toast.error(e, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    },
    [email, password, navigate]
  );

  if (isAuthenticaed) {
    navigate("/");

    return null;
  }

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <h1 className="h3 mb-3 fw-normal">Please register</h1>

        <input
          value={email}
          type="email"
          className="form-control"
          placeholder="Email address"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          value={password}
          type="password"
          className="form-control"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};
