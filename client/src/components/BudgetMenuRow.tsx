import * as React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

type Account = {
  balance: string;
  currency: string;
  id: string;
  name: string;
  state: string;
};
type BudgetMenuRowState = {
  accounts: Account[];
};
type BudgetMenuRowProps = {};

export class BudgetMenuRow extends React.Component<
  BudgetMenuRowProps,
  BudgetMenuRowState
> {
  constructor(props: BudgetMenuRowProps) {
    super(props);
    this.state = { accounts: [] };
  }

  async componentDidMount() {
    await axios
      .get("http://localhost:3001/api/v1/accounts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          this.setState({ accounts: response.data });
        }
      });
  }

  render() {
    return (
      <div>
        Budget :
        <div style={{ padding: "5px 0px 0px 10px" }}>
          {this.state.accounts.map((account) => (
            <div key={account.id}>
              <Link to={`/accounts/${account.id}`}>
                {account.name} : {account.balance}
                {account.currency}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
