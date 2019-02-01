import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

const HOLIDAYS = [
  {name: 'Employee Appreciation Day', dates: [moment('2019-03-01')]},
  {name: 'Memorial Day', dates: [moment('2019-05-27'), moment('2018-05-28'), moment('2017-05-29')]},
  {name: 'Independence Day', dates: [moment('2019-07-04'), moment('2018-07-04'), moment('2017-07-04')]},
  {name: 'Labor Day', dates: [moment('2019-09-02'), moment('2018-09-03'), moment('2017-09-04')]},
  {name: 'Election Day', dates: [moment('2019-11-05'), moment('2018-11-06'), moment('2017-11-05')]},
  {name: 'Veterans/Voting Day', dates: [moment('2019-10-28'), moment('2018-11-12'), moment('2017-11-11')]},
  {name: 'Thanksgiving', dates: [
    moment('2019-11-28'), moment('2019-11-29'),
    moment('2018-11-22'), moment('2018-11-23'),
    moment('2017-11-23'), moment('2017-11-24'),
  ]},
  {name: 'Winter', dates: [
    ...moment.range(moment('2019-12-23'), moment('2019-12-27')).by('day'),
    ...moment.range(moment('2019-12-30'), moment('2020-01-03')).by('day'),

    ...moment.range(moment('2018-12-24'), moment('2018-12-28')).by('day'),
    ...moment.range(moment('2018-12-31'), moment('2019-01-04')).by('day'),

    ...moment.range(moment('2017-12-19'), moment('2017-12-22')).by('day'),
    ...moment.range(moment('2017-12-26'), moment('2017-12-30')).by('day'),
    moment('2018-01-01')
  ]},
];

export default HOLIDAYS.reduce((dates, holiday) => {
  return [...dates, ...holiday.dates];
}, []).reduce((byWeek, date) => {
  const weekStarting = date.startOf('week').format('YYYY-MM-DD');
  return {
    ...byWeek,
    [weekStarting]: (byWeek[weekStarting] || 0) + 8
  };
}, {});
