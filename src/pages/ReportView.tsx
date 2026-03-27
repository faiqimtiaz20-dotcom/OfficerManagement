import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  REPORT_IDS,
  getReportById,
  canSeeReportCategory,
  mockAttendanceRows,
  mockSiteCoverageRows,
  mockOfficerPerfRows,
  mockComplianceRows,
  mockBS7858Rows,
  mockRevenueRows,
  mockCostChargeRows,
} from "@/data/reportsData";

export default function ReportView() {
  const { reportId } = useParams<{ reportId: string }>();
  const { user } = useAuth();
  const report = reportId ? getReportById(reportId) : undefined;
  const canSee = report ? canSeeReportCategory(user?.role, report.type) : false;

  if (!reportId || !report) {
    return (
      <MainLayout title="Report" subtitle="Not found">
        <p className="text-muted-foreground">Report not found.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/reports">Back to Reports</Link>
        </Button>
      </MainLayout>
    );
  }

  if (!canSee) {
    return (
      <MainLayout title="Report" subtitle="Access denied">
        <p className="text-muted-foreground">You do not have access to this report.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/reports">Back to Reports</Link>
        </Button>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={report.title} subtitle={report.description}>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/reports" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Link>
        </Button>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">{report.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {reportId === REPORT_IDS.SHIFT_ATTENDANCE && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Week</TableHead>
                    <TableHead>Total shifts</TableHead>
                    <TableHead>On time</TableHead>
                    <TableHead>Late</TableHead>
                    <TableHead>No-show</TableHead>
                    <TableHead>Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttendanceRows.map((row) => (
                    <TableRow key={row.week}>
                      <TableCell className="font-medium">{row.week}</TableCell>
                      <TableCell>{row.totalShifts}</TableCell>
                      <TableCell>{row.onTime}</TableCell>
                      <TableCell>{row.late}</TableCell>
                      <TableCell>{row.noShow}</TableCell>
                      <TableCell>{row.rate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {reportId === REPORT_IDS.SITE_COVERAGE && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Filled</TableHead>
                    <TableHead>Coverage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSiteCoverageRows.map((row) => (
                    <TableRow key={row.site}>
                      <TableCell className="font-medium">{row.site}</TableCell>
                      <TableCell>{row.required}</TableCell>
                      <TableCell>{row.filled}</TableCell>
                      <TableCell>{row.coverage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {reportId === REPORT_IDS.OFFICER_PERFORMANCE && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Officer</TableHead>
                    <TableHead>Shifts</TableHead>
                    <TableHead>On time</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOfficerPerfRows.map((row) => (
                    <TableRow key={row.officer}>
                      <TableCell className="font-medium">{row.officer}</TableCell>
                      <TableCell>{row.shifts}</TableCell>
                      <TableCell>{row.onTime}</TableCell>
                      <TableCell>{row.rating}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {reportId === REPORT_IDS.COMPLIANCE_SUMMARY && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockComplianceRows.map((row) => (
                    <TableRow key={row.status}>
                      <TableCell className="font-medium">{row.status}</TableCell>
                      <TableCell>{row.count}</TableCell>
                      <TableCell>{row.percentage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {reportId === REPORT_IDS.BS7858_OVERVIEW && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phase</TableHead>
                    <TableHead>Complete</TableHead>
                    <TableHead>In progress</TableHead>
                    <TableHead>Pending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBS7858Rows.map((row) => (
                    <TableRow key={row.phase}>
                      <TableCell className="font-medium">{row.phase}</TableCell>
                      <TableCell>{row.complete}</TableCell>
                      <TableCell>{row.inProgress}</TableCell>
                      <TableCell>{row.pending}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {reportId === REPORT_IDS.REVENUE_BY_CLIENT && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Shifts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRevenueRows.map((row) => (
                    <TableRow key={row.client}>
                      <TableCell className="font-medium">{row.client}</TableCell>
                      <TableCell>{row.revenue}</TableCell>
                      <TableCell>{row.shifts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {reportId === REPORT_IDS.COST_VS_CHARGE && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Charge rate</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCostChargeRows.map((row) => (
                    <TableRow key={row.site}>
                      <TableCell className="font-medium">{row.site}</TableCell>
                      <TableCell>{row.charge}</TableCell>
                      <TableCell>{row.cost}</TableCell>
                      <TableCell>{row.margin}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
