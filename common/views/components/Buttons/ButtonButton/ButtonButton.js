// @flow

import {font} from '../../../../utils/classnames';
import Icon from '../../Icon/Icon';

type Props = {|
  extraClasses?: string,
  icon?: string,
  text: string,
  eventTracking?: string,
  id?: string,
  disabled?: boolean,
  clickHandler?: (event: Event) => void
|}

const ButtonButton = ({
  id,
  extraClasses,
  icon,
  text,
  eventTracking,
  disabled,
  clickHandler
}: Props) => {
  const fontClasses = extraClasses && extraClasses.indexOf('btn--tertiary') > -1
    ? {s: 'HNM5'}
    : {s: 'HNM4'};
  return (
    <button
      id={id}
      className={`btn ${extraClasses || ''} ${font(fontClasses)}`}
      data-track-event={eventTracking}
      onClick={clickHandler}
      disabled={disabled}>
      <span className='flex-inline flex--v-center'>
        {icon && <Icon name={icon} />}
        <span className='btn__text'>{text}</span>
      </span>
    </button>
  );
};

export default ButtonButton;
