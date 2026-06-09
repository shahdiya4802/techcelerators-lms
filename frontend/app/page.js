import { Card } from '@/components/ui/card';

const dashboardCards = [
  { title: 'Total Leads', value: '560 (seeded)' },
  { title: 'Counselors', value: '25 active' },
  { title: 'Lead Sources', value: '7 integrated' },
  { title: 'API Status', value: 'Ready for integration' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">CRM Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">
          Phase 1 foundation is initialized with MySQL schema, REST APIs, and seeded data.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => (
          <Card key={card.title} title={card.title} value={card.value} />
        ))}
      </section>
    </div>
  );
}
