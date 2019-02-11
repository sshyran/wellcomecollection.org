// @flow
import { exhibitionLd } from '@weco/common/utils/json-ld';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import DateAndStatusIndicator from '@weco/common/views/components/DateAndStatusIndicator/DateAndStatusIndicator';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import Body from '@weco/common/views/components/Body/Body';
import {
  default as PageHeader,
  getFeaturedMedia,
} from '@weco/common/views/components/PageHeader/PageHeader';
import type { UiExhibition } from '@weco/common/model/exhibitions';

type Props = {|
  installation: UiExhibition,
|};

const Installation = ({ installation }: Props) => {
  const FeaturedMedia = getFeaturedMedia({
    id: installation.id,
    title: installation.title,
    contributors: installation.contributors,
    contributorsTitle: installation.contributorsTitle,
    promo: installation.promo,
    body: installation.body,
    standfirst: installation.standfirst,
    promoImage: installation.promoImage,
    promoText: installation.promoText,
    image: installation.image,
    squareImage: installation.squareImage,
    widescreenImage: installation.widescreenImage,
    labels: installation.labels,
    metadataDescription: installation.metadataDescription,
  });

  const breadcrumbs = {
    items: [
      {
        text: 'Installations',
      },
      {
        url: `/installations/${installation.id}`,
        text: installation.title,
        isHidden: true,
      },
    ],
  };

  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{ labels: installation.labels }}
      title={installation.title}
      FeaturedMedia={FeaturedMedia}
      Background={<HeaderBackground hasWobblyEdge={true} />}
      ContentTypeInfo={
        <DateAndStatusIndicator
          start={installation.start}
          end={installation.end}
        />
      }
      HeroPicture={null}
    />
  );
  return (
    <PageLayout
      title={installation.title}
      description={
        installation.metadataDescription || installation.promoText || ''
      }
      url={{ pathname: `/installations/${installation.id}` }}
      jsonLd={exhibitionLd(installation)}
      openGraphType={'website'}
      siteSection={'whats-on'}
      imageUrl={
        installation.image &&
        convertImageUri(installation.image.contentUrl, 800)
      }
      imageAltText={installation.image && installation.image.alt}
    >
      <ContentPage
        id={installation.id}
        Header={Header}
        Body={<Body body={installation.body} />}
        contributorProps={{ contributors: installation.contributors }}
      />
    </PageLayout>
  );
};

export default Installation;