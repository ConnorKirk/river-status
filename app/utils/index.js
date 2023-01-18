export const diffHours = (dt, diff) => {
  const copy = new Date(dt);
  copy.setHours(copy.getHours() + diff);
  return copy;
};
