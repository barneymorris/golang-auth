import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "../components/App";

type Props = {
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
};

export const Logout: React.FC<Props> = ({ setUserInfo }) => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/logout", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      method: "POST",
    }).finally(() => {
      setUserInfo(null);
      navigate("/");
    });
  }, [navigate, setUserInfo]);

  return null;
};
