const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });

export const formatCountryName = (countryCode: string): string =>
  displayNames.of(countryCode) ?? countryCode;

export const formatDestinationLabel = (
  city: string,
  countryCode: string,
): string => `${city}, ${formatCountryName(countryCode)}`;
