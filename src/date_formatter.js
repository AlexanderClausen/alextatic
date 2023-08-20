const config = require('../config/config.json');

function formatDate(dateString) {
    const date = new Date(dateString);
    
    let options;
    switch (config.dateFormat) {
        case 'long':
            options = { year: 'numeric', month: 'long', day: 'numeric' };
            break;
        case 'short':
        default:
            options = {};
    }
    
    return new Intl.DateTimeFormat(config.locale, options).format(date);
}

module.exports = formatDate;