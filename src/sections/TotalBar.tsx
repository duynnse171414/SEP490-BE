import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TotalUserCard from "@/features/dashboard/components/totalUserCard";

export default function TotalBar() {
    return (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TotalUserCard />

        <Card>
            <CardHeader>
                <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-semibold">$12,345</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-semibold">567</p>
            </CardContent>
        </Card>
    </div>);
}