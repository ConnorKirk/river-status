import { useLoaderData } from "@remix-run/react";
import { getFlowRate, getTideTime } from "~/loaders";
import indexStyles from "~/styles/index.css";
import { Card } from "~/components";

export const loader = async () => {
  const { flow, dateTime } = await getFlowRate();
  const { events } = await getTideTime();

  return { flow, dateTime, events };
};

export const links = () => {
  return [{ rel: "stylesheet", href: indexStyles }];
};

export default function Index() {
  const { flow, dateTime, events } = useLoaderData();
  return (
    <Container>
      <h1>What's the river doing?</h1>
      <Flow flow={flow} dateTime={dateTime} />
      <Board flow={flow} />
      <Tides events={events} flow={flow} />
      {/* <Rules /> */}
    </Container>
  );
}

const Flow = ({ flow, dateTime }) => (
  <Card>
    <p>The stream is</p>
    <div className="flow-measure">
      <h2>{flow}</h2>
      <i>
        m<sup>3</sup>/s
      </i>
    </div>
    at {dateTime}
  </Card>
);

const Board = ({ flow }) => {
  const getBoard = (flow) => {
    if (flow >= 250) return "☠️☠️☠️ Very Red Boards ☠️☠️☠️";
    if (flow >= 200) return "Red Boards ❌";
    if (flow >= 160) return "Orange Boards 🟧";
    if (flow >= 120) return "Yellow Boards ⚠️";
    return "Clear Boards ✅";
  };

  return (
    <Card>
      <p>{getBoard(flow)}</p>
    </Card>
  );
};

const Tides = ({ events, flow }) => {
  const nextHighTide = events.filter(
    ({ eventType, dateTime }) =>
      eventType === "HighWater" && new Date(dateTime) > new Date()
  )[0];

  const nextLowTide = events.filter(
    ({ eventType, dateTime }) =>
      eventType === "LowWater" && new Date(dateTime) > new Date()
  )[0];

  return (
    <Card>
      {nextHighTide && (
        <>
          <p>
            Hightide is at {nextHighTide.dateTime}. Richmond Lock will open two
            hours before and close two hours after.
          </p>
          <p>
            The stream might be {flow - 100} between the lock opening and high
            tide
          </p>
          <p>
            The stream might be {flow + 60} between the high tide and the lock
            closing
          </p>
        </>
      )}
    </Card>
  );
};

const Container = ({ children }) => <div className="container">{children}</div>;
