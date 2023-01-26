const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const toPrettyDatetime = (dt) => {
  return new Date(dt).toLocaleTimeString("gb", options);
};

export const toPrettyTime = (dt) =>
  new Date(dt).toLocaleTimeString("gb", { timeStyle: "short" });

export const diffHours = (dt, diff) => {
  const copy = new Date(dt);
  copy.setHours(copy.getHours() + diff);
  return copy;
};
