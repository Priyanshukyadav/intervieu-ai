import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowLeft,
  FaBrain,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaComments,
  FaLaptop,
  FaRegLightbulb,
  FaUserTie,
  FaVideo,
} from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const coreFeatures = [
  {
    icon: <FaBrain size={22} />,
    label: "AI PRACTICE",
    title: "Choose your interview length",
    description:
      "Set the number of questions before you begin. Choose anywhere from 5 to 25, so each AI interview fits your available time and practice goals.",
    detail: "Pick a question count from 5–25",
    accent: "bg-violet-50 text-violet-600",
  },
  {
    icon: <FaVideo size={22} />,
    label: "FREE COMMUNITY",
    title: "Peer-to-Peer Mock Arena with AI Referee",
    description:
      "Practice by video with another student for free. A disclosed AI co-pilot can keep time, give the interviewer private follow-up prompts, and provide feedback to both peers.",
    detail: "Free peer interviews with AI-guided prompts and feedback",
    accent: "bg-sky-50 text-sky-600",
  },
  {
    icon: <FaComments size={22} />,
    label: "FREE COMMUNITY",
    title: "Debate Corner",
    description:
      "Join other students for structured debates on guided topics and practice explaining your ideas clearly and respectfully.",
    detail: "Debate with peers around guided topics",
    accent: "bg-amber-50 text-amber-600",
  },
  {
    icon: <FaUserTie size={22} />,
    label: "PRO SUBSCRIPTION",
    title: "Interview with industry professionals",
    description:
      "Choose an interviewer by role and seniority—such as SDE I, SDE II, or senior engineer—and book a time that works for you.",
    detail: "Select your interviewer and schedule a session",
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: <FaBrain size={22} />,
    label: "AI PRACTICE",
    title: "Multi-Panelist Bar Raiser Mode",
    description:
      "Practice a final-round panel with two AI personas: a friendly tech lead who guides architecture and a skeptical interviewer who probes scale, security, and edge cases using a distinct voice.",
    detail: "Two interviewer perspectives and voices",
    accent: "bg-fuchsia-50 text-fuchsia-600",
  },
  {
    icon: <FaLaptop size={22} />,
    label: "SYSTEM DESIGN",
    title: "Interactive System Design Whiteboard",
    description:
      "Sketch systems such as a URL shortener or messaging app. With your approval, vision AI can review the diagram for bottlenecks, single points of failure, caching, and data partitioning.",
    detail: "Draw architecture and request optional AI feedback",
    accent: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: <FaCalendarAlt size={22} />,
    label: "PLACEMENT PREP",
    title: "7-Day Company Placement Sprint",
    description:
      "Build a daily 30-minute practice plan for an upcoming company interview, adapting the schedule to areas to improve from your interview history.",
    detail: "Short daily tasks that unlock as you make progress",
    accent: "bg-orange-50 text-orange-600",
  },
  {
    icon: <FaCheckCircle size={22} />,
    label: "OPTIONAL PRACTICE",
    title: "Proctoring Simulation Mode",
    description:
      "Try an opt-in assessment simulation that flags tab changes and clipboard actions, with optional multiple-face checks and clear privacy controls.",
    detail: "Practice mode only, with clear notice and consent",
    accent: "bg-rose-50 text-rose-600",
  },
]

const extraIdeas = [
  {
    icon: <FaRegLightbulb size={20} />,
    title: "Candidate learning roadmap",
    description:
      "Get clear guidelines, step-by-step study plans, and progress milestones with support from education counselors.",
  },
  {
    icon: <FaComments size={20} />,
    title: "Structured peer feedback",
    description:
      "Share clear, useful feedback after peer sessions with prompts for communication and problem-solving.",
  },
  {
    icon: <FaCalendarAlt size={20} />,
    title: "Smarter scheduling",
    description:
      "Coordinate sessions across time zones with calendar reminders and easy rescheduling.",
  },
]

function UpcomingFeatures() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => navigate("/")}
            className="mb-10 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <FaArrowLeft size={13} />
            Back to home
          </button>

          <section className="relative overflow-hidden rounded-[32px] bg-[#101812] px-7 py-12 text-white shadow-xl md:px-14 md:py-16">
            <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="relative max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-emerald-300">
                <FaClock size={12} />
                WHAT WE’RE BUILDING
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl">
                The next step in interview practice.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                Explore advanced AI interviews, system design practice, peer
                learning, and adaptive preparation for your next opportunity.
              </p>
              <p className="mt-7 text-sm text-gray-400">
                These platform features are planned but not available yet. No
                launch dates have been announced.
              </p>
            </div>
          </section>

          <section className="py-16 md:py-20">
            <div className="mb-9 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Upcoming platform features
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-gray-900 md:text-4xl">
                Practice your way. Learn from real people.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {coreFeatures.map((feature) => (
                <article
                  key={feature.title}
                  className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.accent}`}>
                    {feature.icon}
                  </div>
                  <p className="mt-6 text-xs font-bold tracking-[0.15em] text-gray-400">
                    {feature.label}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-start gap-2 border-t border-gray-100 pt-5 text-sm font-medium text-gray-700">
                    <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-500" />
                    <span>{feature.detail}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="pb-16 md:pb-20">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  More ideas
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                  A little more help along the way.
                </h2>
              </div>
              <FaLaptop className="hidden text-4xl text-emerald-600 sm:block" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {extraIdeas.map((idea) => (
                <div
                  key={idea.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    {idea.icon}
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{idea.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {idea.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-4 flex flex-col items-start justify-between gap-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 md:flex-row md:items-center md:px-10">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Keep building your interview skills today.
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Explore the AI interview tools already available.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="shrink-0 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Explore current features
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default UpcomingFeatures
