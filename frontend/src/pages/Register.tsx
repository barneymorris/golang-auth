import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

type Props = {
  isAuthenticaed?: boolean;
};

export const Register: React.FC<Props> = ({ isAuthenticaed }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })
        .then(async (res) => {
          if (res.status > 299) {
            const body = await res.json();
            throw body.error;
          }

          navigate("/login");
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
    [name, email, password, navigate]
  );

  if (isAuthenticaed) {
    navigate("/");

    return null;
  }

  return (
    <div className="container">
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

      <form onSubmit={onSubmit}>
        <h1 className="h3 mb-3 fw-normal">Please register</h1>

        <input
          value={name}
          className="form-control"
          placeholder="Name"
          required
          onChange={(e) => setName(e.target.value)}
        />

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
          Submit
        </button>
      </form>
    </div>
  );
};
