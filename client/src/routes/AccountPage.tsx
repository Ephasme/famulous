import * as React from "react";
import { useParams, RouteComponentProps, withRouter } from "react-router-dom";

interface MatchParams {
  id: string;
}

export const AccountPage = () => {
  const { id } = useParams<MatchParams>();

  return <div>{id}</div>;
};
