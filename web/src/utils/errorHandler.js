export const parseErrorMessage = (apiError) => {
  if (apiError?.response?.data?.message) {
    return apiError.response.data.message;
  }
  if (apiError?.response?.status && apiError?.response?.statusText) {
    return `${status} - ${statusText}`;
  }
  // request was made but no response was received
  if (apiError.request) {
    return error.request;
  }
  // Something happened in setting up the request that triggered this error
  if (apiError.message) {
    return apiError.message;
  }

  // fallback if we don't know
  return {
    message: 'Something went wrong',
    description: JSON.stringify(apiError),
  };
};

export const showErrorMessage = (apiError) => {
  // We can create a dispatch for alerts for error.
};
