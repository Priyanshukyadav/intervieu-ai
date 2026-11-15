import axios from "axios";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_HOST = "judge0-ce.p.rapidapi.com";
const LANGUAGE_PATTERNS = {
  cpp: /^C\+\+/i,
  python: /^Python\b/i,
  java: /^Java\b/i,
  javascript: /^JavaScript\b/i,
  kotlin: /^Kotlin\b/i,
};

let cachedLanguageIds;
let languageCacheExpiresAt = 0;
let languageRequest;

export class Judge0ConfigurationError extends Error {}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function createJudge0Client() {
  const apiKey = process.env.JUDGE0_API_KEY?.trim();
  if (!apiKey) {
    throw new Judge0ConfigurationError("JUDGE0_API_KEY is missing.");
  }

  return axios.create({
    baseURL: JUDGE0_API_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": JUDGE0_API_HOST,
    },
  });
}

async function getLanguageIds(client) {
  if (cachedLanguageIds && Date.now() < languageCacheExpiresAt) {
    return cachedLanguageIds;
  }

  if (!languageRequest) {
    languageRequest = client.get("/languages")
      .then(({ data }) => {
        if (!Array.isArray(data)) {
          throw new Error("Judge0 returned an invalid languages list.");
        }

        const languageIds = {};
        for (const [language, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
          const matches = data.filter((entry) => pattern.test(entry.name || ""));
          if (matches.length === 0) {
            throw new Error(`Judge0 does not have a language configured for ${language}.`);
          }
          languageIds[language] = Math.max(...matches.map((entry) => entry.id));
        }

        cachedLanguageIds = languageIds;
        languageCacheExpiresAt = Date.now() + 10 * 60 * 1000;
        return languageIds;
      })
      .finally(() => {
        languageRequest = null;
      });
  }

  return languageRequest;
}

export async function executeWithJudge0({ language, sourceCode, input }) {
  const client = createJudge0Client();
  const languageIds = await getLanguageIds(client);
  const { data: submission } = await client.post(
    "/submissions",
    {
      source_code: Buffer.from(sourceCode, "utf8").toString("base64"),
      language_id: languageIds[language],
      stdin: Buffer.from(input, "utf8").toString("base64"),
      cpu_time_limit: 2,
      cpu_extra_time: 1,
      wall_time_limit: 10,
      memory_limit: 256000,
      max_processes_and_or_threads: 20,
      max_file_size: 1024,
      enable_network: false,
    },
    {
      params: {
        base64_encoded: "true",
        wait: "false",
      },
    }
  );

  if (!submission.token) {
    throw new Error("Judge0 did not return a submission token.");
  }

  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    await wait(600);
    const { data: result } = await client.get(
      `/submissions/${encodeURIComponent(submission.token)}`,
      {
        params: {
          base64_encoded: "false",
          fields: "stdout,stderr,compile_output,status,time,memory,message",
        },
      }
    );

    if (result.status?.id > 2) {
      return result;
    }
  }

  throw new Error("Judge0 did not finish the submission before the timeout.");
}
