// @flow
import {london} from '../../../utils/format-date';
// import {getEarliestFutureDateRange} from '../../../utils/dates';
import {classNames, cssGrid, spacing} from '../../../utils/classnames';
import SegmentedControl from '../SegmentedControl/SegmentedControl';
import EventPromo from '../EventPromo/EventPromo';
import DailyTourPromo from '../DailyTourPromo/DailyTourPromo';
import type {UiEvent} from '../../../model/events';

type Props = {|
  events: UiEvent[]
|}

// recursive - TODO: make tail recursive?
function getMonthsInDateRange({start, end}, acc = []) {
  if (start.isBefore(end, 'month') || start.isSame(end, 'month')) {
    const newAcc = acc.concat([start.format('MMMM')]);
    const newStart = start.add(1, 'month');
    return getMonthsInDateRange({start: newStart, end}, newAcc);
  } else {
    return acc;
  }
}
const monthsIndex = {
  'January': 0,
  'February': 1,
  'March': 2,
  'April': 3,
  'May': 4,
  'June': 5,
  'July': 6,
  'August': 7,
  'September': 8,
  'October': 9,
  'November': 10,
  'December': 11
};

const EventsByMonth = ({
  events
}: Props) => {
  const eventsInMonths = events.filter(event => event.times.length > 0).map(event => {
    const firstRange = event.times[0];
    const lastRange = event.times[event.times.length - 1];

    const start = firstRange.range && london(firstRange.range.startDateTime);
    const end = lastRange.range && london(lastRange.range.endDateTime);

    const months = getMonthsInDateRange({start, end});
    return {event, months};
  }).reduce((acc, {event, months}) => {
    months.forEach(month => {
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(event);
    });
    return acc;
  }, {});
  const months = Object.keys(eventsInMonths).map(month => ({
    id: month,
    url: `#${month}`,
    text: month
  }));

  return (
    <div className={classNames({
      'js-events-filter': true,
      'tabs': true
    })}>
      <div className={classNames({
        [spacing({s: 2}, { margin: ['bottom'] })]: true
      })}>
        <div className='css-grid__container'>
          <div className='css-grid'>
            <div className={classNames({
              [cssGrid({s: 12, m: 12, l: 12, xl: 12})]: true
            })}>
              <SegmentedControl
                id='monthControls'
                isTabControl={true}
                activeId={months[0].id}
                items={months} />
            </div>
          </div>
        </div>
      </div>

      {months.map(month => month.id).map(month =>
        <div key={month} className={classNames({
          'js-tabpanel': true,
          'tabpanel': true,
          [cssGrid({s: 12, m: 12, l: 12, xl: 12})]: true
        })}>
          <div className='css-grid__container'>
            <div className='css-grid'>
              <h2
                id={month}
                className={classNames({
                  'js-tabfocus': true,
                  'tabfocus': true,
                  [cssGrid({s: 12, m: 12, l: 12, xl: 12})]: true
                })}>
                {month}
              </h2>
            </div>
          </div>
          <div className='css-grid__container'>
            <div className='css-grid'>
              {eventsInMonths[month].map((event, i) => (
                <div key={event.id} className={classNames({
                  [cssGrid({s: 12, m: 6, l: 4, xl: 4})]: true
                })}>
                  <EventPromo
                    event={event}
                    position={i}
                    fromDate={london({M: monthsIndex[month]})}
                  />
                </div>
              ))}
              <div key={`${month}-daily-tour`} className={classNames({
                [cssGrid({s: 12, m: 6, l: 4, xl: 4})]: true
              })}>
                <DailyTourPromo />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EventsByMonth;
