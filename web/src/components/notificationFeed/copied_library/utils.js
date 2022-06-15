import { useMemo } from 'react';
import Dayjs from 'dayjs';

export function isTimezoneAwareTimestamp(timestamp) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3,6}(Z$|[+-]\d{2}:\d{2}$)/.test(
    timestamp
  );
}

export function humanizeTimestamp(timestamp, tDateTimeParser) {
  let time;
  // Following calculation is based on assumption that tDateTimeParser()
  // either returns momentjs or dayjs object.

  // When timestamp is not timezone-aware, we are supposed to take it as UTC time.
  // Ideally we need to adhere to RFC3339. Unfortunately this needs to be fixed on backend.
  if (typeof timestamp === 'string' && isTimezoneAwareTimestamp(timestamp)) {
    time = tDateTimeParser(timestamp);
  } else {
    time = tDateTimeParser(timestamp).add(
      Dayjs(timestamp).utcOffset(),
      'minute'
    ); // parse time as UTC
  }
  return time.fromNow();
}

export const useOnClickUser = onClickUser =>
  useMemo(
    () =>
      onClickUser
        ? user => event => {
            event.stopPropagation();
            onClickUser(user);
          }
        : undefined,
    [onClickUser]
  );
