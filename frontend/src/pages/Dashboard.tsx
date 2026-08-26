import { Link } from "react-router-dom";
import { 
  FileText, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  BrainCircuit, 
  UploadCloud, 
  Play,
  ArrowRight,
  MoreVertical,
  Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";

const stats: any[] = [
  { title: "Assignments", value: 12, trend: "+8%", description: "since last week", bgColor: "bg-primary/20", icon: FileText, color: "text-primary" },
  { title: "Students", value: 248, trend: "+2%", description: "active this term", bgColor: "bg-emerald-100", icon: Users, color: "text-emerald-600" },
  { title: "Average Score", value: "82%", trend: "+1.5%", description: "class average", bgColor: "bg-blue-100", icon: CheckCircle2, color: "text-blue-600" },
  { title: "Pending Reviews", value: 5, trend: "-3%", description: "needs attention", bgColor: "bg-yellow-100", icon: TrendingUp, color: "text-yellow-600" },
];

const recentAssignments: any[] = [
  { id: "a1", name: "Mechanics - Quiz 1", subject: "Physics", graded: 20, students: 30, avgScore: "78%", status: "Processing" },
  { id: "a2", name: "Photosynthesis Worksheet", subject: "Biology", graded: 30, students: 30, avgScore: "85%", status: "Completed" },
  { id: "a3", name: "Algebra - Homework 3", subject: "Math", graded: 12, students: 25, avgScore: "72%", status: "Submitted" },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Good Morning, Teacher</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your grading activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">No statistics to display.</p>
            </CardContent>
          </Card>
        ) : (
          stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h2 className="text-3xl font-bold">{stat.value}</h2>
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">{stat.trend}</span>
                  <span className="text-muted-foreground ml-2">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 overflow-hidden relative border-none shadow-md">
          <div className="absolute inset-0 bg-gradient-ai opacity-10 dark:opacity-20 pointer-events-none" />
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">AI Grading Assistant</CardTitle>
                <CardDescription className="text-base mt-1 text-slate-200">
                  Automatically evaluate student answers using AI-powered semantic analysis.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-6 text-sm text-muted-foreground">No AI grading insights available.</div>
            <div className="flex flex-wrap gap-4">
              <Link to="/grade">
                <Button size="lg" className="bg-gradient-ai border-0 hover:opacity-90 shadow-glow text-white">
                  <Play className="mr-2 h-5 w-5" /> Start New Grading
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline">
                  <UploadCloud className="mr-2 h-5 w-5" /> Upload Answer Sheets
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Generated from recent evaluations</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              <div className="p-4 text-sm text-muted-foreground">No AI insights to display.</div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 border-t mt-4 pb-4">
            <Button variant="ghost" className="w-full text-primary mt-2">View All Insights</Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Assignments</CardTitle>
            <CardDescription>Overview of your latest grading tasks</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Progress</TableHead>
                <TableHead className="text-center">Avg Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.name}</TableCell>
                  <TableCell>{assignment.subject}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-muted-foreground">{assignment.graded} / {assignment.students}</span>
                  </TableCell>
                  <TableCell className="text-center font-medium">{assignment.avgScore}</TableCell>
                  <TableCell>
                    <Badge variant={
                      assignment.status === "Completed" ? "success" : 
                      assignment.status === "Processing" ? "warning" : 
                      assignment.status === "Pending" ? "default" : "outline"
                    }>
                      {assignment.status === "Processing" && <Clock className="mr-1 h-3 w-3 animate-pulse-slow" />}
                      {assignment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
