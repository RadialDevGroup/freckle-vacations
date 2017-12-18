import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

const yearToDate = moment.range(moment().startOf("year"), moment())

export default function calculate(entries) {
  let usedHours = 0, remainingHours = 0;
  Array.from(yearToDate.by("week")).forEach(( week ) => {
    const weekRange = moment.range(week, week.clone().endOf("week"))
    const minutesWorked = entries.filter(({entry}) => {
      return weekRange.contains(moment(entry.date))
    }).reduce((sum, {entry}) => {
      return sum + entry.minutes
    }, 0)
    usedHours += 40 - minutesWorked / 60
    remainingHours += 7.2
  })
  remainingHours -= usedHours
  return {
    usedHours, remainingHours
  }
}
