import {
  BarChart3,
  CheckCircle2,
  FileEdit,
  MessageSquareWarning,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";

const professorStats: any[] = [
  { title: "Active Classes", value: 4, detail: "Undergraduate and postgraduate", bg: "bg-primary/10", icon: Users, color: "text-primary" },
  { title: "Pending Reviews", value: 6, detail: "Awaiting professor judgment", bg: "bg-yellow-100", icon: MessageSquareWarning, color: "text-yellow-600" },
  { title: "Avg AI Confidence", value: "78%", detail: "Across recent evaluations", bg: "bg-emerald-100", icon: CheckCircle2, color: "text-emerald-600" },
  { title: "AI Reviewed", value: 124, detail: "Papers processed this month", bg: "bg-blue-100", icon: Sparkles, color: "text-blue-600" },
];

const gradingQueue: any[] = [
  { assignment: "Mechanics - Quiz 2", className: "PHY101", graded: 12, submitted: 30, confidence: "High", status: "Processing" },
  { assignment: "Organic Chemistry Lab", className: "CHEM201", graded: 0, submitted: 28, confidence: "Low", status: "Review" },
  { assignment: "Linear Algebra Test", className: "MATH202", graded: 15, submitted: 30, confidence: "Medium", status: "Ready" },
];

export function Professor() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professor Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage classes, AI grading, review queues, and result publishing.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/grade">
            <Button className="w-full bg-gradient-ai text-white border-0 shadow-glow hover:opacity-90 sm:w-auto">
              <Sparkles className="mr-2 h-5 w-5" />
              Start AI Grading
            </Button>
          </Link>
          <Button variant="outline" className="w-full bg-card sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            New Class
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {professorStats.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">No statistics available yet.</p>
            </CardContent>
          </Card>
        ) : (
          professorStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{stat.detail}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Grading Queue</CardTitle>
              <CardDescription>Assignments moving through AI evaluation</CardDescription>
            </div>
            <Link to="/upload">
              <Button variant="outline" size="sm" className="bg-card">
                <FileEdit className="mr-2 h-4 w-4" />
                Upload Papers
              </Button>
            </Link>
          </CardHeader>
            <CardContent>
            {gradingQueue.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">No items in grading queue.</div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-center">Graded</TableHead>
                  <TableHead className="text-center">AI Confidence</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradingQueue.map((item) => (
                  <TableRow key={item.assignment}>
                    <TableCell className="font-medium">{item.assignment}</TableCell>
                    <TableCell>{item.className}</TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {item.graded} / {item.submitted}
                    </TableCell>
                    <TableCell className="text-center font-medium">{item.confidence}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Ready"
                            ? "success"
                            : item.status === "Processing"
                              ? "warning"
                              : item.status === "Review"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Review Focus</CardTitle>
            <CardDescription>Questions that may need professor judgment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 text-sm text-muted-foreground">No AI review focus items.</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Progress</CardTitle>
          <CardDescription>Submission and grading coverage by active class</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="p-4 text-sm text-muted-foreground">No class progress data.</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Analytics are ready for this week</h3>
              <p className="text-sm text-muted-foreground">Compare class performance and identify weak concepts.</p>
            </div>
          </div>
          <Link to="/analytics">
            <Button variant="outline" className="w-full bg-card md:w-auto">Open Analytics</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
