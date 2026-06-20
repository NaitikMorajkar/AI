import StepGuide from '../components/StepGuide'

export default function Setup() {
  const chatgptSetup = {
    title: 'Gemini API Setup',
    steps: [
      { text: 'Create an account at aistudio.google.com and get an API key.', code: 'https://aistudio.google.com/apikey' },
      { text: 'Create a new secret key and copy it immediately.' },
      { text: 'Create a .env file in your project root and add your key.', code: 'GEMINI_API_KEY=your-key-here' },
      { text: 'Install the Google Generative AI Python package.', code: 'pip install google-generativeai' },
      { text: 'Test your setup with a simple completion request.', code: `import google.generativeai as genai\nimport os\nfrom dotenv import load_dotenv\n\nload_dotenv()\ngenai.configure(api_key=os.getenv("GEMINI_API_KEY"))\n\nmodel = genai.GenerativeModel("gemini-2.0-flash")\nresponse = model.generate_content("Hello!")\nprint(response.text)` },
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
