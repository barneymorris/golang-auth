import React from "react";
import { UserInfo } from "../components/App";

type Props = {
  isAuthenticaed?: boolean;
  userInfo: UserInfo | null;
};

export const Home: React.FC<Props> = ({ isAuthenticaed, userInfo }) => {
  if (!isAuthenticaed) {
    return <div className="center">You are not logged in</div>;
  }

  return <div className="center">{"Hi " + userInfo?.name}</div>;
};
