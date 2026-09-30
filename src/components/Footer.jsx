export default function Footer({ profile, settings }) {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-slate-500">
        <span>
          © {new Date().getFullYear()} {profile?.name || "Gururaj Kulkarni"}. All rights reserved.
        </span>
        <span>{settings?.footerText || "Built with React + Firebase + Tailwind CSS."}</span>
      </div>
    </footer>
  );
}
