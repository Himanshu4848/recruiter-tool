import { useState, useRef } from 'react'
import api from './utils/api'
import SetupForm from './components/SetupForm'
import Dashboard from './components/Dashboard'
import FollowUpList from './components/FollowUpList'

function App() {
    const [recruiter, setRecruiter]             = useState(null)
    const [refreshFollowUp, setRefreshFollowUp] = useState(false)
    const [uploading, setUploading]             = useState(false)
    const [toast, setToast]                     = useState(null)
    const fileRef = useRef()

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (!file.name.endsWith('.pdf')) {
            showToast('Please upload a PDF file.', 'error')
            return
        }
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        try {
            await api.post('/api/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            showToast('Resume updated! 📄', 'success')
        } catch {
            showToast('Resume upload failed.', 'error')
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    return (
        <div className="min-h-screen min-h-dvh bg-gradient-to-br from-indigo-50 to-purple-50 flex justify-center p-4 py-8">
            <div className="w-full max-w-md">

                {!recruiter ? (
                    <>
                        <SetupForm onContinue={setRecruiter} />

                        {/* Resume upload */}
                        <div className="bg-white rounded-2xl shadow-sm p-4 mt-4 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-700">📄 Resume</p>
                                <p className="text-xs text-gray-400 mt-0.5">Replace stored resume</p>
                            </div>
                            <input
                                type="file"
                                accept=".pdf"
                                ref={fileRef}
                                className="hidden"
                                onChange={handleResumeUpload}
                            />
                            <button
                                onClick={() => fileRef.current.click()}
                                disabled={uploading}
                                className="text-sm font-semibold text-indigo-600 bg-indigo-50 active:bg-indigo-100 px-4 py-2 rounded-xl transition disabled:opacity-50 whitespace-nowrap"
                            >
                                {uploading ? 'Uploading...' : 'Upload PDF'}
                            </button>
                        </div>

                        {/* Follow-up list */}
                        <div className="mt-4">
                            <FollowUpList showToast={showToast} refresh={refreshFollowUp} />
                        </div>
                    </>
                ) : (
                    <Dashboard
                        recruiter={recruiter}
                        onBack={() => setRecruiter(null)}
                        onEmailSent={() => setRefreshFollowUp(prev => !prev)}
                        showToast={showToast}
                    />
                )}

                {/* Toast */}
                {toast && (
                    <div className={`fixed bottom-6 left-4 right-4 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg z-50 text-center
            ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
                    >
                        {toast.message}
                    </div>
                )}

            </div>
        </div>
    )
}

export default App