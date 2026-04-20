import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  GitBranch,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import useWorkflowStore from '../stores/workflowStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { workflows } = useWorkflowStore();

  const stats = React.useMemo(() => {
    const total = workflows.length;
    const active = workflows.filter((w) => w.status === 'active').length;
    const totalExecutions = workflows.reduce((acc, w) => acc + (w.executions?.length || 0), 0);
    const successfulExecutions = workflows.reduce(
      (acc, w) => acc + (w.executions?.filter((e) => e.status === 'success').length || 0),
      0
    );
    const successRate = totalExecutions ? ((successfulExecutions / totalExecutions) * 100).toFixed(1) : '0.0';

    return {
      total,
      active,
      totalExecutions,
      successRate,
    };
  }, [workflows]);

  const recentProjects = React.useMemo(
    () =>
      workflows.slice(0, 4).map((workflow, index) => ({
        id: workflow.id,
        name: workflow.name,
        owner: ['Platform Ops', 'Revenue Systems', 'Customer Ops', 'IT Security'][index % 4],
        steps: workflow.nodes?.length || 0,
      })),
    [workflows]
  );

  const activeScenarios = React.useMemo(
    () =>
      workflows
        .filter((workflow) => workflow.status === 'active')
        .slice(0, 5)
        .map((workflow) => ({
          id: workflow.id,
          name: workflow.name,
          lastRun: workflow.lastExecution,
          executions: workflow.executions?.length || 0,
        })),
    [workflows]
  );

  const formatLastRun = (dateString) => {
    if (!dateString) return 'No runs yet';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diff < 1) return 'Less than 1 hour ago';
    if (diff < 24) return `${diff} hour${diff === 1 ? '' : 's'} ago`;
    return date.toLocaleDateString();
  };

  const StatCard = ({ title, value, subtitle, accent = 'bg-[#CFDECA]' }) => (
    <div className="enterprise-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#5C5C5C]">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[#212121]">{value}</p>
          <p className="mt-1 text-xs text-[#8A8A8A]">{subtitle}</p>
        </div>
        <div className={`h-11 w-11 rounded-2xl border border-[#D8DFE9] ${accent}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-5 font-urbanist">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5C5C5C]">Enterprise Overview</p>
          <h1 className="mt-1 text-3xl font-bold text-[#212121]">Workflow Control Tower</h1>
          <p className="mt-2 max-w-3xl text-sm text-[#5C5C5C]">
            Monitor cross-department automations, reliability signals, and governance posture from a single workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/create-workflow')}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#212121] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3A3A3A]"
        >
          <Plus size={16} />
          Create Workflow
        </button>
      </div>

      <section className="bento-grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <StatCard
            title="Total Workflows"
            value={stats.total}
            subtitle="Production and draft automations"
            accent="bg-[#CFDECA]"
          />
        </div>
        <div className="lg:col-span-3">
          <StatCard
            title="Active Workflows"
            value={stats.active}
            subtitle="Currently enabled scenarios"
            accent="bg-[#EFF0A3]"
          />
        </div>
        <div className="lg:col-span-3">
          <StatCard
            title="Executions"
            value={stats.totalExecutions.toLocaleString()}
            subtitle="All workflow runs in scope"
            accent="bg-[#D8DFE9]"
          />
        </div>
        <div className="lg:col-span-3">
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            subtitle="Outcome reliability benchmark"
            accent="bg-[#CFDECA]"
          />
        </div>

        <article className="enterprise-card lg:col-span-8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#212121]">Recent Projects</h2>
              <p className="text-sm text-[#5C5C5C]">Reusable pipelines recently updated by your enterprise teams</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/workflows')}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#212121] hover:text-[#3A3A3A]"
            >
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {recentProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => navigate(`/workflow/${project.id}`)}
                className="flex w-full items-center justify-between rounded-2xl border border-[#D8DFE9] bg-white p-4 text-left transition-colors hover:border-[#CFDECA]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CFDECA]">
                    <GitBranch size={18} className="text-[#212121]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#212121]">{project.name}</p>
                    <p className="text-xs text-[#5C5C5C]">{project.owner}</p>
                  </div>
                </div>
                <span className="rounded-full border border-[#D8DFE9] bg-[#F6F5FA] px-3 py-1 text-xs font-medium text-[#5C5C5C]">
                  {project.steps} nodes
                </span>
              </button>
            ))}
          </div>
        </article>

        <article className="enterprise-card lg:col-span-4 p-6">
          <h2 className="text-lg font-semibold text-[#212121]">Active Scenarios</h2>
          <p className="mt-1 text-sm text-[#5C5C5C]">
            Running automations with enterprise-grade observability and controls.
          </p>

          <div className="mt-5 space-y-3">
            {activeScenarios.length === 0 && (
              <div className="rounded-2xl border border-[#D8DFE9] bg-white p-4 text-sm text-[#5C5C5C]">
                No active scenarios. Enable workflows from the Workflows page.
              </div>
            )}
            {activeScenarios.map((scenario) => (
              <div key={scenario.id} className="rounded-2xl border border-[#D8DFE9] bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#212121]">{scenario.name}</p>
                  <span className="rounded-full bg-[#CFDECA] px-2 py-1 text-[11px] font-semibold text-[#212121]">
                    Running
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#5C5C5C]">Last run: {formatLastRun(scenario.lastRun)}</p>
                <p className="mt-1 text-xs text-[#8A8A8A]">{scenario.executions} executions logged</p>
              </div>
            ))}
          </div>
        </article>

        <article className="enterprise-card lg:col-span-12 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#D8DFE9] bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#212121]" />
                <p className="text-sm font-semibold text-[#212121]">Security Posture</p>
              </div>
              <p className="text-sm text-[#5C5C5C]">Token vault healthy and webhook signatures enforced on all active flows.</p>
            </div>
            <div className="rounded-2xl border border-[#D8DFE9] bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <Users size={16} className="text-[#212121]" />
                <p className="text-sm font-semibold text-[#212121]">Team Readiness</p>
              </div>
              <p className="text-sm text-[#5C5C5C]">Department onboarding templates deployed for Operations, Finance, and IT.</p>
            </div>
            <div className="rounded-2xl border border-[#D8DFE9] bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <Building2 size={16} className="text-[#212121]" />
                <p className="text-sm font-semibold text-[#212121]">Enterprise Capacity</p>
              </div>
              <p className="text-sm text-[#5C5C5C]">Platform supports multi-step branching, error handling, and governed data mapping at scale.</p>
            </div>
          </div>
        </article>
      </section>

      <section className="enterprise-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF0A3]">
              <Sparkles size={16} className="text-[#212121]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#212121]">Recommended Next Action</h3>
              <p className="text-sm text-[#5C5C5C]">
                Deploy the enterprise incident-response template to standardize branch logic and fallback paths.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/templates')}
            className="inline-flex items-center gap-2 rounded-xl border border-[#D8DFE9] bg-white px-4 py-2 text-sm font-semibold text-[#212121] hover:border-[#CFDECA]"
          >
            Explore Templates
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
