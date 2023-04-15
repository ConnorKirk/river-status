import { MetersPerSecond, Card } from "~/components";
import { toPrettyDatetime } from "~/utils";

export const FlowCard = ({ flow, dateTime }) => {
  const now = new Date();
  const dt = new Date(dateTime);
  const oneHour = 1000 * 60 * 60;
  const stale = now - dt > oneHour;

  return (
    <Card title="Stream">
      <h2>
        <MetersPerSecond value={flow} />
      </h2>

      <span> at {toPrettyDatetime(dt)}</span>
      {stale && <p>⚠️ This measurement is stale. Please check conditions</p>}
    </Card>
  );
};
