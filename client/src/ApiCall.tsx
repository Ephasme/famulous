import React from "react"

type ApiCallProps = {
  defaultValue: string;
};

type ApiCallState = {
  value: string;
};

export default class ApiCall extends React.Component<ApiCallProps, ApiCallState> {
  constructor(props: ApiCallProps) {
    super(props);
    this.state = { value: props.defaultValue };
  }
  componentDidMount() {
    fetch("/api/give-me-something")
      .then((res) => res.json())
      .then((result: { value: string }) => {
        this.setState({
          value: result.value,
        });
      });
  }
  render() {
    return <div>{this.state.value}</div>;
  }
}
