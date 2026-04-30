import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Database,
  KeyRound,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Webhook,
} from 'lucide-react';

const connections = [
  { name: 'Slack', domain: 'Messaging', status: 'Healthy', lastSync: '2 min ago', scopes: 7 },
  { name: 'Notion', domain: 'Knowledge Base', status: 'Healthy', lastSync: '4 min ago', scopes: 5 },
  { name: 'Google Sheets', domain: 'Data', status: 'Healthy', lastSync: '10 min ago', scopes: 4 },
  { name: 'OpenAI', domain: 'AI', status: 'Warning', lastSync: '1 hour ago', scopes: 3 },
  { name: 'HubSpot', domain: 'CRM', status: 'Healthy', lastSync: '22 min ago', scopes: 6 },
];

const availableIntegrations = [
  { name: 'Salesforce', category: 'CRM' },
  { name: 'Stripe', category: 'Payments' },
  { name: 'Zendesk', category: 'Support' },
  { name: 'GitHub', category: 'Engineering' },
];

const AppConnections = () => {
  return (
    <div className="space-y-5 font-urbanist">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#292D32]">App Connections</h1>
          <p className="mt-1 text-sm text-[#5C5C5C]">
            Govern API integrations, webhook endpoints, and credential hygiene for enterprise automations.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#292D32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3C4249]"
        >
          <Plus size={16} />
          New Connection
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="enterprise-card p-5">
          <div className="mb-3 w-fit rounded-xl border border-[#E2E8F0] bg-[#D0FFA4] p-2.5">
            <Database size={18} className="text-[#292D32]" />
          </div>
          <p className="text-3xl font-bold text-[#292D32]">12</p>
          <p className="text-sm text-[#5C5C5C]">Connected Apps</p>
        </div>
        <div className="enterprise-card p-5">
          <div className="mb-3 w-fit rounded-xl border border-[#E2E8F0] bg-[#D0FFA4] p-2.5">
            <Webhook size={18} className="text-[#292D32]" />
          </div>
          <p className="text-3xl font-bold text-[#292D32]">26</p>
          <p className="text-sm text-[#5C5C5C]">Webhook Endpoints</p>
        </div>
        <div className="enterprise-card p-5">
          <div className="mb-3 w-fit rounded-xl border border-[#E2E8F0] bg-[#E2E8F0] p-2.5">
            <KeyRound size={18} className="text-[#292D32]" />
          </div>
          <p className="text-3xl font-bold text-[#292D32]">18</p>
          <p className="text-sm text-[#5C5C5C]">Rotated API Keys</p>
        </div>
        <div className="enterprise-card p-5">
          <div className="mb-3 w-fit rounded-xl border border-[#E2E8F0] bg-[#D0FFA4] p-2.5">
            <ShieldCheck size={18} className="text-[#292D32]" />
          </div>
          <p className="text-3xl font-bold text-[#292D32]">99.99%</p>
          <p className="text-sm text-[#5C5C5C]">Connector Uptime</p>
        </div>
      </div>

      <section className="enterprise-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#E2E8F0] px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#292D32]">Connected Apps</h2>
            <p className="text-sm text-[#5C5C5C]">Integration status, sync health, and permission scope visibility.</p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8A8A]" />
            <input
              type="text"
              placeholder="Search connections"
              className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-9 pr-3 text-sm text-[#292D32] focus:border-[#D0FFA4] focus:outline-none md:w-64"
            />
          </div>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {connections.map((connection) => (
            <div key={connection.name} className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#292D32]">{connection.name}</p>
                <p className="text-xs text-[#5C5C5C]">{connection.domain}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C5C5C]">
                <span className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1">{connection.scopes} scopes</span>
                <span className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1">Last sync {connection.lastSync}</span>
                {connection.status === 'Healthy' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#D0FFA4] px-2.5 py-1 font-semibold text-[#292D32]">
                    <CheckCircle2 size={12} />
                    Healthy
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#D0FFA4] px-2.5 py-1 font-semibold text-[#292D32]">
                    <AlertCircle size={12} />
                    Warning
                  </span>
                )}
                <button type="button" className="rounded-lg p-1.5 text-[#5C5C5C] hover:bg-white">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="enterprise-card p-5">
        <h2 className="text-lg font-semibold text-[#292D32]">Available Integrations</h2>
        <p className="mt-1 text-sm text-[#5C5C5C]">Add enterprise services and secure them with scoped credentials.</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {availableIntegrations.map((integration) => (
            <button
              key={integration.name}
              type="button"
              className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-left hover:border-[#D0FFA4]"
            >
              <p className="text-sm font-semibold text-[#292D32]">{integration.name}</p>
              <p className="text-xs text-[#5C5C5C]">{integration.category}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AppConnections;
