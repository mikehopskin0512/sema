import * as yup from 'yup';

export default yup.object().shape({
  title: yup
    .string()
    .required('Title is required'),
  author: yup
    .string(),
  comment: yup
    .string()
    .required('Body is required'),
  sourceName: yup
    .string(),
  sourceLink: yup.string().url('Source should be a URL').nullable(),
  guides: yup
    .array()
    .nullable(),
  languages: yup
    .array()
    .nullable(),
});
