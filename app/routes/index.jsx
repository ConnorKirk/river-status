import { useLoaderData } from "remix";

export const loader = async () => {
  const resp = await fetch(
    "https://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--i-15_min-m3_s"
  );

  const body = await resp.json();

  const flow = body.items.latestReading.value;
  const dateTime = body.items.latestReading.dateTime;

  return { flow, dateTime };
};

export default function Index() {
  const { flow, dateTime } = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>What's the river status?</h1>
      <span>
        <h2>{flow} </h2>
        <i>
          m<sup>3</sup>/s
        </i>{" "}
        at {dateTime}
      </span>
    </div>
  );
}
