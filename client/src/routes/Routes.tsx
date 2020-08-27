import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { LoginPage, SuccesfulLogin } from "./LoginPage";

type RoutesProps = {
  onUserConnection: (state: SuccesfulLogin) => null;
  userIsConnected: boolean;
};

export default class Routes extends React.Component<RoutesProps> {
  render() {
    return (
      <Switch>
        {!this.props.userIsConnected ? (
          <div>
            <Route path="/login">
              <LoginPage onUserConnection={this.props.onUserConnection} />
            </Route>
            <Route path="/*">
              <Redirect to="/login" />
            </Route>
          </div>
        ) : (
          <div>
            <Route path="/about">
              <div>IT'S ABOUT</div>
            </Route>
            <Route path="/users">
              <div>IT'S USERS</div>
            </Route>
            <Route path="/">
              <div>IT'S HOME</div>
            </Route>
          </div>
        )}
      </Switch>
    );
  }
}
