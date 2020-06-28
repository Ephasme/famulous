import * as React from "react";
import { Row, Col, Container, Button, Form } from "react-bootstrap";

type LoginPageState = {
  email: string;
  password: string;
};
type LoginPageProps = {
  onSubmit: (state: LoginPageState) => Error | null;
};

export class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
  constructor(props: LoginPageProps) {
    super(props);
    this.state = { email: "", password: "" };
  }
  onClick = (ev: any) => {
    ev.preventDefault();
    this.props.onSubmit(this.state);
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
              <Button variant="primary" type="submit" onClick={this.onClick}>
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
