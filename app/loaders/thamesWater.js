const { THAMES_WATER_CLIENT_ID, THAMES_WATER_CLIENT_SECRET } = process.env;

const locations = [
  "Petersham Road",
  "Amyand Park Road, Twickenham",
  "Kingston Main",
  "Portsmouth Road, Uxbridge Road",
  "Mogden",
  "Hammersmith",
];
const base = "https://prod-tw-opendata-app.uk-e1.cloudhub.io";
const path = `/data/STE/v1/DischargeCurrentStatus`;
const query = (location) =>
  `?col_1=LocationName&operand_1=eq&value_1=${location}`;

export const getPooStatus = () => {
  const promises = locations.map(helper);
  return Promise.allSettled(promises)
    .then((arr) => arr.map(({ value }) => value))
    .then((pooStatuses) => ({ pooStatuses }))
    .catch(console.error);
};

const helper = (location) => {
  const req = new Request(`${base}${path}${query(location)}`, {
    headers: {
      client_id: THAMES_WATER_CLIENT_ID,
      client_secret: THAMES_WATER_CLIENT_SECRET,
    },
  });

  return fetch(req)
    .then((resp) => resp.json())
    .then(({ items }) => items)
    .then(([{ LocationName, AlertPast48Hours }, _]) => ({
      locationName: LocationName,
      alertPast24Hours: AlertPast48Hours ?? false,
    }))
    .catch((err) => {
      console.error(err);
      throw Error(`Error in thames water loader: ${err}`);
    });
};
