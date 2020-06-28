import React from "react";
import { LoginPage } from "./LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";

type Props = { whatever: string };
type State = { connected: boolean };

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { connected: false };
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <LoginPage onSubmit={({ email, password }) => null} />
        </header>
      </div>
    );
  }
}

export default App;
