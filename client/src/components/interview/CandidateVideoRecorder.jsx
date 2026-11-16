import { useCallback, useEffect, useRef, useState } from 'react'
import {
  FaArrowsAlt,
  FaCompress,
  FaDownload,
  FaExpand,
  FaVideo,
} from 'react-icons/fa'

const preferredMimeTypes = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4',
]

function getRecordingError(error) {
  if (error?.name === 'NotAllowedError' || error?.name === 'SecurityError') {
    return 'Camera and microphone access was denied. Allow access in your browser settings and try again.'
  }
  if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
    return 'A camera and microphone could not be found on this device.'
  }
  return 'Could not start recording. Check your camera and microphone, then try again.'
}

function CandidateVideoRecorder({ isInterviewFinished, embedded = false }) {
  const [consentGiven, setConsentGiven] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaStream, setMediaStream] = useState(null)
  const [recordingBlob, setRecordingBlob] = useState(null)
  const [recordingUrl, setRecordingUrl] = useState('')
  const [error, setError] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [position, setPosition] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const videoRef = useRef(null)
  const panelRef = useRef(null)
  const dragRef = useRef(null)
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }
  }, [])

  const handleDragStart = (event) => {
    if (event.target.closest('button') || event.button !== 0) return
    event.preventDefault()

    const panel = panelRef.current
    if (!panel) return
    const bounds = panel.getBoundingClientRect()
    dragRef.current = {
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top,
    }
    setPosition({ x: bounds.left, y: bounds.top })
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleDragMove = (event) => {
    if (!dragRef.current || !panelRef.current) return

    const panel = panelRef.current
    const maxX = Math.max(8, window.innerWidth - panel.offsetWidth - 8)
    const maxY = Math.max(8, window.innerHeight - panel.offsetHeight - 8)
    const x = Math.min(maxX, Math.max(8, event.clientX - dragRef.current.offsetX))
    const y = Math.min(maxY, Math.max(8, event.clientY - dragRef.current.offsetY))
    setPosition({ x, y })
  }

  const handleDragEnd = () => {
    dragRef.current = null
    setIsDragging(false)
  }

  useEffect(() => {
    if (isInterviewFinished) {
      stopRecording()
    }
  }, [isInterviewFinished, stopRecording])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream
    }
  }, [mediaStream])

  useEffect(() => {
    if (!recordingUrl) return undefined
    return () => URL.revokeObjectURL(recordingUrl)
  }, [recordingUrl])

  useEffect(() => () => {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.ondataavailable = null
      recorder.onstop = null
      recorder.stop()
    }
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }, [])

  const handleStartRecording = async () => {
    if (!consentGiven || isStarting || isInterviewFinished) return
    setError('')

    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      setError('Video recording is not supported by this browser. Try a recent version of Chrome, Edge, or Safari.')
      return
    }

    setIsStarting(true)
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24, max: 30 },
        },
      })
      streamRef.current = stream

      const mimeType = preferredMimeTypes.find((type) =>
        MediaRecorder.isTypeSupported?.(type)
      )
      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        videoBitsPerSecond: 1200000,
        audioBitsPerSecond: 64000,
      })

      chunksRef.current = []
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      recorder.onerror = (event) => {
        setError(event.error?.message || 'Recording failed. Please try again.')
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'video/webm',
        })
        chunksRef.current = []
        stream.getTracks().forEach((track) => track.stop())
        if (streamRef.current === stream) {
          streamRef.current = null
        }
        recorderRef.current = null
        setMediaStream(null)
        setIsRecording(false)

        if (blob.size > 0) {
          setRecordingBlob(blob)
          setRecordingUrl(URL.createObjectURL(blob))
        } else {
          setError('No video data was recorded. Please try recording again.')
        }
      }

      recorder.start(1000)
      setMediaStream(stream)
      setIsRecording(true)
      setIsExpanded(false)
    } catch (recordingError) {
      stream?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      recorderRef.current = null
      setError(getRecordingError(recordingError))
    } finally {
      setIsStarting(false)
    }
  }

  const handleRecordAgain = () => {
    setRecordingBlob(null)
    setRecordingUrl('')
    setError('')
  }

  const extension = recordingBlob?.type.includes('mp4') ? 'mp4' : 'webm'

  return (
    <section
      ref={panelRef}
      className={`${embedded
        ? 'relative w-full self-start rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:p-4'
        : `fixed z-50 max-h-[85vh] max-w-[calc(100vw-1rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl transition-[width] sm:p-4 ${
          position ? '' : 'bottom-4 right-4'
        } ${isDragging ? 'cursor-grabbing' : ''} ${
          isExpanded ? '' : 'w-48 sm:w-52'
        }`}`}
      style={{
        ...(!embedded && position
          ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' }
          : {}),
        ...(!embedded && isExpanded ? { width: 'min(92vw, 560px)' } : {}),
      }}
    >
      <div
        onPointerDown={embedded ? undefined : handleDragStart}
        onPointerMove={embedded ? undefined : handleDragMove}
        onPointerUp={embedded ? undefined : handleDragEnd}
        onPointerCancel={embedded ? undefined : handleDragEnd}
        className={`flex select-none items-center justify-between gap-2 ${
          embedded ? '' : `touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`
        }`}
        title={embedded ? undefined : 'Hold and drag to move the video'}
      >
        <div className="flex min-w-0 items-center gap-2 text-slate-900">
          {!embedded && <FaArrowsAlt className="shrink-0 text-slate-400" size={12} />}
          <FaVideo className="shrink-0 text-emerald-600" />
          <h2 className="truncate text-sm font-semibold">
            {embedded || isExpanded ? 'Your interview recording' : 'Your video'}
          </h2>
          {isRecording && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
              REC
            </span>
          )}
        </div>
        {!embedded && <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-label={isExpanded ? 'Shrink recording panel' : 'Expand recording panel'}
            title={isExpanded ? 'Shrink' : 'Expand'}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {isExpanded ? <FaCompress size={13} /> : <FaExpand size={13} />}
          </button>
        </div>}
      </div>

      {(isExpanded || embedded) && (
        <p className="mt-1 text-xs text-slate-600">
          Camera video and microphone audio, including your spoken answers, are
          recorded together. Nothing is uploaded.
        </p>
      )}

      <div className={`mt-3 grid gap-3 ${isExpanded && !embedded ? 'md:grid-cols-[minmax(0,1.2fr)_minmax(190px,0.8fr)]' : ''}`}>
        {(mediaStream || recordingUrl) && (
          <div className="overflow-hidden rounded-lg bg-slate-950">
            <video
              ref={videoRef}
              src={recordingUrl || undefined}
              autoPlay={Boolean(mediaStream)}
              controls={Boolean(recordingUrl)}
              muted={Boolean(mediaStream)}
              playsInline
              className="aspect-video w-full object-contain"
            />
          </div>
        )}
        {embedded && !mediaStream && !recordingUrl && (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-lg bg-slate-950 p-4 text-center text-slate-300">
            <FaVideo size={24} />
            <p className="text-xs">Camera preview appears here when you start recording.</p>
          </div>
        )}

        <div className="flex min-w-0 flex-col justify-center">
          {!recordingBlob && !isInterviewFinished && (isExpanded || embedded) && (
            <>
              <label className="flex cursor-pointer items-start gap-2 text-xs leading-4 text-slate-700">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(event) => setConsentGiven(event.target.checked)}
                  disabled={isRecording || isStarting}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600"
                />
                <span>
                  I agree to record my camera and microphone, including my
                  spoken answers. The recording stays in this browser and is
                  not uploaded to InterviewIQ.AI.
                </span>
              </label>

              <div className="mt-3 flex flex-wrap gap-2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    disabled={!consentGiven || isStarting}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isStarting ? 'Starting camera…' : 'Start recording'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                  >
                    Stop and save
                  </button>
                )}
              </div>
            </>
          )}

          {!embedded && !recordingBlob && !isInterviewFinished && !isExpanded && !isRecording && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
            >
              Set up recording
            </button>
          )}

          {isRecording && !embedded && !isExpanded && (
            <button
              type="button"
              onClick={stopRecording}
              className="w-full rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Stop and save
            </button>
          )}

          {recordingBlob && (
            <>
              <p className="text-xs font-medium text-emerald-700">
                Recording ready to review ({(recordingBlob.size / 1024 / 1024).toFixed(1)} MB).
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={recordingUrl}
                  download={`interviewiq-candidate-recording.${extension}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  <FaDownload />
                  {isExpanded ? 'Download video' : 'Download'}
                </a>
                {!isInterviewFinished && isExpanded && (
                  <button
                    type="button"
                    onClick={handleRecordAgain}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Record again
                  </button>
                )}
              </div>
            </>
          )}

          {isInterviewFinished && !recordingBlob && !isRecording && (
            <p className="text-xs text-slate-600">
              No recording was saved for this interview.
            </p>
          )}
        </div>
      </div>

      {(isExpanded || embedded) && (
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Recording is kept only in this browser session. Download it before
          leaving or refreshing the page. Camera and microphone access requires
          your permission and a secure connection (HTTPS).
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </section>
  )
}

export default CandidateVideoRecorder
