// @flow
import {Fragment} from 'react';
import {spacing, font} from '../../../utils/classnames';
import {formatDate, formatDateRangeWithMessage} from '../../../utils/format-date';
import {UiImage} from '../Images/Images';
import Icon from '../Icon/Icon';
import type {ExhibitionPromo as Props} from '../../../model/exhibitions';

const ExhibitionPromo = ({
  id, url, title, image, description, start, end
}: Props) => {
  const dateMessageAndColor = formatDateRangeWithMessage({start, end: (end || new Date())});
  return (
    <a data-component='ExhibitionPromo'
      data-track-event={JSON.stringify({category: 'component', action: 'ExhibitionPromo:click'})}
      id={id}
      href={url}
      className='plain-link promo-link bg-cream rounded-top rounded-bottom overflow-hidden flex flex--column'>
      <UiImage
        contentUrl={image.contentUrl}
        width={image.width}
        height={image.height}
        alt={image.alt}
        tasl={image.tasl}
        sizesQueries='(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)'
        showTasl={false} />

      <div className={`
          flex flex--column flex-1
          ${spacing({s: 2}, {padding: ['top']})}
          ${spacing({s: 3}, {padding: ['left', 'right']})}
          ${spacing({s: 4}, {padding: ['bottom']})}
        `}>
        <p className={`no-padding ${spacing({s: 2}, {margin: ['bottom']})} ${font({s: 'HNM5'})}`}>
          {end && 'Exhibition'}
          {!end && 'Permanent exhibition'}
        </p>

        <h2 className={`promo-link__title ${font({s: 'WB5'})} ${spacing({s: 0}, {margin: ['top']})}`}>{title}</h2>

        <p className={`${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})} no-padding`}>
          {end &&
            <Fragment><time dateTime={start}>{formatDate(start)}</time>—<time dateTime={end}>{formatDate(end)}</time></Fragment>
          }
          {!end && description}
        </p>

        <div className='flex flex--h-space-between flex--wrap margin-top-auto'>
          <span className={`${font({s: 'HNM5'})} flex flex--v-center`}>
            <span className={`${spacing({s: 1}, {margin: ['right']})} flex flex--v-center"`}>
              <Icon name='statusIndicator' extraClasses={`icon--match-text icon--${dateMessageAndColor.color}`} />
            </span>
            {dateMessageAndColor.text}
          </span>
        </div>
      </div>
    </a>
  );
};

export default ExhibitionPromo;