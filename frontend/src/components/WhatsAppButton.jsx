import { getExperience } from '../utils/experience'

const { display: EXP } = getExperience()

const getWhatsAppMessage = (recruiterName, companyName) =>
    `Hi ${recruiterName}, this is Himanshu.

I came across the SDE-1 opening at ${companyName} and wanted to reach out regarding the opportunity.

I'm currently working as a Software Developer at Freecharge with ${EXP} years of experience in Java, Spring Boot, microservices, AWS, and fintech/lending systems.

I believe my experience aligns well with the role. I'd really appreciate it if you could consider my profile or forward my resume to the relevant hiring team.

I've attached my resume for your reference.

Thanks!
Himanshu Yadav`

function WhatsAppButton({ recruiter }) {
    const handleClick = () => {
        const message = getWhatsAppMessage(recruiter.recruiterName, recruiter.companyName)
        const encoded = encodeURIComponent(message)
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        const url = isMobile
            ? `whatsapp://send?phone=91${recruiter.whatsapp}&text=${encoded}`
            : `https://wa.me/91${recruiter.whatsapp}?text=${encoded}`
        window.open(url, '_blank')
    }

    return (
        <button
            onClick={handleClick}
            className="w-full bg-green-500 active:bg-green-600 text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
        >
            💬 Open WhatsApp
        </button>
    )
}

export default WhatsAppButton