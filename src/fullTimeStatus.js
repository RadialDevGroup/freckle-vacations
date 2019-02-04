import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

export const FTE_START_DATES = [
  {name: 'Alfred', id: '70630', fullTimeStartDate: moment()},
  {name: 'Ben', id: '41130', fullTimeStartDate: moment('2016-01-01')},
  {name: 'Dan', id: '66631', fullTimeStartDate: moment('2018-06-01')},
  {name: 'Dave', id: '69321', fullTimeStartDate: moment('2019-01-01')},
  {name: 'Geoff', id: '41128', fullTimeStartDate: moment('2017-08-16')},
  {name: 'Marshall', id: '41127', fullTimeStartDate: moment('2016-01-01')},
  {name: 'Meghan', id: '71299', fullTimeStartDate: moment('2019-01-16')},
  {name: 'Rebecca', id: '45745', fullTimeStartDate: moment('2016-01-18')},
];
