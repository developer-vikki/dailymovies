export default function SettingsPage() {
  return (
    <div>
      <div className="bg-white/3 border border-white/10 rounded-3xl p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <p className="text-zinc-400">This is the settings page.</p>
      </div>

      <div className="bg-white/3 border border-white/10 rounded-3xl p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
        <p className="text-zinc-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-white/3 border border-white/10 rounded-3xl p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Danger Zone</h2>
        <p className="text-zinc-400 mb-4">
          Be careful with these actions. They can have irreversible
          consequences.
        </p>
        <button className="inline-flex items-center justify-center gap-3 bg-red-600 rounded-2xl px-6 py-4 hover:opacity-90 transition">
          Delete Account
        </button>
      </div>
    </div>
  );
}
