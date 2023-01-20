import { useLoaderData } from "@remix-run/react";
import { getFlowRate, getPooStatus, getTideTime } from "~/loaders";
import indexStyles from "~/styles/index.css";
import { toPrettyDatetime, toPrettyTime, diffHours } from "~/utils";
import { Card } from "~/components";
import { json } from "@remix-run/node";

export const loader = async () => {
  const { flow, dateTime } = await getFlowRate();
  const { events } = await getTideTime();
  const { pooStatuses } = await getPooStatus();

  return json({ flow, dateTime, events, pooStatuses });
};

export const links = () => {
  return [{ rel: "stylesheet", href: indexStyles }];
};

export default function Index() {
  const { flow, dateTime, events, pooStatuses } = useLoaderData();
  return (
    <Wrapper>
      <h1 class="title">What's the river doing?</h1>
      <Container>
        <Flow flow={flow} dateTime={dateTime} />
        <Board flow={flow} />
        <PooAlert pooStatuses={pooStatuses} />
        <Tides events={events} flow={flow} />
        {/* <Rules /> */}
      </Container>
    </Wrapper>
  );
}

const Flow = ({ flow, dateTime }) => (
  <Card title="Stream">
    <h2>
      {flow}
      <i>
        {" "}
        m<sup>3</sup>/s
      </i>
    </h2>

    <span> at {toPrettyDatetime(new Date(dateTime))}</span>
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
    <Card title={"Boards"}>
      <p>{getBoard(flow)}</p>
    </Card>
  );
};

const Tides = ({ events, flow }) => {
  const nextHighTide = new Date(
    events.filter(
      ({ eventType, dateTime }) =>
        eventType === "HighWater" && new Date(dateTime) > new Date()
    )[0]?.dateTime
  );

  const twoHoursBefore = diffHours(nextHighTide, -2);
  const twoHoursAfter = diffHours(nextHighTide, 2);

  return (
    <Card title="Tides">
      {nextHighTide && (
        <>
          <p>Hightide is at {toPrettyTime(nextHighTide)}.</p>
          <p>
            Richmond Lock will open at {toPrettyTime(twoHoursBefore)} and close
            at {toPrettyTime(twoHoursAfter)}
          </p>
          <p>
            The stream might be
            <MetersPerSecond value={Math.floor(flow - 100)} /> between the lock
            opening and high tide
          </p>
          <p>
            The stream might be
            <MetersPerSecond value={Math.floor(flow + 60)} /> between the high
            tide and the lock closing
          </p>
        </>
      )}
    </Card>
  );
};

const Rules = () => (
  <Card>
    <ol>
      <li>
        <h2>Red Boards</h2>
        <p>No rowing</p>
      </li>
      <li>
        <h2>Orange Boards+</h2>
        <p>Coxed Fours, Quads and Eights</p>
        <p>Level 2 Cox with a Coach</p>
        <p>Turn at Glovers Island</p>
      </li>
      <li>
        <h2>Orange Boards</h2>
        <p>Fours, Quads and Eights</p>
        <p>Level 3 Cox, or Level 2 Cox with a Coach</p>
        <p>Turn at Glovers Island</p>
      </li>
      <li>
        <h2>Yellow Boards</h2>
        <p>Four blade rule, plus singles with captains permission</p>
        <p>Level 2 Sign off, or Level 1 with Coach</p>
        <p>Turn at Glovers Island</p>
      </li>
    </ol>
  </Card>
);

const PooAlert = ({ pooStatuses }) => {
  const recentDumps = pooStatuses.filter((status) => status.alertPast24Hours);

  return (
    <Card title={"Poo Alerts 💩"}>
      {recentDumps.length > 0 ? (
        recentDumps.map(({ locationName }, i) => <p key={i}>{locationName}</p>)
      ) : (
        <p>All Clear!</p>
      )}
    </Card>
  );
};

const MetersPerSecond = ({ value }) => (
  <span>
    {" "}
    {value} m<sup>3</sup>/s
  </span>
);

export const ErrorBoundary = ({ error }) =>
  console.error(error) || (
    <Card>
      <h1>Something went wrong</h1>
      <p>Sorry! You should probably tell Connor</p>
      <p>{error.message}</p>
      <code>
        <pre>{error.stack}</pre>
      </code>
    </Card>
  );


const Container = ({ children }) => <div className="container">{children}</div>;
const Wrapper = ({ children }) => <div className="wrapper">{children}</div>;
