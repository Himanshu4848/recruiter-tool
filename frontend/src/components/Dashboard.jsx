import { useState } from 'react'
import EmailModal from './EmailModal'
import WhatsAppButton from './WhatsAppButton'

function Dashboard({ recruiter, onBack, onEmailSent, showToast }) {
    const [showEmailModal, setShowEmailModal] = useState(false)

    return (
        <div className="w-full max-w-md">

            {/* Back */}
            <button
                onClick={onBack}
                className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1 transition"
            >
                ← Back
            </button>

            {/* Recruiter card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{recruiter.recruiterName}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{recruiter.companyName}</p>
                        <p className="text-sm text-gray-500">{recruiter.email}</p>
                        <p className="text-sm text-gray-500">📱 +91-{recruiter.whatsapp}</p>
                    </div>
                    <span className="text-3xl">👤</span>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setShowEmailModal(true)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
                    >
                        📧 Send Email
                    </button>
                    <WhatsAppButton recruiter={recruiter} />
                </div>
            </div>

            {/* Email modal */}
            {showEmailModal && (
                <EmailModal
                    recruiter={recruiter}
                    onClose={() => setShowEmailModal(false)}
                    onSent={() => {
                        onEmailSent()        // refresh follow-up list on front page
                    }}
                    showToast={showToast}
                />
            )}
        </div>
    )
}

export default Dashboard