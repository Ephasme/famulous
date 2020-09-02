import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { LoginPage, SuccesfulLogin } from "./LoginPage";
import { AccountPage } from "./AccountPage";
import { Layout } from "../components/Layout";

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
          <Layout>
            <Route exact={true} path="/accounts/:id">
              <AccountPage />
            </Route>
            <Route exact={true} path="/users">
              <div>IT'S USERS</div>
            </Route>
            <Route exact={true} path="/">
              <div>IT'S HOME</div>
            </Route>
          </Layout>
        )}
      </Switch>
    );
  }
}
