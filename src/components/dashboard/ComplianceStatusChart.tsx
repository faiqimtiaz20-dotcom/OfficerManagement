 import {
   PieChart,
   Pie,
   Cell,
   ResponsiveContainer,
   Legend,
   Tooltip,
 } from "recharts";
 
 const data = [
   { name: "Compliant", value: 128, color: "hsl(142, 76%, 36%)" },
   { name: "Pending", value: 18, color: "hsl(38, 92%, 50%)" },
   { name: "Expired", value: 10, color: "hsl(0, 84%, 60%)" },
 ];
 
 export function ComplianceStatusChart() {
   return (
     <div className="glass-card rounded-xl p-6">
       <div className="mb-6">
         <h3 className="font-semibold text-foreground">Compliance Status</h3>
         <p className="text-sm text-muted-foreground">Officer compliance overview</p>
       </div>
       <div className="h-[280px]">
         <ResponsiveContainer width="100%" height="100%">
           <PieChart>
             <Pie
               data={data}
               cx="50%"
               cy="50%"
               innerRadius={60}
               outerRadius={100}
               paddingAngle={4}
               dataKey="value"
             >
               {data.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={entry.color} />
               ))}
             </Pie>
             <Tooltip
               contentStyle={{
                 backgroundColor: "hsl(var(--card))",
                 border: "1px solid hsl(var(--border))",
                 borderRadius: "8px",
               }}
             />
             <Legend
               verticalAlign="bottom"
               height={36}
               formatter={(value) => (
                 <span className="text-muted-foreground text-sm">{value}</span>
               )}
             />
           </PieChart>
         </ResponsiveContainer>
       </div>
       <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
         {data.map((item) => (
           <div key={item.name} className="text-center">
             <p className="text-2xl font-bold" style={{ color: item.color }}>
               {item.value}
             </p>
             <p className="text-xs text-muted-foreground">{item.name}</p>
           </div>
         ))}
       </div>
     </div>
   );
 }