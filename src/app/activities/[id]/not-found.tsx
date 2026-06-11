import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { PageShell } from "@/shared/components/layout/PageShell";

export default function ActivityNotFound() {
  return (
    <PageShell narrow centered>
      <div className="max-w-sm space-y-4 text-center">
        <AlertCircle className="mx-auto h-14 w-14 text-red-500" />
        <h1 className="text-xl font-bold text-on-surface">Venue not found</h1>
        <p className="text-on-surface-variant">
          This venue may have been removed or the link is incorrect.
        </p>
        <Link href="/activities">
          <Button>Browse Venues</Button>
        </Link>
      </div>
    </PageShell>
  );
}
