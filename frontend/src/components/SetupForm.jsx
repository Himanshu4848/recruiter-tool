import { useState } from 'react'

// ✅ Defined OUTSIDE so it doesn't get recreated on every render
const Field = ({ label, name, placeholder, type = 'text', value, onChange, error }) => (
    <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
)

function SetupForm({ onContinue }) {
    const [form, setForm] = useState({
        recruiterName: '',
        companyName: '',
        whatsapp: '',
        email: ''
    })
    const [errors, setErrors] = useState({})

    const validate = () => {
        const e = {}
        if (!form.recruiterName.trim()) e.recruiterName = 'Required'
        if (!form.companyName.trim())   e.companyName   = 'Required'
        if (!form.whatsapp.trim())      e.whatsapp      = 'Required'
        if (!form.email.trim())         e.email         = 'Required'
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
        return e
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const handleSubmit = () => {
        const e = validate()
        if (Object.keys(e).length > 0) { setErrors(e); return }
        onContinue(form)
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Recruiter Reach 🚀</h1>
                <p className="text-gray-500 text-sm mt-1">Enter recruiter details to get started</p>
            </div>

            <Field
                label="Recruiter Name"
                name="recruiterName"
                placeholder="e.g. Priya Sharma"
                value={form.recruiterName}
                onChange={handleChange}
                error={errors.recruiterName}
            />
            <Field
                label="Company Name"
                name="companyName"
                placeholder="e.g. PhonePe"
                value={form.companyName}
                onChange={handleChange}
                error={errors.companyName}
            />
            <Field
                label="WhatsApp Number"
                name="whatsapp"
                placeholder="e.g. 9876543210 (without +91)"
                value={form.whatsapp}
                onChange={handleChange}
                error={errors.whatsapp}
            />
            <Field
                label="Recruiter Email"
                name="email"
                placeholder="e.g. priya@phonepe.com"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
            />

            <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition text-sm mt-2"
            >
                Continue →
            </button>
        </div>
    )
}

export default SetupForm