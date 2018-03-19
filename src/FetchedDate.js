import React, { Component } from 'react';

export default class FetchedDate extends Component {
  componentDidMount() {
    this._updateTimer = setInterval(() => this.forceUpdate(), 5000);
  }
  componentWillUnmount() {
    clearInterval(this._updateTimer);
  }

  render() {
    const {date} = this.props;
    if (!date) return null;

    return (
      <h4 title={date.format('MMMM D, h:mm:ss a')}>
        Data loaded from Freckle {date.fromNow()}
      </h4>
    );
  }
}
