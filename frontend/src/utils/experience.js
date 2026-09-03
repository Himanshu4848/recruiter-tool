const JOINING_DATE = new Date('2025-01-01')

export function getExperience() {
    const now = new Date()

    let years  = now.getFullYear() - JOINING_DATE.getFullYear()
    let months = now.getMonth()    - JOINING_DATE.getMonth()

    if (months < 0) {
        years  -= 1
        months += 12
    }

    const decimal = (months / 12).toFixed(1).substring(1)
    const display = `${years}${decimal}`

    return { display }
}