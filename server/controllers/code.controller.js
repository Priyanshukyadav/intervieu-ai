import { executeWithJudge0, Judge0ConfigurationError } from "../services/judge0.service.js";

const testInput = `4
4
2 7 11 15
9
3
3 2 4
6
2
3 3
6
4
-1 -2 -3 -4
-6`;

const expectedOutput = `0 1
1 2
0 1
1 3`;

const supportedLanguages = new Set(["cpp", "python", "java", "javascript", "kotlin"]);
const maxSourceBytes = 30000;
const maxOutputCharacters = 4000;
const runWindowMs = 60 * 1000;
const maxRunsPerWindow = 10;
const runsByUser = new Map();

function normalizeOutput(output) {
  return String(output || "").trim().split(/\s+/).join(" ");
}

function canRunAnotherSubmission(userId) {
  const now = Date.now();
  const recentRuns = (runsByUser.get(String(userId)) || [])
    .filter((timestamp) => now - timestamp < runWindowMs);

  if (recentRuns.length >= maxRunsPerWindow) {
    runsByUser.set(String(userId), recentRuns);
    return false;
  }

  recentRuns.push(now);
  runsByUser.set(String(userId), recentRuns);
  return true;
}

function truncateOutput(output) {
  if (!output) {
    return "";
  }
  return output.length > maxOutputCharacters
    ? `${output.slice(0, maxOutputCharacters)}\n[Output truncated]`
    : output;
}

export const runDsaCode = async (req, res) => {
  const { language, sourceCode } = req.body || {};
  if (!supportedLanguages.has(language)) {
    return res.status(400).json({ message: "Choose a supported programming language." });
  }
  if (typeof sourceCode !== "string" || !sourceCode.trim()) {
    return res.status(400).json({ message: "Write code before running the tests." });
  }
  if (Buffer.byteLength(sourceCode, "utf8") > maxSourceBytes) {
    return res.status(413).json({ message: "Code is too large to run." });
  }
  if (!canRunAnotherSubmission(req.userId)) {
    return res.status(429).json({ message: "You have reached the code-run limit. Please try again in a minute." });
  }

  try {
    const result = await executeWithJudge0({ language, sourceCode, input: testInput });
    const accepted = result.status?.id === 3 &&
      normalizeOutput(result.stdout) === normalizeOutput(expectedOutput);
    const status = result.status?.id === 3 && !accepted
      ? "Wrong Answer"
      : result.status?.description || "Execution failed";

    return res.json({
      accepted,
      status,
      testsPassed: accepted ? 4 : 0,
      totalTests: 4,
      output: truncateOutput(result.stdout),
      error: truncateOutput(result.compile_output || result.stderr || result.message),
      executionTime: result.time || null,
      memoryKb: result.memory || null,
    });
  } catch (error) {
    if (error instanceof Judge0ConfigurationError) {
      return res.status(503).json({
        message: "The code runner is not configured. Add JUDGE0_API_KEY to server/.env.",
      });
    }

    console.error("Judge0 code execution failed:", error.response?.status || error.message);
    const isRateLimited = error.response?.status === 429;
    return res.status(isRateLimited ? 429 : 502).json({
      message: isRateLimited
        ? "The code runner is busy. Please wait a moment and try again."
        : "The code runner is temporarily unavailable. Please try again.",
    });
  }
};
