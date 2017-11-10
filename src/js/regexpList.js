import {
    MONTH_NAMES_LONG,
    MONTH_NAMES_SHORT,
    WEEK_NAMES_LONG,
    WEEK_NAMES_SHORT,
} from './constants';

const MONTH_NAMES_LONG_REG = MONTH_NAMES_LONG.join('|');
const MONTH_NAMES_SHORT_REG = MONTH_NAMES_SHORT.join('|');
const WEEK_NAMES_LONG_REG = WEEK_NAMES_LONG.join('|');
const WEEK_NAMES_SHORT_REG = WEEK_NAMES_SHORT.join('|');
const CURRENT_YEAR = new Date().getFullYear();

const regexpList = [
    {
        // OCTOBER. Weds 4
        reg: new RegExp(`(${MONTH_NAMES_LONG_REG})\. (${WEEK_NAMES_SHORT_REG})s? ([0-2]\\d|3[01]|\\d)`, 'i'),
        opt: {
            getDay: matches => `${matches[1]} ${matches[3]} ${CURRENT_YEAR}`,
        },
    },
    {
        // 17 June, 3-7pm
        reg: new RegExp(`([0-2]\\d|3[01]|\\d) (${MONTH_NAMES_LONG_REG}), ([01][0-2]|\\d)-([01][0-2]|\\d)([ap]m)`, 'i'),
        opt: {
            addDay: true,
            getDay: matches => `${matches[1]} ${matches[2]} ${CURRENT_YEAR}`,
        },
    },
    {
        // SAT 14 OCT
        reg: new RegExp(`(${WEEK_NAMES_SHORT_REG}),? ([0-2]\\d|3[01]|\\d) (${MONTH_NAMES_SHORT_REG})`, 'i'),
        opt: {
            getDay: matches => `${matches[2]} ${matches[3]} ${CURRENT_YEAR}`,
        }
    },
    {
        // 26/07/2017 07:00 AM
        reg: new RegExp(`([0-2]\\d|3[01])\\/([01]\\d)\\/(\\d{4}) ([02]\\d|\\d):[0-5]\\d ([ap]m)?`, 'i'),
        opt: {
            addDay: true,
            getDay: matches => `${matches[1]} ${MONTH_NAMES_SHORT[parseInt(matches[2]) - 1]} ${matches[3]}`,
        },
    },
    {
        // July 29; Time: 8:00 am - 6:00
        reg: new RegExp(`(${MONTH_NAMES_LONG_REG}) ([0-2]\\d|3[01]|\\d); Time: ([02]\\d|\\d):[0-5]\\d( [ap]m)? - ([02]\\d|\\d):[0-5]\\d`, 'i'),
        opt: {
            addDay: true,
            getDay: matches => `${matches[2]} ${matches[1]} ${CURRENT_YEAR}`,
        },
    },
    {
        // 2015-03-25
        reg: new RegExp(`\\d{4}[\\/,\\.-][01]\\d[\\/,\\.-]([0-2]\\d|3[01])`, 'i'),
        opt: {
            addDay: true,
        },
    },
    {
        // 11/10/2015
        reg: new RegExp(`([01]\\d|\\d)[\\/,\\.-]([0-2]\\d|3[01])[\\/,\\.-]\\d{4}`, 'i'),
        opt: {
            addDay: true,
        },
    },
    {
        // Wednesday March 25 2015
        reg: new RegExp(`(${WEEK_NAMES_LONG_REG}) (${MONTH_NAMES_LONG_REG}) ([0-2]\\d|3[01]|\\d) \\d{4}`, 'i'),
    },
    {
        // Thursday 13 July 2017
        reg: new RegExp(`(${WEEK_NAMES_LONG_REG}) ([0-2]\\d|3[01]|\\d) (${MONTH_NAMES_LONG_REG}) \\d{4}`, 'i'),
    },
    {
        // Mar 25 2015
        reg: new RegExp(`(${MONTH_NAMES_SHORT_REG}) ([0-2]\\d|3[01]|\\d) \\d{4}`, 'i'),
        opt: {
            addDay: true,
        },
    },
    {
        // Thu, Sep 5
        reg: new RegExp(`(${WEEK_NAMES_SHORT_REG}),? (${MONTH_NAMES_SHORT_REG}) ([0-2]\\d|3[01]|\\d)`, 'i'),
        opt: {
            getDay: matches => `${matches[2]} ${matches[3]} ${CURRENT_YEAR}`,
        }
    },
    {
        // 9 April 2016, 30(th)? October|Oct (2017)?
        reg: new RegExp(`([0-2]\\d|3[01]|\\d)(rd|nd|st|th)? (${MONTH_NAMES_LONG_REG}|${MONTH_NAMES_SHORT_REG})( \\d{4})?`, 'i'),
        opt: {
            addDay: true,
            getDay: matches => `${matches[3]} ${matches[1]} ${matches[4] || CURRENT_YEAR}`
        },
    },
];

export default regexpList;