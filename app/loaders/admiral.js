const apiKey = process.env["ADMIRAL_API_KEY"];

const getTideTime = async () => {
  const duration = 1;
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
    }));
};

export { getTideTime };
