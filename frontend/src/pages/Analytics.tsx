import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { BrainCircuit, TrendingUp, AlertTriangle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs";

const performanceData = [
  { name: 'Week 1', score: 65 },
  { name: 'Week 2', score: 68 },
  { name: 'Week 3', score: 72 },
  { name: 'Week 4', score: 75 },
  { name: 'Week 5', score: 73 },
  { name: 'Week 6', score: 78 },
  { name: 'Week 7', score: 82 },
];

const gradeDistribution = [
  { name: 'A (90-100)', value: 15, color: '#10b981' },
  { name: 'B (80-89)', value: 35, color: '#3b82f6' },
  { name: 'C (70-79)', value: 25, color: '#f59e0b' },
  { name: 'D (60-69)', value: 15, color: '#f97316' },
  { name: 'F (<60)', value: 10, color: '#ef4444' },
];

const questionAnalysis = [
  { name: 'Q1 (Definitions)', score: 85 },
  { name: 'Q2 (Theory)', score: 78 },
  { name: 'Q3 (Derivations)', score: 62 },
  { name: 'Q4 (Application)', score: 45 },
  { name: 'Q5 (Numericals)', score: 52 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into student performance and class trends.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Average class score over the semester</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} domain={[40, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Overall grades for current term</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Students']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full grid grid-cols-2 gap-2 mt-4">
              {gradeDistribution.map((entry) => (
                <div key={entry.name} className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-primary/5 pb-4 border-b">
            <div className="flex items-center gap-2 text-primary">
              <BrainCircuit className="h-5 w-5" />
              <CardTitle>AI Actionable Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="p-4 flex gap-4 hover:bg-primary/10 transition-colors">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-full h-fit">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Struggling with Applications</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Students are scoring 35% below average on application-based questions (Q4). Consider dedicating a tutorial session to real-world problem solving.
                  </p>
                </div>
              </div>
              <div className="p-4 flex gap-4 hover:bg-primary/10 transition-colors">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full h-fit">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Theory Comprehension Improved</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Scores on theoretical definitions (Q1, Q2) have improved by 18% since the last assignment. The new reading materials are effective.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Question Analysis</CardTitle>
                <CardDescription>Average score per question type</CardDescription>
              </div>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="midterm">Midterm</TabsTrigger>
                  <TabsTrigger value="quiz">Quizzes</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={questionAnalysis} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 500}} width={120} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {questionAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score < 50 ? '#ef4444' : entry.score < 70 ? '#f59e0b' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
