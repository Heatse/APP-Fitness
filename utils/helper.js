function getStartAndEndOfWeek() {
    const today = new Date()

    // Lấy chỉ số ngày trong tuần của ngày hôm nay (0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7)
    const dayOfWeek = today.getDay()

    // Tính ngày đầu tuần (Chủ nhật)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek) // Trừ đi số ngày để đến Chủ nhật

    // Tính ngày cuối tuần (Thứ Bảy)
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek)) // Cộng thêm số ngày để đến Thứ Bảy

    // Định dạng ngày (tuỳ chọn)
    const formatDate = (date) => {
        return date.toISOString().split('T')[0] // Chỉ lấy phần YYYY-MM-DD
    }

    return {
        startOfWeek: formatDate(startOfWeek),
        endOfWeek: formatDate(endOfWeek),
        startDate: startOfWeek,
        endDate: endOfWeek,
    }
}

const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100
    return Math.round(weight / (heightInMeters * heightInMeters))
}

export { getStartAndEndOfWeek, calculateBMI }
