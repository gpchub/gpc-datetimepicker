export const isValidDate = (date, format = '') => {
    const newDate = date instanceof Date ? date : parseDate(date, format);
    return !isNaN(newDate);
};

/**
 * Chuyển đổi chuỗi thành đối tượng Date theo định dạng cho trước
 * @param {string} date
 * @param {string} format
 * @returns {Date|null}
 */
export const parseDate = (str, formatStr) => {
    if (str == null) return null;
    if (str instanceof Date) return str;

    // Auto-guess format if not provided
    if (!formatStr) {
        const hasSlash = str.includes('/');
        const hasDash = str.includes('-');

        if (!hasSlash && !hasDash) return null;

        const datePart = hasSlash ? 'YYYY/MM/DD' : 'YYYY-MM-DD';

        // Count colons to guess time format
        const timeCols = (str.match(/:/g) || []).length;
        const timePart =
            timeCols === 2 ? ' HH:mm:ss' :
                timeCols === 1 ? ' HH:mm' :
                    '';

        formatStr = datePart + timePart;
    }

    const tokenRegex = {
        YYYY: '(\\d{1,4})',
        MM: '(\\d{2})',
        DD: '(\\d{2})',
        HH: '(\\d{2})',
        mm: '(\\d{2})',
        ss: '(\\d{2})',
    };

    const tokenOrder = [];
    const pattern = formatStr.replace(/YYYY|MM|DD|HH|mm|ss/g, (token) => {
        tokenOrder.push(token);
        return tokenRegex[token];
    });

    const regex = new RegExp(`^${pattern}$`);
    const match = str.match(regex);
    if (!match) return null;

    // Default date parts
    let year = 1970, month = 0, day = 1, hour = 0, minute = 0, second = 0;

    for (let i = 0; i < tokenOrder.length; i++) {
        const token = tokenOrder[i];
        const val = parseInt(match[i + 1], 10);

        if (isNaN(val)) return null;

        switch (token) {
            case 'YYYY': year = val; break;
            case 'MM': if (val < 1 || val > 12) return null; month = val - 1; break;
            case 'DD': if (val < 1 || val > 31) return null; day = val; break;
            case 'HH': if (val < 0 || val > 23) return null; hour = val; break;
            case 'mm': if (val < 0 || val > 59) return null; minute = val; break;
            case 'ss': if (val < 0 || val > 59) return null; second = val; break;
        }
    }

    // Final day check (e.g., reject Feb 30)
    const maxDay = new Date(year, month + 1, 0).getDate();
    if (day > maxDay) return null;

    return new Date(year, month, day, hour, minute, second);
};

export const parseTime = (timeStr) => {
    const [h, m, s] = timeStr.split(":").map(Number);

    if (
        isNaN(h) || h < 0 || h > 23 ||
        isNaN(m) || m < 0 || m > 59 ||
        (s !== undefined && (isNaN(s) || s < 0 || s > 59))
    ) {
        return null; // invalid time
    }

    const now = new Date();
    now.setHours(h);
    now.setMinutes(m);
    now.setSeconds(s ?? 0);

    return now;
}

/**
 * Kiểm tra chuỗi giờ phút có hợp lệ không
 * @param {string} time
 * @returns {boolean}
 */
export const isValidTime = (timeStr) => {
    if (timeStr === null || timeStr === undefined) return false;
    const timeRegex = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/;
    const match = timeStr.match(timeRegex);
    if (!match) return false;

    const hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const second = match[3] !== undefined ? parseInt(match[3], 10) : 0;

    return (
        hour >= 0 && hour <= 23 &&
        minute >= 0 && minute <= 59 &&
        second >= 0 && second <= 59
    );
}

export const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

export const isDateBetween = (targetDate, startDate, endDate) => {
    const t = new Date(targetDate).getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (isNaN(t) || isNaN(start) || isNaN(end)) return false;

    return t >= start && t <= end;
}

export const isTimeBetween = (time, minTime, maxTime) => {
    const timeMinutes = timeToMinutes(time);
    const minMinutes = timeToMinutes(minTime);
    const maxMinutes = timeToMinutes(maxTime);

    return timeMinutes >= minMinutes && timeMinutes <= maxMinutes;
}

export const timeToMinutes = (time) => {
    return time.getHours() * 60 + time.getMinutes();
}

export const isWeekend = (date) => {
    return date.getDay() === 0 || date.getDay() === 6;
}

export function daysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function roundTimeByStep(time, step = 5, direction = 'up') {
    if (!(time instanceof Date) || isNaN(time.getTime())) return;

    const totalMinutes = time.getHours() * 60 + time.getMinutes();

    let roundedMinutes;
    switch (direction) {
        case 'up':
            roundedMinutes = Math.ceil(totalMinutes / step) * step;
            break;
        case 'down':
            roundedMinutes = Math.floor(totalMinutes / step) * step;
            break;
        case 'nearest':
        default:
            roundedMinutes = Math.round(totalMinutes / step) * step;
            break;
    }

    time.setHours(Math.floor(roundedMinutes / 60), roundedMinutes % 60, 0, 0);
}

/**
 * Format date thành chuỗi theo định dạng cho trước
 * @param {Date} date
 * @param {string} format
 * @returns {string}
 */
export function formatDate(date, format = '') {
    if (!isValidDate(date)) return '';

    const pad = (n, len = 2) => String(n).padStart(len, '0');

    const components = {
        YY: String(date.getFullYear()).slice(-2),
        YYYY: pad(date.getFullYear(), 4),
        M: date.getMonth() + 1,
        MM: pad(date.getMonth() + 1),
        D: date.getDate(),
        DD: pad(date.getDate()),
        H: date.getHours(),
        HH: pad(date.getHours()),
        m: date.getMinutes(),
        mm: pad(date.getMinutes()),
        s: date.getSeconds(),
        ss: pad(date.getSeconds())
    };

    const tokenRegex = /\[([^\]]+)]|YYYY|YY|MM|M|DD|D|HH|H|mm|m|ss|s/g;

    return format.replace(tokenRegex, (match, literal) => {
        if (literal) return literal; // preserve text in square brackets
        return components.hasOwnProperty(match) ? components[match] : match;
    });
}

export default {
    isValidDate,
    isValidTime,
    parseDate,
    parseTime,
    isDateBetween,
    isTimeBetween,
    isSameDay,
    timeToMinutes,
    isWeekend,
    daysInMonth,
    roundTimeByStep,
    formatDate,
};