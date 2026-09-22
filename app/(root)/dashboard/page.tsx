import Image from "next/image";
import Link from "next/link";
import { getDashboardData } from "@/lib/actions/file.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { Chart } from "@/components/Chart";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { Thumbnail } from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import ActionDropdown from "@/components/ActionDropdown";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  // Single round-trip to the combined /dashboard endpoint instead of two parallel fetches.
  const { recentFiles, quota } = await getDashboardData();
  const usageSummary = getUsageSummary(quota);

  return (
    <div className="dashboard-container">
      <section>
        <Chart used={quota.used} />
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link href={summary.url} key={summary.title} className="dashboard-summary-card">
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image src={summary.icon} width={100} height={100} alt="" className="summary-type-icon" />
                  <h4 className="summary-type-size">{convertFileSize(summary.size) || 0}</h4>
                </div>
                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime date={summary.latestDate} className="text-center" />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
        {recentFiles.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {recentFiles.map((file: CloudenceFile) => (
              <Link href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3" key={file.$id}>
                <Thumbnail type={file.type} extension={file.extension} url={file.url} />
                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDateTime date={file.$createdAt} className="caption" />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
