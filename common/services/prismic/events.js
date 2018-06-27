// @flow
import {getDocument, getTypeByIds} from './api';
import {
  eventAccessOptionsFields,
  teamsFields,
  eventFormatsFields,
  placesFields,
  interpretationTypesFields,
  audiencesFields,
  eventSeriesFields,
  organisationsFields,
  peopleFields,
  contributorsFields
} from './fetch-links';
import {
  parseTitle,
  parseDescription,
  parseContributors,
  parseImagePromo,
  parsePlace,
  asText,
  asHtml,
  isDocumentLink,
  isEmptyObj,
  parseTimestamp,
  parseBoolean
} from './parsers';
import type {UiEvent, EventFormat} from '../../model/events';
import type {PrismicDocument, PrismicFragment, Team} from './types';

function parseEventFormat(frag: Object): ?EventFormat {
  return isDocumentLink(frag) ? {
    id: frag.id,
    title: parseTitle(frag.data.title),
    shortName: asText(frag.data.shortName),
    description: asHtml(frag.data.description)
  } : null;
}

function parseEventBookingType(eventDoc: Object): ?string {
  return !isEmptyObj(eventDoc.data.eventbriteEvent) ? 'Ticketed'
    : isDocumentLink(eventDoc.data.bookingEnquiryTeam) ? 'Enquire to book'
      : isDocumentLink(eventDoc.data.place) && eventDoc.data.place.data.capacity  ? 'First come, first served'
        : null;
}

// TODO: NOTE this doesn't have the A/B image test stuff in it
function parseEventDoc(document: PrismicDocument, scheduleDocs?: PrismicFragment): UiEvent {
  const data = document.data;
  const eventSchedule = scheduleDocs && scheduleDocs.results ? scheduleDocs.results.map(doc => parseEventDoc(doc)) : [];
  // matching https://www.eventbrite.co.uk/e/40144900478?aff=efbneb
  const eventbriteIdMatch = isEmptyObj(document.data.eventbriteEvent) ? null : /\/e\/([0-9]+)/.exec(document.data.eventbriteEvent.url);
  const identifiers = eventbriteIdMatch ? [{
    identifierScheme: 'eventbrite-id',
    value: eventbriteIdMatch[1]
  }] : [];

  const interpretations = document.data.interpretations.map(interpretation => isDocumentLink(interpretation.interpretationType) ? ({
    interpretationType: {
      title: parseTitle(interpretation.interpretationType.data.title),
      abbreviation: asText(interpretation.interpretationType.data.abbreviation),
      description: asHtml(interpretation.interpretationType.data.description),
      primaryDescription: asHtml(interpretation.interpretationType.data.primaryDescription)
    },
    isPrimary: Boolean(interpretation.isPrimary)
  }) : null).filter(_ => _);

  const eventbriteIdScheme = identifiers.find(id => id.identifierScheme === 'eventbrite-id');
  const eventbriteId = eventbriteIdScheme && eventbriteIdScheme.value;

  const audiences = document.data.audiences.map(audience => isDocumentLink(audience.audience) ? ({
    title: asText(audience.audience.data.title),
    description: asText(audience.audience.data.description)
  }) : null).filter(_ => _);

  const bookingEnquiryTeam = document.data.bookingEnquiryTeam.data && ({
    id: document.data.bookingEnquiryTeam.id,
    title: asText(document.data.bookingEnquiryTeam.data.title) || '',
    email: document.data.bookingEnquiryTeam.data.email,
    phone: document.data.bookingEnquiryTeam.data.phone,
    url: document.data.bookingEnquiryTeam.data.url
  }: Team);

  const series = document.data.series.map(series => isDocumentLink(series.series) ? ({
    id: series.series.id,
    title: asText(series.series.data.title),
    description: asHtml(series.series.data.description)
  }) : null).filter(_ => _);

  return {
    id: document.id,
    title: parseTitle(data.title),
    description: asText(data.description),
    contributors: data.contributors ? parseContributors(data.contributors) : [],
    place: isDocumentLink(data.place) ? parsePlace(data.place) : null,
    promo: document.data.promo && parseImagePromo(document.data.promo),
    audiences,
    bookingEnquiryTeam,
    bookingInformation: asHtml(document.data.bookingInformation),
    bookingType: parseEventBookingType(document), // TODO not used on page?
    cost: document.data.cost,
    format: document.data.format && parseEventFormat(document.data.format),
    identifiers, // TODO not used on page?
    interpretations,
    isDropIn: Boolean(document.data.isDropIn),
    series,
    schedule: eventSchedule,
    backgroundTexture: document.data.backgroundTexture.data && document.data.backgroundTexture.data.image.url,
    eventbriteId,
    isCompletelySoldOut: data.times && data.times.filter(time => !time.isFullyBooked).length === 0,
    times: data.times && data.times.map(frag => ({
      range: {
        startDateTime: parseTimestamp(frag.startDateTime),
        endDateTime: parseTimestamp(frag.endDateTime)
      },
      isFullyBooked: parseBoolean(frag.isFullyBooked)
    })),
    // TODO: (event migration)
    body: data.description ? [{
      type: 'text',
      weight: 'default',
      value: parseDescription(data.description)
    }] : []
  };
}

const fetchLinks = [].concat(
  eventAccessOptionsFields,
  teamsFields,
  eventFormatsFields,
  placesFields,
  interpretationTypesFields,
  audiencesFields,
  eventSeriesFields,
  organisationsFields,
  peopleFields,
  contributorsFields,
  eventSeriesFields
);

export async function getEvent(req: Request, id: string): Promise<?UiEvent> {
  const document = await getDocument(req, id, {
    fetchLinks: fetchLinks
  });

  if (document && document.type === 'events') {
    const scheduleIds = document.data.schedule.map(event => event.event.id);
    const eventScheduleDocs = scheduleIds.length > 0 && await getTypeByIds(req, ['events'], scheduleIds, {fetchLinks});
    const event = parseEventDoc(document, eventScheduleDocs || {});
    return event;
  }
}
