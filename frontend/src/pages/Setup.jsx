import StepGuide from '../components/StepGuide'

export default function Setup() {
  const chatgptSetup = {
    title: 'ChatGPT API Setup',
    steps: [
      { text: 'Create an account at platform.openai.com and navigate to the API keys page.', code: 'https://platform.openai.com/api-keys' },
      { text: 'Create a new secret key and copy it immediately.' },
      { text: 'Create a .env file in your project root and add your key.', code: 'OPENAI_API_KEY=sk-proj-your-key-here' },
      { text: 'Install the OpenAI Python package.', code: 'pip install openai' },
      { text: 'Test your setup with a simple completion request.', code: `from openai import OpenAI\nimport os\nfrom dotenv import load_dotenv\n\nload_dotenv()\nclient = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))\n\nresponse = client.chat.completions.create(\n  model="gpt-4o",\n  messages=[{"role": "user", "content": "Hello!"}]\n)\nprint(response.choices[0].message.content)` },
    ],
  }

  const ollamaSetup = {
    title: 'Ollama Local Installation',
    steps: [
      { text: 'Download and install Ollama from ollama.com.' },
      { text: 'Verify the installation.', code: 'ollama --version' },
      { text: 'Pull a model (e.g., Llama 3.2).', code: 'ollama pull llama3.2' },
      { text: 'Run the model interactively.', code: 'ollama run llama3.2' },
      { text: 'Use Ollama with Python via the HTTP API.', code: `import requests\nimport json\n\nresponse = requests.post(\n  "http://localhost:11434/api/generate",\n  json={\n    "model": "llama3.2",\n    "prompt": "Hello, how are you?",\n    "stream": False\n  }\n)\nprint(response.json()["response"])` },
    ],
  }

  const pyprojectSetup = {
    title: 'pyproject.toml Example',
    steps: [
      { text: 'Create a pyproject.toml in your project root with project metadata.' },
      { text: 'Basic project configuration:', code: `[build-system]\nrequires = ["setuptools>=68.0", "wheel"]\nbuild-backend = "setuptools.backends._legacy:_Backend"\n\n[project]\nname = "my-ai-project"\nversion = "0.1.0"\ndescription = "My AI-powered application"\nrequires-python = ">=3.10"\ndependencies = [\n    "openai>=1.0.0",\n    "python-dotenv>=1.0.0",\n    "fastapi>=0.100.0",\n    "uvicorn>=0.23.0",\n]` },
      { text: 'Add optional dev dependencies:', code: `[project.optional-dependencies]\ndev = [\n    "pytest>=7.0",\n    "ruff>=0.1.0",\n    "pre-commit>=3.0",\n]` },
      { text: 'Configure tools like ruff:', code: `[tool.ruff]\ntarget-version = "py310"\nline-length = 88\n\n[tool.ruff.lint]\nselect = ["E", "F", "I", "W"]` },
      { text: 'Install your project in editable mode:', code: 'pip install -e .' },
    ],
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Setup Guides</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Step-by-step instructions for configuring AI tools and environments.</p>

      <div className="space-y-8">
        <StepGuide {...chatgptSetup} />
        <StepGuide {...ollamaSetup} />
        <StepGuide {...pyprojectSetup} />
      </div>
    </div>
  )
}
