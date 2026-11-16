import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../App'
import { FaArrowLeft, FaCalendarAlt, FaClock, FaTrash } from 'react-icons/fa'

function formatDateTime(value) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Date unavailable'
    return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
}

function getDurationSeconds(item) {
    if (Number.isFinite(item.durationSeconds)) {
        return item.durationSeconds
    }

    if (item.status !== 'completed' && !item.endedAt) return null

    const start = Date.parse(item.createdAt)
    const finish = Date.parse(item.endedAt || item.completedAt || item.updatedAt)
    if (!Number.isFinite(start) || !Number.isFinite(finish)) return null
    return Math.max(0, Math.floor((finish - start) / 1000))
}

function formatDuration(seconds) {
    if (!Number.isFinite(seconds)) return 'Not captured'

    const totalSeconds = Math.floor(seconds)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const remainingSeconds = totalSeconds % 60

    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m ${remainingSeconds}s`
    return `${remainingSeconds}s`
}

function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const [deletingId, setDeletingId] = useState(null)
    const [deleteError, setDeleteError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })

                setInterviews(result.data)

            } catch (error) {
                console.log(error)
            }

        }

        getMyInterviews()

    }, [])

    const handleDelete = async (event, interview) => {
        event.stopPropagation()
        const confirmed = window.confirm('Delete this interview history? This cannot be undone.')
        if (!confirmed) return

        setDeletingId(interview._id)
        setDeleteError('')
        try {
            await axios.delete(`${ServerUrl}/api/interview/${interview._id}`, {
                withCredentials: true,
            })
            setInterviews((current) => current.filter((item) => item._id !== interview._id))
        } catch (error) {
            console.error('Failed to delete interview history:', error)
            setDeleteError(
                error.response?.data?.message ||
                    error.message ||
                    'Could not delete this interview. Please try again.'
            )
        } finally {
            setDeletingId(null)
        }
    }


    return (
        <div className='min-h-screen bg-linear-to-br from-gray-50 to-emerald-50 py-10' >
            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>

                <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
                    <button
                        onClick={() => navigate("/")}
                        className='mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition'><FaArrowLeft className='text-gray-600' /></button>

                    <div>
                        <h1 className='text-3xl font-bold flex-nowrap text-gray-800'>
                            Interview History
                        </h1>
                        <p className='text-gray-500 mt-2'>
                            Track your past interviews and performance reports
                        </p>

                    </div>
                </div>

                {deleteError && (
                    <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {deleteError}
                    </p>
                )}

                {interviews.length === 0 ?
                    <div className='bg-white p-10 rounded-2xl shadow text-center'>
                        <p className='text-gray-500'>
                            No interviews found. Start your first interview.
                        </p>

                    </div>

                    :

                    <div className='grid gap-6'>
                        {interviews.map((item) => {
                            const durationSeconds = getDurationSeconds(item)
                            return (
                            <div key={item._id}
                            onClick={()=>navigate(`/report/${item._id}`)}
                             className='bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {item.role}
                                        </h3>

                                        <p className="text-gray-500 text-sm mt-1">
                                            {item.experience} • {item.mode}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                                            <span className="inline-flex items-center gap-2">
                                                <FaCalendarAlt className="text-emerald-600" />
                                                {formatDateTime(item.createdAt)}
                                            </span>
                                            <span className="inline-flex items-center gap-2">
                                                <FaClock className="text-emerald-600" />
                                                Duration: {formatDuration(durationSeconds)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='flex flex-wrap items-center gap-4 md:gap-6'>

                                        {/* SCORE */}
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-emerald-600">
                                                {item.finalScore || 0}/10
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Overall Score
                                            </p>
                                        </div>

                                        {/* STATUS BADGE */}
                                        <span
                                            className={`px-4 py-1 rounded-full text-xs font-medium ${item.status === "completed"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {item.status}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={(event) => handleDelete(event, item)}
                                            disabled={deletingId === item._id}
                                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                            aria-label={`Delete ${item.role} interview`}
                                        >
                                            <FaTrash size={12} />
                                            {deletingId === item._id ? 'Deleting…' : 'Delete'}
                                        </button>

                                    </div>
                                </div>

                            </div>

                        )})
                        }

                    </div>
                }
            </div>

        </div>
    )
}

export default InterviewHistory
