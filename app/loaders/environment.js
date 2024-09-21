import { checkForStatus } from "~/utils";

const getFlowRate = () => {
  return fetch(
    "https://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--i-15_min-m3_s"
  )
    .then(checkForStatus)
    .then((resp) => resp.json())
    .then((body) => {
      const { latestReading } = body.items;

      if (!latestReading.value) {
        throw Error("No value from Environment Agency API");
      }
      return {
        flow: body.items.latestReading.value,
        dateTime: new Date(body.items.latestReading.dateTime),
      };
    })
    .catch((err) => {
      console.error(err);
      throw Error(`Error in environment api loader: ${err}`);
    });
};

export { getFlowRate };
