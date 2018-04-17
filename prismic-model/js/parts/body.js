// @flow
import structuredText from './structured-text';
import captionedImageSlice from './captioned-image-slice';
import captionedImageGallerySlice from './captioned-image-gallery-slice';
import list from './list';
import link from './link';

export default {
  'fieldset': 'Body content',
  'type': 'Slices',
  'config': {
    'labels': {
      'editorialImage': [
        {
          'name': 'supporting',
          'display': 'Supporting'
        },
        {
          'name': 'standalone',
          'display': 'Standalone'
        }
      ]
    },
    'choices': {
      'text': {
        'type': 'Slice',
        'fieldset': 'Text',
        'non-repeat': {
          'text': structuredText('Text', 'multi', ['heading2', 'list-item'])
        }
      },
      // These should probably be called captionedImage etc, but legacy says no
      'editorialImage': captionedImageSlice(),
      'editorialImageGallery': captionedImageGallerySlice(),
      'contentList': list('Content list', {
        item: link('Content item', 'document', ['info-pages'])
      })
    }
  }
};
