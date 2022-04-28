import * as yup from 'yup';

const schema = yup.object()
  .shape({
    title: yup.string()
      .nullable()
      .required('Title is required'),
    comment: yup.string()
      .nullable()
      .required('Comment is required'),
    source: yup.object()
      .shape({
        url: yup.string()
          .url('Source should be a URL')
          .nullable(),
      }),

  });

export default schema;
