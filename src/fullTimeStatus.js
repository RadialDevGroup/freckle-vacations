import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

export const FTE_START_DATES = [
  {name: 'Alek', id: '74414', fullTimeStartDate: moment('2020-01-01')},
  {name: 'Ben', id: '41130', fullTimeStartDate: moment('2016-01-01')},
  {name: 'Dan', id: '66631', fullTimeStartDate: moment('2018-06-01')},
  {name: 'Dave', id: '69321', fullTimeStartDate: moment('2019-01-01')},
  {name: 'Djavan', id: '74713', fullTimeStartDate: moment('2020-01-01')},
  {name: 'Geoff Robinson', id: '72772', fullTimeStartDate: moment('2019-08-04')},
  {name: 'Geoff', id: '41128', fullTimeStartDate: moment('2017-08-16')},
  {name: 'Marshall', id: '41127', fullTimeStartDate: moment('2016-01-01')},
  {name: 'Kayla', id: '74415', fullTimeStartDate: moment('2020-01-01')},
  {name: 'Rebecca', id: '45745', fullTimeStartDate: moment('2016-01-18')},
  {name: 'Stephanie', id: '64110', fullTimeStartDate: moment('2019-11-05')},
];
