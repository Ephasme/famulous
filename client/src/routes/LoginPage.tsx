import * as React from "react";
import { Row, Col, Container, Button, Form } from "react-bootstrap";
import axios from "axios";

type LoginPageState = {
  email: string;
  password: string;
  authenticationError: boolean;
};
export type SuccesfulLogin = {
  email: string;
  token: string;
};
type LoginPageProps = {
  onUserConnection: (state: SuccesfulLogin) => null;
};

export class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
  constructor(props: LoginPageProps) {
    super(props);
    this.state = { email: "", password: "", authenticationError: false };
  }

  onSubmit = async (ev: any) => {
    ev.preventDefault();

    const { email, password } = this.state;

    await axios
      .post(
        "http://localhost:3001/api/v1/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        if (response.status === 200 && response.data && response.data.token) {
          this.setState({ authenticationError: false });
          this.props.onUserConnection({
            email,
            token: response.data.token,
          });
        } else {
          this.setState({ authenticationError: true });
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ authenticationError: true });
      });
  };

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="john.doe@gmail.com"
                  value={this.state.email}
                  onChange={(ev) => this.setState({ email: ev.target.value })}
                ></Form.Control>
                <Form.Text>
                  We will never share your email with anyone else.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  value={this.state.password}
                  onChange={(ev) =>
                    this.setState({ password: ev.target.value })
                  }
                  type="password"
                  placeholder="your password..."
                />
              </Form.Group>
              <Button variant="primary" type="submit" onClick={this.onSubmit}>
                Login
              </Button>
              {this.state.authenticationError && (
                <p style={{ color: "red" }}>Bad credentials</p>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
