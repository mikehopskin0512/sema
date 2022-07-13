export default function uniqBy(arr, fn) {
  const map = new Map();
  return arr.filter((item) => {
    const key = fn(item);
    const isNew = !map.has(key);
    map.set(key, true);
    return isNew;
  });
}
