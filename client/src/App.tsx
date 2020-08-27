import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Routes from "./routes/Routes";
import { SuccesfulLogin } from "./routes/LoginPage";

type Props = { whatever: string };
type State = { userEmail: string | null };

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { userEmail: localStorage.getItem("email") };
  }

  onUserConnection = ({ email, token }: SuccesfulLogin) => {
    console.log({ email, token });

    localStorage.setItem("email", email);
    localStorage.setItem("token", token);

    this.setState({ userEmail: email });

    return null;
  };

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Routes
              onUserConnection={this.onUserConnection}
              userIsConnected={!!this.state.userEmail}
            />
          </header>
        </div>
      </Router>
    );
  }
}

export default App;
