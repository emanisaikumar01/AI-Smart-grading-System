import {
  Award,
  BookOpen,
  CalendarDays,
  Clock,
  MessageSquare,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Progress } from "../components/ui/Progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";

const studentStats: any[] = [
  { title: "Completed", value: 8, detail: "assignments finished", bg: "bg-emerald-100", icon: Award, color: "text-emerald-600" },
  { title: "In Progress", value: 2, detail: "near due date", bg: "bg-yellow-100", icon: Clock, color: "text-yellow-600" },
  { title: "Average", value: "81%", detail: "course average", bg: "bg-blue-100", icon: TrendingUp, color: "text-blue-600" },
  { title: "Feedback", value: 5, detail: "recent notes", bg: "bg-primary/10", icon: MessageSquare, color: "text-primary" },
];

const assignments: any[] = [
  { name: "Mechanics - Quiz 1", course: "Physics", due: "2026-08-20", progress: 100, score: "78%", status: "Graded" },
  { name: "Photosynthesis Worksheet", course: "Biology", due: "2026-08-25", progress: 80, score: "85%", status: "Graded" },
  { name: "Algebra - Homework 4", course: "Math", due: "2026-09-01", progress: 40, score: "-", status: "Submitted" },
];

const feedback: string[] = [
  "Show your unit conversions when computing answers.",
  "Good explanation of concepts; add one worked example.",
];

export function Student() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Track submissions, scores, and feedback from your courses.</p>
        </div>
        <Button className="w-full bg-gradient-ai text-white border-0 shadow-glow hover:opacity-90 md:w-auto">
          <UploadCloud className="mr-2 h-5 w-5" />
          Upload Assignment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {studentStats.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">No statistics available yet.</p>
            </CardContent>
          </Card>
        ) : (
          studentStats.map((stat) => (
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
          <CardHeader>
            <CardTitle>My Assignments</CardTitle>
            <CardDescription>Current work, grading status, and progress</CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">No assignments found.</div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.name}>
                    <TableCell className="font-medium">{assignment.name}</TableCell>
                    <TableCell>{assignment.course}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        {assignment.due}
                      </span>
                    </TableCell>
                    <TableCell className="min-w-32">
                      <Progress value={assignment.progress} className="h-2" />
                    </TableCell>
                    <TableCell className="font-medium">{assignment.score}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          assignment.status === "Graded"
                            ? "success"
                            : assignment.status === "Submitted"
                              ? "warning"
                              : "outline"
                        }
                      >
                        {assignment.status}
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
            <CardTitle>Latest Feedback</CardTitle>
            <CardDescription>Recommended improvements from recent grading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No feedback yet.</div>
            ) : (
              feedback.map((item) => (
                <div key={item} className="rounded-lg border border-primary/20 bg-[#1f2937]/55 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Study Note
                  </div>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
          <CardDescription>How your active subjects are moving this term</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="p-4 text-sm text-muted-foreground">No course progress available.</div>
        </CardContent>
      </Card>
    </div>
  );
}
