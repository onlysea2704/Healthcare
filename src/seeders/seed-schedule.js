import db from "../models/index.js";

const main = async () => {
    const now = new Date();
    const schedules = [];

    function formatDateDDMMYYYY(dateObj) {
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
      }

    for (let doctorId = 1; doctorId <= 8; doctorId++) {
        for (let i = 0; i < 5; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() + i);
            const dateStr = formatDateDDMMYYYY(date);

            schedules.push({
                doctorId: doctorId,
                date: dateStr,
                time: '08:00 - 09:00',
                maxBooking: '10',
                sumBooking: '0',
                createdAt: new Date(),
                updatedAt: new Date(),  
                deletedAt: null
            });
        }
    }
    await db.Schedule.bulkCreate(schedules)
}
main().then()