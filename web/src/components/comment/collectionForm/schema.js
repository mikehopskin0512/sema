import * as yup from 'yup';

const labelRequiredMgs = 'At least one label is required';
const schema = yup.object().shape({
  languages: yup.array().nullable().required(labelRequiredMgs).min(1, labelRequiredMgs),
  others: yup.array().nullable().required(labelRequiredMgs).min(1, labelRequiredMgs),
  author: yup.string().nullable().required('Author is required'),
  sourceName: yup.string().nullable().required('Source Name is required'),
  sourceLink: yup.string().nullable().required('Source Link is required').matches(/https?:\/\//g, 'Invalid URL'),
  name: yup.string().nullable().required('Title is required'),
});

export default schema;
