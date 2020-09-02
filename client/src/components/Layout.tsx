import * as React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { BudgetMenuRow } from "./BudgetMenuRow";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = (props: LayoutProps) => (
  <Container fluid>
    <Row>
      <Col md={3}>
        <BudgetMenuRow />
      </Col>
      <Col md={9}>{props.children}</Col>
    </Row>
  </Container>
);
