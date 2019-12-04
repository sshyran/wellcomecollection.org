import { PrismicDocument } from './types';
import { getDocument } from './api';
import { parseNumber, parseGenericFields } from './parsers';
import { Place } from '../../model/places';

export function parsePlaceDoc(document: PrismicDocument): Place {
  const data = document.data;
  const genericFields = parseGenericFields(document);
  const labels = [{ url: null, text: 'Place' }];

  return {
    ...genericFields,
    labels,
    level: data.level && parseNumber(data.level),
    capacity: data.capacity && parseNumber(data.capacity),
    information: data.locationInformation,
  };
}

export async function getPlace(
  req: Request | null,
  id: string
): Promise<Place | null> {
  const document = await getDocument(req, id, {});

  if (document && document.type === 'places') {
    const place = parsePlaceDoc(document);
    return place;
  }
}
