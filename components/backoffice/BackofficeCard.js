import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BackofficeCard({ title, description }) {
  return (
    <Card className="min-h-48 rounded-lg border-dashed">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid min-h-24 place-items-center rounded-md border border-dashed bg-muted/30 text-sm font-medium text-muted-foreground">
          Empty card
        </div>
      </CardContent>
    </Card>
  );
}
