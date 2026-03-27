 import {
   AreaChart,
   Area,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
 } from "recharts";
 
 const data = [
   { name: "Mon", shifts: 45, completed: 42 },
   { name: "Tue", shifts: 52, completed: 50 },
   { name: "Wed", shifts: 48, completed: 46 },
   { name: "Thu", shifts: 55, completed: 53 },
   { name: "Fri", shifts: 60, completed: 58 },
   { name: "Sat", shifts: 38, completed: 36 },
   { name: "Sun", shifts: 32, completed: 30 },
 ];
 
 export function ShiftOverviewChart() {
   return (
     <div className="glass-card rounded-xl p-6">
       <div className="flex items-center justify-between mb-6">
         <div>
           <h3 className="font-semibold text-foreground">Shift Overview</h3>
           <p className="text-sm text-muted-foreground">Weekly performance</p>
         </div>
         <div className="flex items-center gap-4 text-sm">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-primary" />
             <span className="text-muted-foreground">Scheduled</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-success" />
             <span className="text-muted-foreground">Completed</span>
           </div>
         </div>
       </div>
       <div className="h-[280px]">
         <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={data}>
             <defs>
               <linearGradient id="colorShifts" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                 <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
               </linearGradient>
               <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                 <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
               </linearGradient>
             </defs>
             <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
             <XAxis
               dataKey="name"
               axisLine={false}
               tickLine={false}
               className="text-muted-foreground text-xs"
             />
             <YAxis
               axisLine={false}
               tickLine={false}
               className="text-muted-foreground text-xs"
             />
             <Tooltip
               contentStyle={{
                 backgroundColor: "hsl(var(--card))",
                 border: "1px solid hsl(var(--border))",
                 borderRadius: "8px",
               }}
             />
             <Area
               type="monotone"
               dataKey="shifts"
               stroke="hsl(217, 91%, 60%)"
               fillOpacity={1}
               fill="url(#colorShifts)"
               strokeWidth={2}
             />
             <Area
               type="monotone"
               dataKey="completed"
               stroke="hsl(142, 76%, 36%)"
               fillOpacity={1}
               fill="url(#colorCompleted)"
               strokeWidth={2}
             />
           </AreaChart>
         </ResponsiveContainer>
       </div>
     </div>
   );
 }