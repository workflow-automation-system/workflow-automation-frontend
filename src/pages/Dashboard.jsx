import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, Activity, CheckCircle, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import useWorkflowStore from '../stores/workflowStore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { workflows } = useWorkflowStore();

  // Calculate stats from workflows
  const stats = React.useMemo(() => {
    const total = workflows.length;
    const active = workflows.filter((w) => w.status === 'active').length;
    const totalExecutions = workflows.reduce((sum, w) => sum + (w.executions?.length || 0), 0);
    const successRate = totalExecutions > 0
      ? (workflows.reduce((sum, w) => sum + (w.executions?.filter((e) => e.status === 'success').length || 0), 0) / totalExecutions) * 100
      : 0;

    return {
      totalWorkflows: total,
      activeWorkflows: active,
      totalExecutions,
      successRate: successRate.toFixed(1),
    };
  }, [workflows]);

  // Get recent workflows (sorted by lastExecution)
  const recentWorkflows = React.useMemo(() => {
    return [...workflows]
      .sort((a, b) => new Date(b.lastExecution) - new Date(a.lastExecution))
      .slice(0, 5);
  }, [workflows]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const statCards = [
    {
      label: 'Total Workflows',
      value: stats.totalWorkflows,
      icon: GitBranch,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Active Workflows',
      value: stats.activeWorkflows,
      icon: Activity,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Executions',
      value: stats.totalExecutions,
      icon: Clock,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Overview of your workflow automation
          </p>
        </div>
        <Button onClick={() => navigate('/create-workflow')}>
          Create Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Workflows */}
      <Card>
        <Card.Header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Workflows</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/workflows')}>
            View All <ArrowRight size={16} className="ml-1" />
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          {recentWorkflows.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No workflows yet. Create your first workflow to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {recentWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex items-center justify-between p-4 hover:bg-[var(--surface-hover)] cursor-pointer transition-colors"
                  onClick={() => navigate(`/workflow/${workflow.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary)] bg-opacity-10 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">
                        {workflow.name}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {workflow.nodes?.length || 0} nodes • Last run {formatDate(workflow.lastExecution)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={workflow.status === 'active' ? 'active' : 'inactive'}>
                      {workflow.status}
                    </Badge>
                    <CheckCircle
                      className={`w-5 h-5 ${
                        workflow.status === 'active' ? 'text-green-500' : 'text-gray-400'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hoverable onClick={() => navigate('/create-workflow')} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <GitBranch className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">New Workflow</h3>
              <p className="text-sm text-[var(--text-secondary)]">Create a new automation</p>
            </div>
          </div>
        </Card>
        <Card hoverable onClick={() => navigate('/workflows')} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Active Workflows</h3>
              <p className="text-sm text-[var(--text-secondary)]">{stats.activeWorkflows} running</p>
            </div>
          </div>
        </Card>
        <Card hoverable onClick={() => navigate('/settings')} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Success Rate</h3>
              <p className="text-sm text-[var(--text-secondary)]">{stats.successRate}% success</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;