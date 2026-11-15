import { useCallback, useEffect, useRef, useState } from 'react'
import { FaDownload, FaVideo } from 'react-icons/fa'

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

function CandidateVideoRecorder({ isInterviewFinished }) {
  const [consentGiven, setConsentGiven] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaStream, setMediaStream] = useState(null)
  const [recordingBlob, setRecordingBlob] = useState(null)
  const [recordingUrl, setRecordingUrl] = useState('')
  const [error, setError] = useState('')

  const videoRef = useRef(null)
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }
  }, [])

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
    <section className="mx-auto my-5 w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-slate-900">
            <FaVideo className="text-emerald-600" />
            <h2 className="text-lg font-semibold">Your interview recording</h2>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Optional. Record yourself and download the video to review later.
          </p>
        </div>
        {isRecording && (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
            Recording
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(250px,0.8fr)]">
        {(mediaStream || recordingUrl) && (
          <div className="overflow-hidden rounded-xl bg-slate-950">
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

        <div className="flex flex-col justify-center">
          {!recordingBlob && !isInterviewFinished && (
            <>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-slate-700">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(event) => setConsentGiven(event.target.checked)}
                  disabled={isRecording || isStarting}
                  className="mt-1 h-4 w-4 accent-emerald-600"
                />
                <span>
                  I agree to record my camera and microphone. The video stays in
                  this browser and is not uploaded to InterviewIQ.AI.
                </span>
              </label>

              <div className="mt-4 flex flex-wrap gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    disabled={!consentGiven || isStarting}
                    className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isStarting ? 'Starting camera…' : 'Start recording'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Stop and save recording
                  </button>
                )}
              </div>
            </>
          )}

          {recordingBlob && (
            <>
              <p className="text-sm font-medium text-emerald-700">
                Recording ready to review ({(recordingBlob.size / 1024 / 1024).toFixed(1)} MB).
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={recordingUrl}
                  download={`interviewiq-candidate-recording.${extension}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <FaDownload />
                  Download video
                </a>
                {!isInterviewFinished && (
                  <button
                    type="button"
                    onClick={handleRecordAgain}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Record again
                  </button>
                )}
              </div>
            </>
          )}

          {isInterviewFinished && !recordingBlob && !isRecording && (
            <p className="text-sm text-slate-600">
              No recording was saved for this interview.
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Recording is kept only in this browser session. Download it before
        leaving or refreshing the page. Camera and microphone access requires
        your permission and a secure connection (HTTPS).
      </p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  )
}

export default CandidateVideoRecorder
