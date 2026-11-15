import React, { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { StreamLanguage } from '@codemirror/language'
import { kotlin as kotlinMode } from '@codemirror/legacy-modes/mode/clike'
import { FaArrowLeft, FaPlay, FaRedoAlt } from 'react-icons/fa'
import axios from 'axios'
import { ServerUrl } from '../App'

const languageOptions = {
  cpp: { label: 'C++', extension: cpp() },
  python: { label: 'Python', extension: python() },
  java: { label: 'Java', extension: java() },
  javascript: { label: 'JavaScript', extension: javascript() },
  kotlin: { label: 'Kotlin', extension: StreamLanguage.define(kotlinMode) },
}

const starterCode = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(const vector<int>& nums, int target) {
    // Return the two distinct indices whose values add up to target.
    return {};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int testCases;
    if (!(cin >> testCases)) return 0;
    while (testCases--) {
        int n;
        cin >> n;
        vector<int> nums(n);
        for (int& value : nums) cin >> value;
        int target;
        cin >> target;

        vector<int> answer = twoSum(nums, target);
        cout << answer[0] << " " << answer[1] << "\\n";
    }
}`,
  python: `import sys

def two_sum(nums, target):
    # Return the two distinct indices whose values add up to target.
    return [-1, -1]

data = list(map(int, sys.stdin.buffer.read().split()))
if data:
    position = 0
    test_cases = data[position]
    position += 1
    for _ in range(test_cases):
        n = data[position]
        position += 1
        nums = data[position:position + n]
        position += n
        target = data[position]
        position += 1
        print(*two_sum(nums, target))`,
  java: `import java.util.*;

public class Main {
    static int[] twoSum(int[] nums, int target) {
        // Return the two distinct indices whose values add up to target.
        return new int[] {-1, -1};
    }

    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        if (!input.hasNextInt()) return;

        int testCases = input.nextInt();
        while (testCases-- > 0) {
            int n = input.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = input.nextInt();
            int target = input.nextInt();

            int[] answer = twoSum(nums, target);
            System.out.println(answer[0] + " " + answer[1]);
        }
    }
}`,
  javascript: `const fs = require("fs");

function twoSum(nums, target) {
  // Return the two distinct indices whose values add up to target.
  return [-1, -1];
}

const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
if (data.length) {
  let position = 0;
  const testCases = data[position++];
  for (let test = 0; test < testCases; test++) {
    const n = data[position++];
    const nums = data.slice(position, position + n);
    position += n;
    const target = data[position++];
    const answer = twoSum(nums, target);
    console.log(answer[0], answer[1]);
  }
}`,
  kotlin: `import java.util.Scanner

fun twoSum(nums: IntArray, target: Int): IntArray {
    // Return the two distinct indices whose values add up to target.
    return intArrayOf(-1, -1)
}

fun main() {
    val input = Scanner(System.\`in\`)
    if (!input.hasNextInt()) return

    var testCases = input.nextInt()
    while (testCases-- > 0) {
        val n = input.nextInt()
        val nums = IntArray(n) { input.nextInt() }
        val target = input.nextInt()
        val answer = twoSum(nums, target)
        println("\${answer[0]} \${answer[1]}")
    }
}`,
}

function DsaCodingInterview({ onExit }) {
  const [language, setLanguage] = useState('cpp')
  const [sourceByLanguage, setSourceByLanguage] = useState(starterCode)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [runError, setRunError] = useState('')

  const sourceCode = sourceByLanguage[language]

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value)
    setResult(null)
    setRunError('')
  }

  const handleRun = async () => {
    setIsRunning(true)
    setResult(null)
    setRunError('')

    try {
      const response = await axios.post(
        `${ServerUrl}/api/code/run`,
        { language, sourceCode },
        { withCredentials: true }
      )
      setResult(response.data)
    } catch (error) {
      console.error('DSA code execution failed:', error)
      setRunError(
        error.response?.data?.message || 'Could not run your code. Please try again.'
      )
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setSourceByLanguage((current) => ({
      ...current,
      [language]: starterCode[language],
    }))
    setResult(null)
    setRunError('')
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
            aria-label="Exit DSA interview"
          >
            <FaArrowLeft />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              DSA coding round
            </p>
            <h1 className="text-lg font-semibold text-slate-900">Two Sum</h1>
          </div>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          Easy
        </span>
      </header>

      <main className="grid min-h-[calc(100vh-73px)] gap-5 p-4 lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.2fr)] lg:p-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Arrays
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Hash Map
            </span>
          </div>

          <h2 className="text-xl font-semibold text-slate-900">Problem</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Given an integer array and a target, find the zero-based indices of
            two distinct elements whose values add up to the target. Exactly
            one valid answer exists for each test case.
          </p>

          <h3 className="mt-6 font-semibold text-slate-800">Input format</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The first line contains the number of test cases. For each test
            case, read the array length, the array values, and then the target.
          </p>

          <h3 className="mt-6 font-semibold text-slate-800">Sample input</h3>
          <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{`1
4
2 7 11 15
9`}</pre>

          <h3 className="mt-5 font-semibold text-slate-800">Sample output</h3>
          <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{`0 1`}</pre>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Your code is sent to the hosted Judge0 sandbox to run. Do not include
            passwords, API keys, or other secrets in your code.
          </p>
        </section>

        <section className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              Language
              <select
                value={language}
                onChange={handleLanguageChange}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                {Object.entries(languageOptions).map(([value, option]) => (
                  <option key={value} value={value}>{option.label}</option>
                ))}
              </select>
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <FaRedoAlt size={12} />
                Reset
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaPlay size={11} />
                {isRunning ? 'Running…' : 'Run tests'}
              </button>
            </div>
          </div>

          <div className="min-h-[420px] flex-1 bg-[#1e1e1e]">
            <CodeMirror
              value={sourceCode}
              height="520px"
              theme="dark"
              extensions={[languageOptions[language].extension]}
              onChange={(value) => {
                setSourceByLanguage((current) => ({ ...current, [language]: value }))
              }}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: true,
              }}
            />
          </div>

          <div className="min-h-36 border-t border-slate-200 bg-slate-50 p-4" aria-live="polite">
            <h2 className="text-sm font-semibold text-slate-800">Test results</h2>
            {isRunning && (
              <p role="status" className="mt-3 text-sm text-slate-600">
                Compiling and running your solution in the sandbox…
              </p>
            )}
            {runError && (
              <p role="alert" className="mt-3 text-sm text-red-600">{runError}</p>
            )}
            {result && (
              <div className="mt-3">
                <p className={`text-sm font-semibold ${result.accepted ? 'text-emerald-700' : 'text-red-700'}`}>
                  {result.accepted
                    ? `Accepted — all ${result.totalTests} tests passed`
                    : result.status}
                </p>
                {result.error && (
                  <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-xs text-red-700">
                    {result.error}
                  </pre>
                )}
                {result.output && (
                  <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-xs text-slate-700">
                    {result.output}
                  </pre>
                )}
                {result.executionTime && (
                  <p className="mt-2 text-xs text-slate-500">
                    Runtime: {result.executionTime}s
                    {result.memoryKb ? ` · Memory: ${result.memoryKb} KB` : ''}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default DsaCodingInterview
