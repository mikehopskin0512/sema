import * as yup from 'yup';

const titleFieldValidationSchema = yup.object().shape({
  title: yup
    .string()
    .matches(/^[0-9A-Za-z()@:_ +.~#?&/=^\-*]*$/, 'Do not use ! % $ $'),
});

export default titleFieldValidationSchema;
