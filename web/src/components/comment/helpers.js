export const useValidateCommentForm = (comment) => {
  const requiredFields = {
    title: 'Title is required',
    languages: 'At least one language is required',
    guides: 'At least one guide is required',
    sourceName: 'Source Name is required',
    author: 'Author is required',
    comment: 'Body is required',
  };
  const fields = Object.keys(requiredFields);
  let errorFields = {};

  const validate = () => {
    errorFields = {};
    const emptyFields = fields.filter((key) => !comment[key]?.length);
    if (emptyFields.length) {
      emptyFields.forEach((key) => {
        errorFields[key] = { message: requiredFields[key] };
      });
    }
    const re = new RegExp("^(http|https)://", "i");
    const isLinkNotValid = !re.test(comment.sourceLink);
    if (isLinkNotValid) {
      errorFields.sourceLink = { message: 'Source should be a URL' };
    }
  }
  return {
    validate,
    errors: errorFields,
    isValid: !Object.keys(errorFields).length,
  }
};
