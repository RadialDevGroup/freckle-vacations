import HOLIDAYS from './holidays'
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

const SICK_TIME = 479979;
const PTO = 315594;
const HACK_TIME = 306043;
const HOLIDAY = 471567;

export const PTO_PER_YEAR = 6 * 40;
export const PTO_PER_WEEK = PTO_PER_YEAR/52;

export const weeksOf = (year, includeCurrentWeek=false) => {
  year = year ? `${year}-01-02` : '';
  const start = moment(year).startOf('year').startOf('week');
  const end = moment.min(
    moment(year).endOf('year').startOf('week'),
    includeCurrentWeek ? moment() : moment().subtract(1, 'week'),
  );
  return Array.from(moment.range(start, end).by('week'));
}

function matchProject(entry, project_id) {
  return entry.project_id === project_id ? entry.minutes / 60 : 0;
}

function finalSums(totals, weeks=weeksOf(), fullTimeStartDate) {
  return weeks.reduce((totals, week) => {
    const dateKey = week.format('YYYY-MM-DD');
    const weekTotal = totals[dateKey];
    const grandTotal = totals.total || {accrual: 0, count: 0, total: 0, billable: 0, hack: 0, sick: 0, pto: 0, clocked_holiday: 0, used: 0};
    if (!weekTotal) {
      console.warn('No week total for', dateKey, totals);
      return totals;
    }
    const holiday = HOLIDAYS[dateKey] || 0;
    const afterStartDate = moment(dateKey).isSameOrAfter(fullTimeStartDate);
    const used = afterStartDate ? ((weekTotal.pto || 0) + (40 - holiday - (weekTotal.total || 0) + (weekTotal.clocked_holiday || 0))) : 0;
    const changed = afterStartDate ? PTO_PER_WEEK - used : 0;
    const accrual = afterStartDate ? (grandTotal.accrual || 0) + changed : 0;
    return {
      ...totals,
      [dateKey]: {
        ...weekTotal,
        holiday,
        accrual,
        changed,
        used,
      },
      total: {
        ...totals.total,
        accrual,
        count: (grandTotal.count || 0) + weekTotal.count,
        total: (grandTotal.total || 0) + weekTotal.total,
        billable: (grandTotal.billable || 0) + weekTotal.billable,
        hack: (grandTotal.hack || 0) + weekTotal.hack,
        sick: (grandTotal.sick || 0) + weekTotal.sick,
        pto: (grandTotal.pto || 0) + weekTotal.pto,
        holiday: (grandTotal.holiday || 0) + holiday,
        clocked_holiday: (grandTotal.clocked_holiday || 0) + weekTotal.clocked_holiday,
        used: (grandTotal.used || 0) + used,
      }
    };
  }, totals);
}

export default function totals(data, weeks, fullTimeStartDate) {
  return finalSums(data.reduce((totals, {entry}) => {
    const date = moment(entry.date).startOf('week').format('YYYY-MM-DD');
    const previous = totals[date] || {};
    const hours = entry.minutes / 60;
    return {
      ...totals,
      [date]: {
        ...previous,
        count: (previous.count || 0) + 1,
        total: (previous.total || 0) + hours,
        billable: (previous.billable || 0) + (entry.billable ? hours : 0),
        hack: (previous.hack || 0) + matchProject(entry, HACK_TIME),
        sick: (previous.sick || 0) + matchProject(entry, SICK_TIME),
        pto: (previous.pto || 0) + matchProject(entry, PTO),
        clocked_holiday: (previous.clocked_holiday || 0) + matchProject(entry, HOLIDAY),
      }
    };
  }, {}), weeks, fullTimeStartDate);
}
