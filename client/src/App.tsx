import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { LoginPage } from "./LoginPage";
import Routes from "./Routes";

type Props = { whatever: string };
type State = { connected: boolean };

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { connected: false };
  }
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Routes />
            {/* <LoginPage onSubmit={({ email, password }) => null} /> */}
          </header>
        </div>
      </Router>
    );
  }
}

export default App;
