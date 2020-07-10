import React from "react";
import { Switch, Route } from "react-router-dom";

export default function Routes() {
  return (
    <Switch>
      <Route path="/about">
        <div>IT'S ABOUT</div>
      </Route>
      <Route path="/users">
        <div>IT'S USERS</div>
      </Route>
      <Route path="/">
        <div>IT'S HOME</div>
      </Route>
    </Switch>
  );
}
