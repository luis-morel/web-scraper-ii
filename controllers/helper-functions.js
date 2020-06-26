// ==============================================
//
//  Helper Functions
//
// ==============================================

const getCurrentDate = () => {
    let date = new Date(),
        month = (date.getMonth() + 1).toString().padStart(2, '0'),
        day = date.getDate().toString().padStart(2, '0'),
        year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

module.exports = {
    getCurrentDate
}