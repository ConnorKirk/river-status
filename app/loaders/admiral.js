const apiKey = process.env["ADMIRAL_API_KEY"];

const getTideTime = async () => {
  const duration = 2;
  const stationId = "0116";
  const url = `https://admiraltyapi.azure-api.net/uktidalapi/api/V1/Stations/${stationId}/TidalEvents?duration=${duration}`;

  const headers = { "Ocp-Apim-Subscription-Key": apiKey };
  return fetch(url, { headers })
    .then((resp) => resp.json())
    .then((events) =>
      events.map(({ EventType, DateTime, Height }) => ({
        eventType: EventType,
        dateTime: new Date(DateTime),
        height: Height,
      }))
    )
    .then((events) => ({
      events,
    }))
    .catch((err) => {
      console.error(err);
      throw Error(`Error in admiral loader: ${err}`);
    });
};

export { getTideTime };
