import { Card } from "~/components";

export const BoardCard = ({ flow }) => {
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
