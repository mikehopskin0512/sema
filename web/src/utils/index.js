export const upsert = (arr, key, newval) => {
  const match = arr.find((item) => item._id === key);
  if (match) {
    const index = arr.findIndex(arr.find((item) => item._id === key));
    arr.splice(index, 1, newval);
  } else {
    arr.push(newval);
  }

  return arr;
};

export const dummy = () => {};
