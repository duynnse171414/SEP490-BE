import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TotalUserCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Users</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">1,4342</p>
      </CardContent>
    </Card>
  );
};

export default TotalUserCard;