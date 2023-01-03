import { useLoaderData } from "@remix-run/react";
import { getFlowRate, getTideTime } from "~/loaders";
import indexStyles from "~/styles/index.css";

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
      <Tides events={events} />
    </Container>
  );
}

const Flow = ({ flow, dateTime }) => (
  <>
    <p>The stream is</p>
    <div className="flow-measure">
      <h2>{flow}</h2>
      <i>
        m<sup>3</sup>/s
      </i>
    </div>
    at {dateTime}
  </>
);

const Board = ({ flow }) => {
  const getBoard = (flow) => {
    if (flow >= 200) return "Red Boards ❌";
    if (flow >= 160) return "Orange Boards 🟧";
    if (flow >= 120) return "Yellow Boards ⚠️";
    return "Clear Boards ✅";
  };

  return (
    <div>
      <p>This is {getBoard(flow)}</p>
    </div>
  );
};

const Tides = ({ events }) => {
  console.log({ events });
  const nextHighTide = events.filter(
    ({ eventType, dateTime }) =>
      eventType === "HighWater" && new Date(dateTime) > new Date()
  )[0];

  const nextLowTide = events.filter(
    ({ eventType, dateTime }) =>
      eventType === "LowWater" && new Date(dateTime) > new Date()
  )[0];

  return (
    <>
      {nextHighTide && <p>Hightide is at {nextHighTide.dateTime}</p>}
      {nextLowTide && <p>Lowtide is at {nextLowTide.dateTime}</p>}
    </>
  );
};

const Container = ({ children }) => <div className="container">{children}</div>;
