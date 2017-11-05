const MONTH_NAMES_LONG = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].join('|');

const MONTH_NAMES_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].join('|');

const WEEK_NAMES_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].join('|');

const WEEK_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].join('|');

const regexpList = [
    // OCTOBER. Weds 4
    new RegExp(`(${MONTH_NAMES_LONG})\. (${WEEK_NAMES_SHORT})s? ([0-2]\\d|3[01]|\\d)`, 'i'),
    // 17 June, 3-7pm
    new RegExp(`([0-2]\\d|3[01]|\\d) (${MONTH_NAMES_LONG}), ([01][0-2]|\\d)-([01][0-2]|\\d)([ap]m)`, 'i'),
    // SAT 14 OCT
    new RegExp(`(${WEEK_NAMES_SHORT}),? ([0-2]\\d|3[01]|\\d) (${MONTH_NAMES_SHORT})`, 'i'),
    // 26/07/2017 07:00 AM
    new RegExp(`([0-2]\\d|3[01])\\/[01]\\d\\/\\d{4} [02]\\d:[0-5]\\d [ap]m`, 'i'),
    // July 29; Time: 8:00 am - 6:00
    new RegExp(`(${MONTH_NAMES_LONG}) ([0-2]\\d|3[01]|\\d); Time: ([02]\\d|\\d):[0-5]\\d( [ap]m)? - ([02]\\d|\\d):[0-5]\\d`, 'i'),
    // 2015-03-25
    new RegExp(`\\d{4}-[01]\\d-([0-2]\\d|3[01])`, 'i'),
    // 03/25/2015
    new RegExp(`([01]\\d|\\d)\\/([0-2]\\d|3[01])\\/\\d{4}`, 'i'),
    // Wednesday March 25 2015
    new RegExp(`(${WEEK_NAMES_LONG}) (${MONTH_NAMES_LONG}) ([0-2]\\d|3[01]|\\d) \\d{4}`, 'i'),
    // Thursday 13 July 2017
    new RegExp(`(${WEEK_NAMES_LONG}) ([0-2]\\d|3[01]|\\d) (${MONTH_NAMES_LONG}) \\d{4}`, 'i'),
    // 28 Oct - 29 Oct
    new RegExp(`([0-2]\\d|3[01]|\\d) (${MONTH_NAMES_SHORT}) - ([0-2]\\d|3[01]|\\d) (${MONTH_NAMES_SHORT})( \\d{4})?`, 'i'),
    // 9 April 2016, 30(th)? October|Oct 2017
    new RegExp(`([0-2]\\d|3[01]|\\d)(rd|nd|st|th)? (${MONTH_NAMES_LONG}|${MONTH_NAMES_SHORT}) \\d{4}`, 'i'),
    // Mar 25 2015
    new RegExp(`(${MONTH_NAMES_SHORT}) ([0-2]\\d|3[01]|\\d) \\d{4}`, 'i'),
    // Thu, Sept 5
    new RegExp(`(${WEEK_NAMES_SHORT}),? (${MONTH_NAMES_SHORT}) ([0-2]\\d|3[01]|\\d)`, 'i'),
];

export default regexpList;