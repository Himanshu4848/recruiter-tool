
import api from '../utils/api'
import { useState } from 'react'
import axios from 'axios'
import { getExperience } from '../utils/experience'

const { display: EXP } = getExperience()  // e.g. "1.8", "2.0", "2.3"

const SUBJECT = `SDE-1 | ${EXP} YOE | Java, Spring Boot | Freecharge`

const getEmailBody = (recruiterName, companyName) =>
    `Hi ${recruiterName},

I came across the SDE-1 opening at ${companyName} on LinkedIn and wanted to reach out regarding the opportunity.

I'm currently working as a Software Developer at Freecharge with ${EXP} years of experience, primarily building Java/Spring Boot microservices for a merchant lending platform. My work involves developing REST APIs, designing loan lifecycle workflows, implementing EMI deduction systems, and building event-driven services using AWS SQS.

Since I work in the fintech/lending domain, I believe my experience in backend engineering and distributed systems could be a strong fit for this role.

I have also solved 1000+ DSA problems and have hands-on experience with AWS, MySQL, Redis, Docker, React.js, Node.js, and MongoDB.

I've attached my resume for reference. Would you be open to considering my profile or forwarding it to the relevant hiring team?

Thanks for your time!
Best regards,

Himanshu Yadav
+91-8307686512
hyyadav48485@gmail.com`

const getHtmlBody = (recruiterName, companyName) => `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.8;">
<div style="max-width:580px;padding:24px;">

<p>Hi <b>${recruiterName}</b>,</p>

<p>I came across the <b>SDE-1 opening at ${companyName}</b> on LinkedIn and wanted to reach out regarding the opportunity.</p>

<p>I'm currently working as a <b>Software Developer at Freecharge</b> with <b>${EXP} years of experience</b>, primarily building <b>Java/Spring Boot microservices</b> for a merchant lending platform. My work involves developing <b>REST APIs</b>, designing loan lifecycle workflows, implementing <b>EMI deduction systems</b>, and building event-driven services using <b>AWS SQS</b>.</p>

<p>Since I work in the <b>fintech/lending domain</b>, I believe my experience in backend engineering and distributed systems could be a strong fit for this role.</p>

<p>I have also solved <b>1000+ DSA problems</b> and have hands-on experience with <b>AWS, MySQL, Redis, Docker, React.js, Node.js</b> and <b>MongoDB</b>.</p>

<p>I've attached my resume for reference. Would you be open to considering my profile or forwarding it to the relevant hiring team?</p>

<p>Thanks for your time!<br/>Best regards,</p>

<p>
  <b>Himanshu Yadav</b><br/>
  +91-8307686512<br/>
  hyyadav48485@gmail.com
</p>

</div>
</body>
</html>`

// rest of the component stays exactly the same...
function EmailModal({ recruiter, onClose, onSent, showToast }) {
    const [subject, setSubject] = useState(SUBJECT)
    const [body, setBody]       = useState(getEmailBody(recruiter.recruiterName, recruiter.companyName))
    const [sending, setSending] = useState(false)

    const handleSend = async () => {
        setSending(true)
        try {
            const res = await api.post('/api/email/send', {
                recruiterName:  recruiter.recruiterName,
                companyName:    recruiter.companyName,
                recruiterEmail: recruiter.email,
                subject,
                body,
                htmlBody: getHtmlBody(recruiter.recruiterName, recruiter.companyName)
            })

            const entry = {
                recruiterName:  recruiter.recruiterName,
                companyName:    recruiter.companyName,
                recruiterEmail: recruiter.email,
                subject,
                messageId:      res.data.messageId,
                sentAt:         Date.now()
            }
            const existing = JSON.parse(localStorage.getItem('followups') || '[]')
            localStorage.setItem('followups', JSON.stringify([...existing, entry]))

            showToast('Email sent successfully! 🎉', 'success')
            onSent()
            onClose()
        } catch {
            showToast('Failed to send email. Check backend.', 'error')
        } finally {
            setSending(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl p-5 max-h-[92vh] overflow-y-auto shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-gray-900">📧 Email Preview</h2>
                    <button onClick={onClose} className="text-gray-400 text-xl font-bold leading-none">×</button>
                </div>

                <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">To</label>
                    <input
                        value={recruiter.email}
                        disabled
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject</label>
                    <input
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Body (editable)</label>
                    <textarea
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        rows={12}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition resize-y font-mono"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 active:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={sending}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 active:bg-indigo-700 disabled:opacity-60 transition"
                    >
                        {sending ? 'Sending...' : 'Send ✉️'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmailModal