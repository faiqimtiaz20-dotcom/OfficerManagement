import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Download,
  FileText,
  PieChart,
  TrendingUp,
  Users,
  Calendar,
  PoundSterling,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  reportsList,
  canSeeReportCategory,
  type ReportId,
} from "@/data/reportsData";

export default function Reports() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const visibleReports = reportsList.filter((r) => canSeeReportCategory(user?.role, r.type));

  const handleView = (id: ReportId) => {
    navigate(`/reports/${id}`);
  };

  const handleDownload = (title: string) => {
    toast.info(`Export "${title}" — PDF/Excel export will be available in a future release.`);
  };

  return (
    <MainLayout title="Reports" subtitle="Analytics and reporting">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">£245,000</p>
                  <p className="text-xs text-success">+12% vs last month</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <PoundSterling className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Shifts</p>
                  <p className="text-2xl font-bold">1,248</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold">96.5%</p>
                  <p className="text-xs text-success">+2.3% improvement</p>
                </div>
                <div className="p-3 rounded-full bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleReports.map((report) => (
            <Card key={report.id} className="glass-card hover-lift">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <report.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {report.type}
                  </span>
                </div>
                <CardTitle className="text-lg mt-4">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleView(report.id)}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(report.title)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {visibleReports.length === 0 && (
          <Card className="glass-card">
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reports available for your role.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
