import React, { Component } from 'react';
import _ from 'lodash';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import logo from './logo.svg';
import './App.css';
import FetchedDate from './FetchedDate';
import API from './freckle';
import totals, {WEEKS} from './math';

const moment = extendMoment(Moment);


class App extends Component {
  state = {
    fetched: null,
    users: [],
    selectedUser: '',
    totals: {}
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = () => {
    API.users().then((users) => {
      this.setState({users});
    });
  }
  loadData = (selectedUser) => {
    API.entries({user_id: selectedUser || this.state.selectedUser}).then((data) => {
      const fetched = moment();
      this.setState({totals: totals(data), fetched});
    });
  }
  selectUser = ({target:{value:selectedUser}}) => {
    this.setState({selectedUser, totals: {}, fetched: null});
    this.loadData(selectedUser);
  }

  render() {
    const {users, selectedUser, totals, fetched} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Vacation Time</h1>
          <select value={selectedUser} onChange={this.selectUser}>
            <option/>
            {users.map(({user}) => (
              <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
            ))}
          </select>
          <FetchedDate date={fetched}/>
        </header>
        <div className="App-intro">
          <table>
            <thead>
              <tr>
                <th>Week of</th>
                <th>Entries</th>
                <th>Billable</th>
                <th>Hack Time</th>
                <th>Logged PTO</th>
                <th>Used PTO</th>
                <th>Personal/Sick</th>
                <th>Holiday</th>
                <th>Total</th>
                <th>Change</th>
                <th>Accrued</th>
              </tr>
            </thead>
            <tbody>
              {WEEKS.map((date) => {
                const dateKey = date.format('YYYY-MM-DD');
                const weekTotals = totals[dateKey] || {};
                return (
                  <tr key={dateKey}>
                    <th>{date.format('MMMM D')}</th>
                    <td>{weekTotals.count || 0}</td>
                    <td>{_.round(weekTotals.billable || 0, 2)}</td>
                    <td>{_.round(weekTotals.hack || 0, 2)}</td>
                    <td>{_.round(weekTotals.pto || 0, 2)}</td>
                    <td>{_.round(weekTotals.used || 0, 2)}</td>
                    <td>{_.round(weekTotals.sick || 0, 2)}</td>
                    <td>{_.round(weekTotals.holiday || 0, 2)}</td>
                    <td>{_.round(weekTotals.total || 0, 2)}</td>
                    <td>{_.round(weekTotals.changed || 0, 2)}</td>
                    <td>{_.round(weekTotals.accrual || 0, 2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {totals.total && (
                <tr>
                  <th>TOTAL</th>
                  <td>{_.round(totals.total.count, 2)}</td>
                  <td>{_.round(totals.total.billable, 2)}</td>
                  <td>{_.round(totals.total.hack, 2)}</td>
                  <td>{_.round(totals.total.pto, 2)}</td>
                  <td>{_.round(totals.total.used, 2)}</td>
                  <td>{_.round(totals.total.sick, 2)}</td>
                  <td>{_.round(totals.total.holiday, 2)}</td>
                  <td>{_.round(totals.total.total, 2)}</td>
                  <td></td>
                  <td><strong>{_.round(totals.total.accrual, 2)}</strong></td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
