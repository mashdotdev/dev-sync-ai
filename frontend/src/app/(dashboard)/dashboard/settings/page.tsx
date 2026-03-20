import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-white/50 mt-1">Manage your account preferences.</p>
      </div>
      <div className="rounded-xl border border-white/[0.07] bg-[#0d0d1a] flex flex-col items-center gap-4 py-20 text-center">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Settings className="size-6 text-white/30" />
        </div>
        <div>
          <p className="font-semibold text-white">Coming soon</p>
          <p className="text-sm text-white/50 mt-1">Account settings will be available here.</p>
        </div>
      </div>
    </div>
  );
}
