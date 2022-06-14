import React, { useContext } from 'react';
import Dayjs from 'dayjs';

export const TranslationContext = {
  t: key => key,
  tDateTimeParser: input => Dayjs(input)
};

export const TranslationProvider = ({ children, value }) => (
  <TranslationContext.Provider value={value}>
    {children}
  </TranslationContext.Provider>
);

export const useTranslationContext = () => useContext(TranslationContext);
