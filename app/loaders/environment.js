const getFlowRate = () => {
  return fetch(
    "https://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--i-15_min-m3_s"
  )
    .then((resp) => resp.json())
    .then((body) => ({
      flow: body.items?.latestReading?.value,
      dateTime: body.items.latestReading.dateTime,
    }));
};

export { getFlowRate };
