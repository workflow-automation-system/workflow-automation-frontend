import React from 'react';
import { Sun, Moon, Monitor, User, Key, Webhook, Bell, Shield } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useThemeStore from '../stores/themeStore';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Toggle from '../components/ui/Toggle';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Settings = () => {
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: false,
    workflowFailures: true,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Manage your account and application preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="font-semibold text-[var(--text-primary)]">Profile</h2>
          </div>
        </Card.Header>
        <Card.Body className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <Input
                label="Display Name"
                value={user?.name || ''}
                onChange={() => {}}
                disabled
              />
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Contact support to change your name
              </p>
            </div>
          </div>
          <Input
            label="Email Address"
            type="email"
            value={user?.email || ''}
            onChange={() => {}}
            disabled
          />
        </Card.Body>
      </Card>

      {/* Appearance Section */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            {theme === 'light' ? <Sun className="w-5 h-5 text-[var(--primary)]" /> : <Moon className="w-5 h-5 text-[var(--primary)]" />}
            <h2 className="font-semibold text-[var(--text-primary)]">Appearance</h2>
          </div>
        </Card.Header>
        <Card.Body>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Choose how FlowForge looks to you
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'light'
                  ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-5'
                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div className="w-full aspect-video bg-white rounded mb-3 border border-gray-200" />
              <div className="flex items-center justify-center gap-2">
                <Sun size={16} />
                <span className="font-medium">Light</span>
              </div>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'dark'
                  ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-5'
                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div className="w-full aspect-video bg-slate-800 rounded mb-3 border border-slate-700" />
              <div className="flex items-center justify-center gap-2">
                <Moon size={16} />
                <span className="font-medium">Dark</span>
              </div>
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'system'
                  ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-5'
                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div className="w-full aspect-video bg-gradient-to-r from-white to-slate-800 rounded mb-3 border border-gray-200" />
              <div className="flex items-center justify-center gap-2">
                <Monitor size={16} />
                <span className="font-medium">System</span>
              </div>
            </button>
          </div>
        </Card.Body>
      </Card>

      {/* API Configuration */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="font-semibold text-[var(--text-primary)]">API Configuration</h2>
          </div>
        </Card.Header>
        <Card.Body className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              API Key
            </label>
            <div className="flex gap-2">
              <Input
                value="sk_live_****************************"
                onChange={() => {}}
                disabled
                className="flex-1"
              />
              <Button variant="secondary">Regenerate</Button>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Used for API authentication. Keep this secret.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Webhook URL
            </label>
            <div className="flex gap-2">
              <Input
                value="https://api.flowforge.io/webhooks/****************************"
                onChange={() => {}}
                disabled
                className="flex-1"
              />
              <Button variant="secondary">Copy</Button>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Send POST requests to this URL to trigger workflows.
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Integrations */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <Webhook className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="font-semibold text-[var(--text-primary)]">Integrations</h2>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {[
              { name: 'Email Service (SMTP)', status: 'connected', icon: '📧' },
              { name: 'Slack', status: 'disconnected', icon: '💬' },
              { name: 'GitHub', status: 'disconnected', icon: '🐙' },
              { name: 'Jira', status: 'disconnected', icon: '📋' },
            ].map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-hover)]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{integration.icon}</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {integration.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={integration.status === 'connected' ? 'success' : 'default'}>
                    {integration.status}
                  </Badge>
                  <Button variant="secondary" size="sm">
                    {integration.status === 'connected' ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Notifications */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="font-semibold text-[var(--text-primary)]">Notifications</h2>
          </div>
        </Card.Header>
        <Card.Body className="space-y-4">
          <Toggle
            checked={notifications.email}
            onChange={(checked) =>
              setNotifications((prev) => ({ ...prev, email: checked }))
            }
            label="Email notifications for workflow failures"
          />
          <Toggle
            checked={notifications.push}
            onChange={(checked) =>
              setNotifications((prev) => ({ ...prev, push: checked }))
            }
            label="Push notifications"
          />
          <Toggle
            checked={notifications.workflowFailures}
            onChange={(checked) =>
              setNotifications((prev) => ({ ...prev, workflowFailures: checked }))
            }
            label="Daily workflow summary emails"
          />
        </Card.Body>
      </Card>

      {/* Security */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="font-semibold text-[var(--text-primary)]">Security</h2>
          </div>
        </Card.Header>
        <Card.Body className="space-y-4">
          <Button variant="secondary">Change Password</Button>
          <div className="pt-2">
            <Button variant="danger">Delete Account</Button>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Permanently delete your account and all associated data.
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;