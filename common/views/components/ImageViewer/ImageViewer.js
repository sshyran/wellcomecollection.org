// @flow

import {spacing} from '../../../utils/classnames';
import {convertImageUri, convertIiifUriToInfoUri} from '../../../utils/convert-image-uri';
import Control from '../Buttons/Control/Control';

const commonBtnTracking = (id, trackTitle) => {
  return `"category": "component", "label": "id:${id}", title:${trackTitle}"`;
};

type Props = {|
  id: string,
  trackTitle: string,
  imageUrl: string
|}

const ImageViewer = ({id, trackTitle, imageUrl}: Props) => (
  <div className='js-image-viewer image-viewer'>
    <Control
      type='dark'
      text='View larger image'
      icon='zoomIn'
      extraClasses={`image-viewer__launch-button js-image-viewer__launch-button`}
      eventTracking={`{${commonBtnTracking(id, trackTitle)}, "action": "work-launch-image-viewer:btnClick"}`} />

    <div
      className='image-viewer__content'
      id={id}
      data-info-src={convertIiifUriToInfoUri(convertImageUri(imageUrl, 'full', false))}>

      <div className='image-viewer__controls flex flex-end flex--v-center'>
        <Control
          type='light'
          text='Zoom in'
          id={`zoom-in-${id}`}
          icon='zoomIn'
          extraClasses={`${spacing({s: 1}, {margin: ['right']})}`}
          eventTracking={`{${commonBtnTracking(id, trackTitle)}, "action": "work-zoom-in-button:click"}`} />
        <Control
          type='light'
          text='Zoom out'
          id={`zoom-out-${id}`}
          icon='zoomOut'
          extraClasses={`${spacing({s: 8}, {margin: ['right']})}`}
          eventTracking={`{${commonBtnTracking(id, trackTitle)}, "action": "work-zoom-out-button:click"}`} />
        <Control
          type='light'
          text='Close image viewer'
          icon='cross'
          extraClasses={`js-image-viewer__exit-button ${spacing({s: 2}, {margin: ['right']})}`}
          eventTracking={`{${commonBtnTracking(id, trackTitle)}, "action": "work-exit-image-viewer:btnClick"}`} />
      </div>

      <div className='image-viewer__image' id={`image-viewer-${id}`}></div>
    </div>
  </div>
);

export default ImageViewer;
