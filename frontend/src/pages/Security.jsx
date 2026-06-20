import CodeBlock from '../components/CodeBlock'
import StepGuide from '../components/StepGuide'

export default function Security() {
  const envSteps = {
    title: 'API Key Best Practices',
    steps: [
      { text: 'Never hardcode API keys in your source code. Always use environment variables.' },
      { text: 'Create a .env file in your project root (add to .gitignore immediately):', code: `# .env\nGEMINI_API_KEY=your-key-here\nANTHROPIC_API_KEY=sk-ant-your-key-here` },
      { text: 'Add .env to your .gitignore to prevent accidental commits:', code: `# .gitignore\n.env\n*.env\n.env.local\n.env.*.local` },
      { text: 'Load environment variables in Python:', code: `from dotenv import load_dotenv\nimport os\n\nload_dotenv()\n\napi_key = os.getenv("GEMINI_API_KEY")\nif not api_key:\n    raise ValueError("GEMINI_API_KEY not set")` },
      { text: 'Use a secrets manager in production (e.g., Google Secret Manager, AWS Secrets Manager, HashiCorp Vault).' },
    ],
  }

  const precommitSteps = {
    title: 'Pre-commit Hooks (Gitleaks + Ruff)',
    steps: [
      { text: 'Create a .pre-commit-config.yaml file:', code: `repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
        args: ['--verbose']

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format` },
      { text: 'Install pre-commit:', code: 'pip install pre-commit' },
      { text: 'Install the git hooks:', code: 'pre-commit install' },
      { text: 'Run against all files:', code: 'pre-commit run --all-files' },
    ],
  }

  const semgrepSteps = {
    title: 'Semgrep Scan Commands',
    steps: [
      { text: 'Install Semgrep:', code: 'pip install semgrep' },
      { text: 'Run a general scan:', code: 'semgrep scan --config=auto .' },
      { text: 'Scan for Python-specific issues:', code: 'semgrep scan --config=p/python .' },
      { text: 'Scan for API key leaks:', code: 'semgrep scan --config=supply-chain .' },
      { text: 'Integrate Semgrep in CI:', code: `# GitHub Actions example\n# .github/workflows/semgrep.yml\nname: Semgrep\non: [pull_request]\njobs:\n  semgrep:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: pip install semgrep\n      - run: semgrep scan --config=auto .` },
    ],
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Security</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Best practices for securing your AI development workflow.</p>

      <div className="space-y-8">
        <StepGuide {...envSteps} />
        <StepGuide {...precommitSteps} />
        <StepGuide {...semgrepSteps} />
      </div>
    </div>
  )
}
