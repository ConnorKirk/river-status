import { useLoaderData } from "@remix-run/react";
import { getFlowRate, getPooStatus, getTideTime } from "~/loaders";
import indexStyles from "~/styles/index.css";
import { toPrettyTime, diffHours } from "~/utils";
import { Card, FlowCard, MetersPerSecond } from "~/components";
import { json } from "@remix-run/node";

export const loader = async () => {
  const [flowRate, pooStatus, tideTimes] = await Promise.all([
    getFlowRate(),
    getPooStatus(),
    getTideTime(),
  ]);

  const { flow, dateTime } = flowRate;
  const { pooStatuses } = pooStatus;
  const { events } = tideTimes;

  return json({ flow, dateTime, events, pooStatuses });
};

export const links = () => {
  return [{ rel: "stylesheet", href: indexStyles }];
};

export const headers = () => {
  return { "Cache-Control": "public, s-maxage=300" };
};

export const meta = ({ data }) => {
  const { flow } = data;
  return {
    charset: "utf-8",
    "og:image": "",
    "og:title": "What's the river doing?",
    "og:description": `The stream is ${flow}`,
    title: "What's the river doing?",
    description: `The stream is ${flow}`,
    viewport: "width=device-width,initial-scale=1",
  };
};

export default function Index() {
  const { flow, dateTime, events, pooStatuses } = useLoaderData();

  return (
    <Wrapper>
      <h1 className="title">What's the river doing?</h1>
      <Container>
        <FlowCard flow={flow} dateTime={dateTime} />
        <PooAlert pooStatuses={pooStatuses} />
        <Tides events={events} flow={flow} />
        <Notes />
        <Footer />
      </Container>
    </Wrapper>
  );
}

const Tides = ({ events, flow }) => {
  const now = new Date();

  const firstHighTide = new Date(
    events.filter(
      ({ eventType, dateTime }) =>
        eventType === "HighWater" && new Date(dateTime) > diffHours(now, -2)
    )[0]?.dateTime
  );

  const twoHoursBefore = diffHours(firstHighTide, -2);
  const twoHoursAfter = diffHours(firstHighTide, 2);

  const isEbbTide = now > firstHighTide && now < twoHoursAfter;

  const secondHighTide = new Date(
    events.filter(
      ({ eventType, dateTime }) =>
        eventType === "HighWater" && new Date(dateTime) > new Date()
    )[1]?.dateTime
  );

  return (
    <Card title="Tides">
      <>
        {isEbbTide ? (
          <>
            <p>Hightide was at {toPrettyTime(firstHighTide)}</p>
            <b>The lock is open</b>
          </>
        ) : (
          <p>Hightide is at {toPrettyTime(firstHighTide)}.</p>
        )}
        <p>
          Richmond Lock will open at {toPrettyTime(twoHoursBefore)} and close at{" "}
          {toPrettyTime(twoHoursAfter)}
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
      {secondHighTide && (
        <p>The following hightide will be {toPrettyTime(secondHighTide)}</p>
      )}
    </Card>
  );
};;

const PooAlert = ({ pooStatuses }) => {
  const recentDumps = [
    ...pooStatuses.filter((status) => status.alertPast48Hours),
  ];

  return (
    <Card title={"Poo Alerts 💩"}>
      {recentDumps.length > 0 ? (
        <ul>
          {recentDumps.map(({ locationName }, i) => (
            <li key={i}>
              <p>{locationName}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>All Clear!</p>
      )}
    </Card>
  );
};

const Notes = () => (
  <Card title="Notes">
    <a
      target="_blank"
      href="https://www.twickenhamrc.co.uk/risk-assessment-table"
      rel="noreferrer"
    >
      Safety Assesment
    </a>
  </Card>
);

export const ErrorBoundary = ({ error }) =>
  console.error(error) || (
    <Card>
      <h1>Something went wrong 😅</h1>
      <p>Sorry! You should probably tell Connor</p>
      <details>
        <summary>Show me the error message!</summary>
        <p>{error.message}</p>
        <code>
          <pre>{error.stack}</pre>
        </code>
      </details>
    </Card>
  );

const Container = ({ children }) => <div className="container">{children}</div>;
const Wrapper = ({ children }) => <div className="wrapper">{children}</div>;

const Footer = () => (
  <footer>
    <p>
      Got feedback? <a href="mailto:status@ckp.fyi">Send me an email</a>{" "}
    </p>
  </footer>
);
