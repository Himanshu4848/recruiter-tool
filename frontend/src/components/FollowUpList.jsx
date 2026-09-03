import api from '../utils/api'
import { useState, useEffect } from 'react'

const getFollowUpBody = (recruiterName, companyName) =>
    `Hi ${recruiterName},

Just following up on my previous message regarding the SDE-1 opportunity at ${companyName}.

I'd be grateful if you could take a look at my profile and let me know if my experience aligns with the role. I'd be happy to provide any additional information if required.

Thanks for your time!
Himanshu`

function FollowUpList({ showToast, refresh }) {
    const [followups, setFollowups] = useState([])

    // Reload list whenever refresh or component mounts
    useEffect(() => {
        const all        = JSON.parse(localStorage.getItem('followups') || '[]')
        const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000
        const recent     = all.filter(e => e.sentAt > twoDaysAgo)
        localStorage.setItem('followups', JSON.stringify(recent))
        setFollowups(recent)
    }, [refresh])

    const sendFollowUp = async (entry, index) => {
        try {
            await api.post('/api/email/follow-up', {
                recruiterName:   entry.recruiterName,
                companyName:     entry.companyName,
                recruiterEmail:  entry.recruiterEmail,
                originalSubject: entry.subject,
                body:            getFollowUpBody(entry.recruiterName, entry.companyName)
            })

            // ✅ Remove this entry from localStorage and state after sending
            const updated = followups.filter((_, i) => i !== index)
            localStorage.setItem('followups', JSON.stringify(updated))
            setFollowups(updated)

            showToast(`Follow-up sent to ${entry.recruiterName}! 🎉`, 'success')
        } catch {
            showToast('Failed to send follow-up.', 'error')
        }
    }

    const formatDate = (ts) => new Date(ts).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    })

    return (
        <div>
            <p className="text-sm font-bold text-gray-700 mb-3">
                Follow-up List (last 2 days)
            </p>

            {followups.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-sm shadow-sm">
                    No pending follow-ups
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {followups.map((entry, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm">{entry.recruiterName}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {entry.companyName} · {entry.recruiterEmail}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Sent: {formatDate(entry.sentAt)}
                                </p>
                            </div>
                            <button
                                onClick={() => sendFollowUp(entry, i)}
                                className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                            >
                                Follow Up
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FollowUpList