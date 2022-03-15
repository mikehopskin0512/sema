import * as yup from 'yup';

const linkRegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

export default yup.object().shape({
  title: yup
    .string()
    .required('Title is required'),
  author: yup
    .string()
    .required('Author is required'),
  comment: yup
    .string()
    .required('Body is required'),
  sourceName: yup
    .string()
    .required('Source Name is required'),
  sourceLink: yup
    .string()
    .matches(linkRegExp, 'Source should be a URL')
    .required('Source Name is required'),
  guides: yup
    .array()
    .nullable()
    .required('At least one label is required')
    .min(1, 'At least one label is required'),
  languages: yup
    .array()
    .nullable()
    .required('At least one language is required')
    .min(1, 'At least one language is required'),
});
