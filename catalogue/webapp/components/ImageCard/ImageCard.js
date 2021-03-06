// @flow
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import type { Props as ImageProps } from '@weco/common/views/components/Image/Image';
import Image from '@weco/common/views/components/Image/Image';
import { workLink } from '@weco/common/services/catalogue/routes';

type Props = {|
  id: string,
  image: ImageProps,
  onClick: (event: SyntheticEvent<HTMLAnchorElement>) => void,
|};

const ImageCard = ({ id, image, onClick }: Props) => {
  const [isEnhanced, setIsEnhanced] = useState(false);
  useEffect(() => setIsEnhanced(true), []);

  return (
    <NextLink {...workLink({ id })}>
      <a
        onClick={event => {
          trackEvent({
            category: 'ImageCard',
            action: 'open ExpandedImage modal',
            label: id,
          });

          onClick(event);
        }}
        id={id}
        title={isEnhanced ? 'Open modal window' : null}
      >
        <div
          className={`promo__image-container promo__image-container--constrained`}
        >
          <Image
            {...image}
            lazyload={true}
            sizesQueries={`(min-width: 1340px) 178px, (min-width: 960px) calc(25vw - 52px), (min-width: 600px) calc(33.24vw - 43px), calc(50vw - 27px)`}
            defaultSize={180}
          />
        </div>
      </a>
    </NextLink>
  );
};

export default ImageCard;
