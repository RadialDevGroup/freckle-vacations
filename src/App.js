import React, { Component } from 'react';
import _ from 'lodash';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import logo from './logo.svg';
import './App.css';
import FetchedDate from './FetchedDate';
import API from './freckle';
import totals, {PTO_PER_YEAR, PTO_PER_WEEK, weeksOf} from './math';
import { FTE_START_DATES } from './fullTimeStatus';

const moment = extendMoment(Moment);

const AVAILABLE_YEARS = Array.from(moment.range(moment('2017-01-01'), moment()).by('year')).map((year) => year.format('YYYY'));
const weeksLeft = (includeCurrentWeek) => 52 - moment().week() - (includeCurrentWeek ? 0 : 1);
const availablePto = (total, includeCurrentWeek) => total && (
  Math.min(PTO_PER_WEEK * weeksLeft(includeCurrentWeek), PTO_PER_YEAR/2) + total.accrual
);

class App extends Component {
  state = {
    fetched: null,
    users: [],
    includeCurrentWeek: false,
    selectedUser: '',
    selectedYear: _.last(AVAILABLE_YEARS),
    totals: {},
    data: [],
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = () => {
    API.users().then((users) => {
      this.setState({users});
    });
  }
  loadData = ({selectedUser, selectedYear}) => {
    API.entries({
      user_id: selectedUser || this.state.selectedUser,
      year: selectedYear || this.state.selectedYear,
    }).then((data) => {
      const {selectedYear, includeCurrentWeek} = this.state;
      const fetched = moment();
      const employee = _.find(FTE_START_DATES, { id: selectedUser || this.state.selectedUser, });
      const fullTimeStartDate = _.get(employee, 'fullTimeStartDate', moment());
      this.setState({totals: totals(data, weeksOf(selectedYear, includeCurrentWeek), fullTimeStartDate), fetched, data});
    });
  }
  selectUser = ({target: {value:selectedUser}}) => {
    this.setState({selectedUser, totals: {}, fetched: null});
    this.loadData({selectedUser});
  }
  selectYear = ({target: {value:selectedYear}}) => {
    this.setState({selectedYear, totals: {}, fetched: null});
    this.loadData({selectedYear});
  }
  toggleIncludeCurrentWeek = () => {
    this.setState(({includeCurrentWeek, data, selectedYear}) => ({
      includeCurrentWeek: !includeCurrentWeek,
      totals: totals(data, weeksOf(selectedYear, !includeCurrentWeek))
    }));
  }

  render() {
    const {users, selectedUser, selectedYear, includeCurrentWeek, totals, fetched} = this.state;
    const currentYearSelected = selectedYear === _.last(AVAILABLE_YEARS);
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
          <select value={selectedYear} onChange={this.selectYear}>
            {AVAILABLE_YEARS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {currentYearSelected && (
            <label>
              <input type="checkbox" checked={includeCurrentWeek} onChange={this.toggleIncludeCurrentWeek}/>
              Include current week
            </label>
          )}
          <FetchedDate date={fetched}/>
        </header>
        {totals.total && (
          <div className="App-intro">
            {currentYearSelected ? (
              <h4 className="summary">
                Up to <span>{_.round(availablePto(totals.total, includeCurrentWeek), 2)}</span> available with borrowing.
              </h4>
            ) : (
              <h4 className="summary">
                <span>{_.round(totals.total.used, 2)} / {PTO_PER_YEAR}</span> used.
              </h4>
            )}
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
                {weeksOf(selectedYear, includeCurrentWeek).map((date) => {
                  const dateKey = date.format('YYYY-MM-DD');
                  const weekTotals = totals[dateKey] || {};
                  return (
                    <tr key={dateKey} className={!weekTotals.count ? 'blank-row' : ''}>
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
                  <td>
                    <strong>{_.round(totals.total.accrual, 2)}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default App;
