import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Techcelerators LMS',
  description: 'Centralized lead management and allocation platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <h1 className="text-lg font-semibold">Techcelerators LMS</h1>
            <nav className="flex gap-4 text-sm">
              <Link href="/">Dashboard</Link>
              <Link href="/leads">Leads</Link>
              <Link href="/counselors">Counselors</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
