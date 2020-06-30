// ==============================================
//
//  Helper Functions
//
// ==============================================

const getCurrentDate = (date = null) => {
    const months = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    };
    let month = null,
        day = null,
        year = null,
        formattedDate = {};
    if (!date) {
        const date = new Date();
        month = (date.getMonth() + 1).toString().padStart(2, '0');
        day = date.getDate().toString().padStart(2, '0');
        year = date.getFullYear();
        formattedDate = {
            shortDate: `${months[month]} ${day}, ${year}`,
            isoDate: new Date()
        };
    } else {
        // Expected 'date' value: YYYY/MM/DD
        month = date.slice(5, 7);
        day = date.slice(8, 10);
        year = date.slice(0, 4);
        formattedDate = {
            shortDate: `${months[month]} ${day}, ${year}`,
            isoDate: `${year}-${month}-${day}`
        };
    }
    return formattedDate;
};

module.exports = {
    getCurrentDate
};