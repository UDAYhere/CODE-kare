import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const platform = os.platform();
const asyncExecute = promisify(exec);
const History = [];

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDf8MG13OBYGqmsbz-vWjhsCqK-IbEZR_g", // ✅ Your new Gemini key
});

// ─── TOOLS ─────────────────────────────────────────────

async function executeCommand({ command }) {
  try {
    const { stdout, stderr } = await asyncExecute(command);
    if (stderr) return `Error: ${stderr}`;
    return `Success: ${stdout} || Task executed completely`;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

async function readFile({ path }) {
  const fs = await import("fs/promises");
  try {
    const content = await fs.readFile(path, "utf-8");
    return `Success: ${content}`;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

async function writeFile({ path, content }) {
  const fs = await import("fs/promises");
  try {
    await fs.writeFile(path, content);
    return `Success: File written to ${path}`;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

// ─── TOOL DECLARATIONS ────────────────────────────────

const executeCommandDeclaration = {
  name: "executeCommand",
  description: "Execute a shell command (create folders, run installs, etc.)",
  parameters: {
    type: "OBJECT",
    properties: {
      command: {
        type: "STRING",
        description: "Terminal command to run, e.g., mkdir, npm install",
      },
    },
    required: ["command"],
  },
};

const readFileDeclaration = {
  name: "readFile",
  description: "Read a file's content from disk",
  parameters: {
    type: "OBJECT",
    properties: {
      path: {
        type: "STRING",
        description: "Path to the file to read",
      },
    },
    required: ["path"],
  },
};

const writeFileDeclaration = {
  name: "writeFile",
  description: "Write content to a file on disk",
  parameters: {
    type: "OBJECT",
    properties: {
      path: {
        type: "STRING",
        description: "Path where the file should be saved",
      },
      content: {
        type: "STRING",
        description: "Code or content to write to the file",
      },
    },
    required: ["path", "content"],
  },
};

const availableTools = {
  executeCommand,
  readFile,
  writeFile,
};

// ─── AI AGENT FUNCTION ─────────────────────────────────

async function runAgent(userProblem) {
  History.push({ role: "user", parts: [{ text: userProblem }] });

  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: History,
      config: {
        systemInstruction: `
You are a professional AI fullstack developer agent. Your job is to build or edit frontend projects using terminal and file operations. Use only the tools provided (executeCommand, readFile, writeFile). Always follow the PLAN → EXECUTE → VALIDATE flow.

Your OS is: ${platform}

🧠 GENERAL BEHAVIOR:
- Start by asking clarification if user request is vague.
- Determine if the user wants a static HTML/CSS site or a React + Tailwind project.
- Execute terminal commands like 'mkdir', 'npm install', etc., using executeCommand.
- Use writeFile to generate HTML, CSS, JS, JSX, Tailwind config, etc.
- Use readFile to verify written files were created correctly.
- Warn before executing destructive commands like 'rm', 'del', or 'format'.

💡 Examples of user requests:
- "Build a portfolio website"
- "Create a responsive navbar in React using Tailwind CSS"
- "Setup a Vite React project with Tailwind"

⚛️ REACT + TAILWIND WORKFLOW (if requested):
1. Run: npx create-vite@latest my-app --template react
2. cd my-app
3. npm install
4. npm install -D tailwindcss postcss autoprefixer
5. npx tailwindcss init -p
6. Update tailwind.config.js → content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
7. Replace index.css with Tailwind layers (base, components, utilities)
8. Add Tailwind classes to React components

🧪 After every action, read the file back to confirm
📦 Give a final summary of all files and folders created

Only stop when the project is fully scaffolded and files validated.
        `,
        tools: [
          {
            functionDeclarations: [
              executeCommandDeclaration,
              readFileDeclaration,
              writeFileDeclaration,
            ],
          },
        ],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const { name, args } = response.functionCalls[0];
      const funCall = availableTools[name];
      const result = await funCall(args);

      History.push({
        role: "model",
        parts: [{ functionCall: response.functionCalls[0] }],
      });

      History.push({
        role: "user",
        parts: [{ functionResponse: { name, response: { result } } }],
      });
    } else {
      History.push({ role: "model", parts: [{ text: response.text }] });
      console.log(response.text);
      break;
    }
  }
}

// ─── MAIN APP BOOTSTRAP ───────────────────────────────

async function main() {
  console.log("🚀 Terminal AI Builder Ready!");
  const userProblem = readlineSync.question("💬 Ask me to build something: ");
  await runAgent(userProblem);
  main();
}

main();
