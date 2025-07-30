// import { GoogleGenAI } from "@google/genai";
// import readlineSync from "readline-sync";
// import { exec } from "child_process";
// import { promisify } from "util";
// import os from "os";

// const platform = os.platform();
// const asyncExecute = promisify(exec);
// const History = [];

// const ai = new GoogleGenAI({
//   apiKey: "AIzaSyDf8MG13OBYGqmsbz-vWjhsCqK-IbEZR_g", // ✅ Your new Gemini key
// });



// // ─── TOOLS ─────────────────────────────────────────────

// async function executeCommand({ command }) {
//   try {
//     const { stdout, stderr } = await asyncExecute(command);
//     if (stderr) return `Error: ${stderr}`;
//     return `Success: ${stdout} || Task executed completely`;
//   } catch (error) {
//     return `Error: ${error.message}`;
//   }
// }

// async function readFile({ path }) {
//   const fs = await import("fs/promises");
//   try {
//     const content = await fs.readFile(path, "utf-8");
//     return `Success: ${content}`;
//   } catch (error) {
//     return `Error: ${error.message}`;
//   }
// }

// async function writeFile({ path, content }) {
//   const fs = await import("fs/promises");
//   try {
//     await fs.writeFile(path, content);
//     return `Success: File written to ${path}`;
//   } catch (error) {
//     return `Error: ${error.message}`;
//   }
// }

// // ─── TOOL DECLARATIONS ────────────────────────────────

// const executeCommandDeclaration = {
//   name: "executeCommand",
//   description: "Execute a shell command (create folders, run installs, etc.)",
//   parameters: {
//     type: "OBJECT",
//     properties: {
//       command: {
//         type: "STRING",
//         description: "Terminal command to run, e.g., mkdir, npm install",
//       },
//     },
//     required: ["command"],
//   },
// };

// const readFileDeclaration = {
//   name: "readFile",
//   description: "Read a file's content from disk",
//   parameters: {
//     type: "OBJECT",
//     properties: {
//       path: {
//         type: "STRING",
//         description: "Path to the file to read",
//       },
//     },
//     required: ["path"],
//   },
// };

// const writeFileDeclaration = {
//   name: "writeFile",
//   description: "Write content to a file on disk",
//   parameters: {
//     type: "OBJECT",
//     properties: {
//       path: {
//         type: "STRING",
//         description: "Path where the file should be saved",
//       },
//       content: {
//         type: "STRING",
//         description: "Code or content to write to the file",
//       },
//     },
//     required: ["path", "content"],
//   },
// };

// const availableTools = {
//   executeCommand,
//   readFile,
//   writeFile,
// };

// // ─── AI AGENT FUNCTION ─────────────────────────────────

// async function runAgent(userProblem) {
//   History.push({ role: "user", parts: [{ text: userProblem }] });

//   while (true) {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: History,
//       config: {
//         systemInstruction: `
// You are a professional AI fullstack developer agent. Your job is to build or edit frontend projects using terminal and file operations. Use only the tools provided (executeCommand, readFile, writeFile). Always follow the PLAN → EXECUTE → VALIDATE flow.

// Your OS is: ${platform}

// 🧠 GENERAL BEHAVIOR:
// - Start by asking clarification if user request is vague.
// - Determine if the user wants a static HTML/CSS site or a React + Tailwind project.
// - Execute terminal commands like 'mkdir', 'npm install', etc., using executeCommand.
// - Use writeFile to generate HTML, CSS, JS, JSX, Tailwind config, etc.
// - Use readFile to verify written files were created correctly.
// - Warn before executing destructive commands like 'rm', 'del', or 'format'.

// 💡 Examples of user requests:
// - "Build a portfolio website"
// - "Create a responsive navbar in React using Tailwind CSS"
// - "Setup a Vite React project with Tailwind"

// ⚛️ REACT + TAILWIND WORKFLOW (if requested):
// 1. Run: npx create-vite@latest my-app --template react
// 2. cd my-app
// 3. npm install
// 4. npm install -D tailwindcss postcss autoprefixer
// 5. npx tailwindcss init -p
// 6. Update tailwind.config.js → content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
// 7. Replace index.css with Tailwind layers (base, components, utilities)
// 8. Add Tailwind classes to React components

// 🧪 After every action, read the file back to confirm
// 📦 Give a final summary of all files and folders created

// Only stop when the project is fully scaffolded and files validated.
//         `,
//         tools: [
//           {
//             functionDeclarations: [
//               executeCommandDeclaration,
//               readFileDeclaration,
//               writeFileDeclaration,
//             ],
//           },
//         ],
//       },
//     });

//     if (response.functionCalls && response.functionCalls.length > 0) {
//       const { name, args } = response.functionCalls[0];
//       const funCall = availableTools[name];
//       const result = await funCall(args);

//       History.push({
//         role: "model",
//         parts: [{ functionCall: response.functionCalls[0] }],
//       });

//       History.push({
//         role: "user",
//         parts: [{ functionResponse: { name, response: { result } } }],
//       });
//     } else {
//       History.push({ role: "model", parts: [{ text: response.text }] });
//       console.log(response.text);
//       break;
//     }
//   }
// }

// // ─── MAIN APP BOOTSTRAP ───────────────────────────────

// async function main() {
//   console.log("🚀 Terminal AI Builder Ready!");
//   const userProblem = readlineSync.question("💬 Ask me to build something: ");
//   await runAgent(userProblem);
//   main();
// }

// main();








// ----------------------------------------------------------------------

// import { GoogleGenAI } from "@google/genai";
// import fetch from "node-fetch";

// import readlineSync from "readline-sync";
// import { exec } from "child_process";
// import { promisify } from "util";
// import os from "os";

// const platform = os.platform();
// const asyncExecute = promisify(exec);
// const History = [];

// // const ai = new GoogleGenAI({
// //   apiKey: "AIzaSyDf8MG13OBYGqmsbz-vWjhsCqK-IbEZR_g", // ✅ Your new Gemini key
// // });

// const OPENROUTER_API_KEY = "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";
// const CLAUDE_MODEL = "anthropic/claude-sonnet-4";
// const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";


// // ─── TOOLS ─────────────────────────────────────────────

// async function executeCommand({ command }) {
//   try {
//     const { stdout, stderr } = await asyncExecute(command);
//     if (stderr) return `Error: ${stderr}`;
//     return `Success: ${stdout} || Task executed completely`;
//   } catch (error) {
//     return `Error: ${error.message}`;
//   }
// }

// async function readFile({ path }) {
//   const fs = await import("fs/promises");
//   try {
//     const content = await fs.readFile(path, "utf-8");
//     return `Success: ${content}`;
//   } catch (error) {
//     return `Error: ${error.message}`;
//   }
// }

// async function writeFile({ path, content }) {
//   const fs = await import("fs/promises");
//   try {
//     await fs.writeFile(path, content);
//     return `Success: File written to ${path}`;
//   } catch (error) {
//     return `Error: ${error.message}`;
//   }
// }

// // ─── TOOL DECLARATIONS ────────────────────────────────

// const executeCommandDeclaration = {
//   name: "executeCommand",
//   description: "Execute a shell command (create folders, run installs, etc.)",
//   parameters: {
//     type: "OBJECT",
//     properties: {
//       command: {
//         type: "STRING",
//         description: "Terminal command to run, e.g., mkdir, npm install",
//       },
//     },
//     required: ["command"],
//   },
// };

// const readFileDeclaration = {
//   name: "readFile",
//   description: "Read a file's content from disk",
//   parameters: {
//     type: "OBJECT",
//     properties: {
//       path: {
//         type: "STRING",
//         description: "Path to the file to read",
//       },
//     },
//     required: ["path"],
//   },
// };

// const writeFileDeclaration = {
//   name: "writeFile",
//   description: "Write content to a file on disk",
//   parameters: {
//     type: "OBJECT",
//     properties: {
//       path: {
//         type: "STRING",
//         description: "Path where the file should be saved",
//       },
//       content: {
//         type: "STRING",
//         description: "Code or content to write to the file",
//       },
//     },
//     required: ["path", "content"],
//   },
// };

// const availableTools = {
//   executeCommand,
//   readFile,
//   writeFile,
// };


// async function runAgent(userProblem) {
//   History.push({ role: "user", content: userProblem });

//   const response = await fetch(OPENROUTER_URL, {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: CLAUDE_MODEL,
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a professional AI fullstack developer agent.
// Your role is to build, modify, and scaffold frontend web projects using terminal and file operations only.
// Always follow the structured workflow: PLAN → EXECUTE → VALIDATE.

// 🖥️ Environment:
// - Operating System: ${platform}
// - Use only the available tools: executeCommand, readFile, and writeFile
// - Do not assume or simulate tools outside this environment

// 🧠 GENERAL BEHAVIOR:
// - Ask clarifying questions if the user’s request is vague
// - Determine whether the task requires:
//   - A static HTML/CSS/JS website
//   - A React + Tailwind CSS project
//   - A specific frontend component (e.g., navbar, hero, footer)
// - Use executeCommand to run setup commands
// - Use writeFile to generate code files
// - Use readFile to validate output — always confirm after writing
// - Warn before destructive actions like rm, del, or format

// 💡 Example User Requests:
// - Build a portfolio website using HTML/CSS/JS
// - Create a responsive navbar in React with Tailwind
// - Set up a React + Tailwind project using Vite
// - Add dark mode support

// ⚛️ REACT + TAILWIND PROJECT WORKFLOW:
// 1. Run: npx create-vite@latest my-app --template react
// 2. cd my-app
// 3. npm install
// 4. npm install -D tailwindcss postcss autoprefixer
// 5. npx tailwindcss init -p
// 6. In tailwind.config.js, set content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
// 7. Replace index.css with:
//    @tailwind base;
//    @tailwind components;
//    @tailwind utilities;
// 8. Add Tailwind classes in App.jsx or other components

// 🔁 LOOP:
// - Plan folder and file structure
// - Execute setup commands
// - Generate files
// - Validate content
// - Continue until the project is fully scaffolded and confirmed

// Final output should include a summary of all created files, folders, and steps taken.
// `,
//         },
//         ...History,
//       ],
//     }),
//   });

//   const data = await response.json();
//   // const reply = data.choices?.[0]?.message?.content || "❌ No reply from Claude";

//   // console.log(`\n🤖 Claude:\n${reply}\n`);
//   const message = data.choices?.[0]?.message?.content;

// if (!message) {
//   console.log("❌ No reply from Claude");
//   return;
// }

// console.log(`\n🤖 Claude:\n${message}\n`);

// if (message.includes("executeCommand(") || message.includes("readFile(") || message.includes("writeFile(")) {
//   const matchedTool = Object.keys(availableTools).find(tool => message.includes(`${tool}(`));
//   const argsMatch = message.match(new RegExp(`${matchedTool}\\(([^)]*)\\)`));
//   if (matchedTool && argsMatch) {
//     try {
//       const args = JSON.parse(argsMatch[1]);
//       const result = await availableTools[matchedTool](args);
//       console.log(`🛠 Tool '${matchedTool}' executed.\n📝 Result: ${result}\n`);
//     } catch (err) {
//       console.log(`❌ Failed to parse or execute tool: ${err.message}`);
//     }
//   }
// }

//   History.push({ role: "assistant", content: reply });
// }

// // ─── MAIN APP BOOTSTRAP ───────────────────────────────

// async function main() {
//   console.log("🚀 Terminal AI Builder Ready!");
//   const userProblem = readlineSync.question("💬 Ask me to build something: ");
//   await runAgent(userProblem);
//   main();
// }

// main();






// ------------------------------------------------------------------------------




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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAgent(userProblem) {
  History.push({ role: "user", parts: [{ text: userProblem }] });

  let retries = 3; // number of times to retry on quota error
  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: History,
        config: {
          systemInstruction: `
You are a professional AI fullstack developer agent.  
Your role is to build, modify, and debug frontend or fullstack (MERN) web projects using terminal and file operations.  
You must strictly use the available tools: executeCommand, readFile, and writeFile.  
Follow the structured workflow: PLAN → EXECUTE → VALIDATE.

🖥️ Environment:
- Operating System: ${platform}
- You can only run commands and edit files using the provided tools
- Do not assume internet access or external APIs unless the user specifies them

🧠 GENERAL BEHAVIOR:
1. If the request is vague, always ask clarifying questions before proceeding.
2. Identify the required stack:
   - Static HTML/CSS/JS site
   - React (with or without Tailwind)
   - MERN stack (MongoDB, Express, React, Node.js)
3. Plan the folder & file structure first before writing code.
4. For commands → use executeCommand (mkdir, npm install, npx, etc.)
5. For file creation/editing → use writeFile
6. For verifying changes → use readFile
7. Always validate after making changes.
8. When debugging code:
   - Use readFile to inspect the file
   - Identify and explain the bug
   - Suggest and implement the fix
9. Avoid destructive commands (rm, del, format) unless explicitly approved.

💡 EXAMPLES OF VALID USER REQUESTS:
- "Build an e-commerce site with React + plain CSS"
- "Setup a MERN stack project with authentication"
- "Debug my Express backend route"
- "Create a responsive portfolio in HTML/CSS/JS"
- "Edit an existing React component to add new features"

⚛️ MERN STACK WORKFLOW (if requested):
1. Setup backend:
   - mkdir server && cd server
   - npm init -y
   - npm install express mongoose cors dotenv
   - Create 'server.js' and connect to MongoDB
2. Setup frontend:
   - npx create-vite@latest client --template react
   - cd client && npm install
3. Configure CORS and API routes
4. Connect frontend to backend via Axios/Fetch
5. Setup '.env' for sensitive credentials

🎨 REACT + TAILWIND WORKFLOW (if requested):
1. npx create-vite@latest my-app --template react
2. cd my-app && npm install
3. npm install -D tailwindcss postcss autoprefixer
4. npx tailwindcss init -p
5. Configure 'tailwind.config.js' content paths
6. Replace 'index.css' with Tailwind layers:
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

🔁 LOOP:
1. PLAN the structure
2. EXECUTE commands & create files
3. VALIDATE via readFile
4. Debug & fix issues if errors occur
5. Continue until the project is fully functional

📦 Final Output:
- Summary of created/edited files
- Steps performed
- Any next steps or deployment advice
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

      // Check for function calls
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
        break; // ✅ Success, exit retry loop
      }

    } catch (error) {
      if (error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("429")) {
        console.log("⚠️ Quota limit reached. Waiting 20 seconds before retrying...");
        await delay(20000); // wait before retry
        retries--;
      } else {
        throw error; // If not quota related, stop trying
      }
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
