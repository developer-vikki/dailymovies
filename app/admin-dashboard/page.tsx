import { Film, Users, FolderKanban, Eye } from "lucide-react";

const stats = [
  {
    title: "Total Movies",
    value: "1,240",
    icon: Film,
  },
  {
    title: "Users",
    value: "18K",
    icon: Users,
  },
  {
    title: "Categories",
    value: "24",
    icon: FolderKanban,
  },
  {
    title: "Daily Views",
    value: "220K",
    icon: Eye,
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-2 text-zinc-400">Welcome back, Admin</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">{stat.title}</p>

                  <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
                </div>

                <div className="rounded-xl bg-zinc-800 p-3">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent */}
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>

        <div className="space-y-4">
          <div className="rounded-xl bg-black/40 p-4">New movie uploaded</div>

          <div className="rounded-xl bg-black/40 p-4">User registered</div>

          <div className="rounded-xl bg-black/40 p-4">Category updated</div>
        </div>
      </div>
    </div>
  );
}
