import dateUtils from './date.js';
import utils from './utils.js';
import dom from './dom.js';

export default class GDatetimepicker
{
    static defaultOptions  = {
        /** @var {String} Format datetime */
		format: 'DD/MM/YYYY HH:mm',
        /** @var {String|null} Ngày ban đầu, format Y/m/d hoặc Y/m/d H:i (nếu có timepicker)  */
		initValue: null,

        /** @var {Number} Năm nhỏ nhất trong lịch */
		yearStart: (new Date()).getFullYear() - 5,
        /** @var {Number} Năm lớn nhất trong lịch */
		yearEnd: (new Date()).getFullYear() + 1,
        /** @var Number Thứ bắt đầu trong tuần (0: CN, 1-6: T2-T7) */
        dayOfWeekStart: 0,

        /** @var {Array} Mảng các ngày cho phép chọn, format Y/m/d */
		allowedDates: [],
        /** @var {Array} Mảng các khoảng ngày cho phép chọn, format Y/m/d */
        allowedDateRanges: [],
        /** @var {Array} Mảng các ngày không được phép chọn, format Y/m/d */
		disabledDates: [],
        /** @var {Array} Mảng các khoảng ngày không được phép chọn, format Y/m/d */
        disabledDateRanges: [],
        /** @var {Array} Mảng các thứ trong tuần không được phép chọn, format Y/m/d */
		disabledWeekDays: [],
        /** @var {String} Ngày nhỏ nhất trong lịch, format Y/m/d */
		minDate: '',
        /** @var {String} Ngày lớn nhất trong lịch, format Y/m/d */
		maxDate: '',

        /** @var Boolean Hiện timepicker */
		timepicker: false,
        /** @var Number Khoảng cách phút trong ô chọn giờ */
		step: 15,
        /** @var {Array} Mảng các giờ cho phép chọn, format H:i */
		allowedTimes: [],
        /** @var {Array} Mảng các khoảng giờ cho phép chọn, format H:i */
        allowedTimeRanges: [],
        /** @var {Array} Mảng các giờ không được phép chọn, format H:i */
        disabledTimes: [],
        /** @var {Array} Mảng các khoảng giờ không được phép chọn, format H:i */
        disabledTimeRanges: [],
        /** @var {String} Giờ nhỏ nhất trong timepicker, format H:i */
		minTime: '08:00',
        /** @var {String} Giờ nhỏ nhất trong timepicker, format H:i */
		maxTime: '18:00',
        /** @var {Boolean} Ẩn các ngày không được phép chọn */
        hideDisabledTimes: false,

        /** @var {Boolean} Đóng khi chọn ngày */
		closeOnDateSelect: false,
        /** @var {Boolean} Đóng khi nhấn nút xoá */
        closeOnClear: false,

        /** @var {function} Callback function trước khi render timer */
        beforeShowTime: null,
        onChange: null,
	};

    i18n = {
        'en': { // English
            months: [
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ],
            dayOfWeekShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            close: 'Close',
            clear: 'Clear',
            today: 'Today',
        },
        vi: { // Vietnamese
            months: [
                "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
            ],
            dayOfWeekShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
            close: 'Đóng',
            clear: 'Xoá',
            today: 'Hôm nay',
        },
    };

    constructor(el, opts = {}) {
        this.$input = el instanceof HTMLElement ? el : document.querySelector(el);
        if (!this.$input) return;

        this.options = { ...GDatetimepicker.defaultOptions, ...this._normalizeOptions(opts) };
        this.valueFormat = this.options.timepicker ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD';
        this.globalLocale = ['en', 'vi'].includes(this.options.locale) ? this.options.locale : 'vi';
        this.isDatetimepickerOpen = false;

        if (!this.options.timepicker) {
            this.options.format = this.options.format.replace(/(HH:?mm(:?ss)?)/g, '').trim();
        }

        /** @var {Date|null} thời gian của view lịch hiện tại */
        this.currentViewDateTime = null;
        /** @var {Date|null} thời gian hiện tại của datetimepicker */
        this.currentValue = null;

        this._initRanges();
        this._initState();
        this._initDOM();
        this._bindEvents();
        dom.triggerEvent(this.$datetimePicker, 'dt.changeView');
    }

    _normalizeOptions(opts) {
        const sanitizeArray = arr => Array.isArray(arr) ? arr : [];

        return {
            ...opts,
            allowedDates: sanitizeArray(opts.allowedDates),
            allowedDateRanges: sanitizeArray(opts.allowedDateRanges),
            disabledDates: sanitizeArray(opts.disabledDates),
            disabledDateRanges: sanitizeArray(opts.disabledDateRanges),
            disabledWeekDays: sanitizeArray(opts.disabledWeekDays),
            allowedTimes: sanitizeArray(opts.allowedTimes),
            allowedTimeRanges: sanitizeArray(opts.allowedTimeRanges),
            disabledTimes: sanitizeArray(opts.disabledTimes),
            disabledTimeRanges: sanitizeArray(opts.disabledTimeRanges),
            minDate: dateUtils.isValidDate(opts.minDate) ? opts.minDate : '',
            maxDate: dateUtils.isValidDate(opts.maxDate) ? opts.maxDate : '',
            minTime: dateUtils.isValidTime(opts.minTime) ? opts.minTime : GDatetimepicker.defaultOptions.minTime,
            maxTime: dateUtils.isValidTime(opts.maxTime) ? opts.maxTime : GDatetimepicker.defaultOptions.maxTime,
            initValue: dateUtils.isValidDate(opts.initValue) ? opts.initValue : '',
            dayOfWeekStart: isNaN(opts.dayOfWeekStart) ? 0 : parseInt(opts.dayOfWeekStart, 10) % 7
        };
    }

    _initRanges() {
        this.allowedDateRanges = this._normalizeDateRanges(this.options.allowedDateRanges);
        this.disabledDateRanges = this._normalizeDateRanges(this.options.disabledDateRanges);
        this.allowedTimeRanges = this._normalizeTimeRanges(this.options.allowedTimeRanges);
        this.disabledTimeRanges = this._normalizeTimeRanges(this.options.disabledTimeRanges);
    }

    _normalizeDateRanges(ranges) {
        return (Array.isArray(ranges) ? ranges : []).filter(r => r.length === 2).map(([start, end]) => ({
            minDate: dateUtils.parseDate(start),
            maxDate: dateUtils.parseDate(end)
        }));
    }

    _normalizeTimeRanges(ranges) {
        return (Array.isArray(ranges) ? ranges : []).filter(r => r.length === 2).map(([start, end]) => ({
            min: dateUtils.parseTime(start),
            max: dateUtils.parseTime(end)
        }));
    }

    _initState() {
        this._initCurrentValue();
        this._initCurrentViewDateTime();
    }

    _initCurrentValue() {
        const init = this.options.initValue ? dateUtils.parseDate(this.options.initValue, this.valueFormat) : null;
        const fromInput = this.$input.value ? dateUtils.parseDate(this.$input.value, this.options.format) : null;
        this.currentValue = init || fromInput;
        if (init) this.$input.value = this._formatInputDate(init);
    }

    _initCurrentViewDateTime() {
        const { currentValue, options } = this;
        const step = options.step;
        const hasTimepicker = options.timepicker;

        // Start with currentValue date or now
        let viewDate = currentValue ? new Date(currentValue) : new Date();

        if (!hasTimepicker) {
            this.currentViewDateTime = new Date(viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate());
            return;
        }

        dateUtils.roundTimeByStep(viewDate, step);

        const minTime = dateUtils.parseTime(options.minTime);
        const maxTime = dateUtils.parseTime(options.maxTime);

        const minMinutes = minTime ? dateUtils.timeToMinutes(minTime) : 0;
        const maxMinutes = maxTime ? dateUtils.timeToMinutes(maxTime) : 24 * 60;
        const viewMinutes = dateUtils.timeToMinutes(viewDate);

        // Clamp time within min and max boundaries
        if (viewMinutes < minMinutes) {
            viewDate.setHours(minTime.getHours(), minTime.getMinutes());
        } else if (viewMinutes > maxMinutes) {
            viewDate.setHours(maxTime.getHours(), maxTime.getMinutes());
        }

        const currentDay = viewDate.getDate();

        // Increment time by step until available or maxMinutes reached, or date changes
        while (
            !this._isTimeAvailable(viewDate) &&
            dateUtils.timeToMinutes(viewDate) < maxMinutes &&
            viewDate.getDate() === currentDay
        ) {
            viewDate.setMinutes(viewDate.getMinutes() + step);
        }

        // If no available time found, reset to midnight of current day
        if (!this._isTimeAvailable(viewDate)) {
            viewDate.setHours(0, 0, 0, 0);
            viewDate.setDate(currentDay);
        }

        this.currentViewDateTime = new Date(viewDate);
    }

    _initDOM() {
        const { options } = this;

        this.$input.setAttribute('readonly', true);

        this.$datetimePicker = dom.createElement('div', 'gdtp-datetimepicker');
        this.$datePicker = dom.createElement('section', 'gdtp-datepicker active');
        this.$monthPicker = this._createMonthPicker();
        this.$monthSelect = this.$monthPicker.querySelector('.gdtp-monthpicker__select.is-month');
        this.$yearSelect = this.$monthPicker.querySelector('.gdtp-monthpicker__select.is-year');
        this.$calendar = dom.createElement('div', 'gdtp-calendar');
        const weekdays = this._createWeekdayHeader(options.dayOfWeekStart);
        this.$calendarDates = dom.createElement('div', 'gdtp-calendar__dates');
        this.$calendar.append(weekdays);
        this.$calendar.append(this.$calendarDates);
        this.$datepickerFooter = this._createFooter();

        this.$datePicker.append(this.$monthPicker);
        this.$datePicker.append(this.$calendar);
        this.$datePicker.append(this.$datepickerFooter);
        this.$datetimePicker.append(this.$datePicker);

        if (options.timepicker) {
            this.$timePicker = this._createTimePicker();
            this.$timebox = this.$timePicker.querySelector('.gdtp-timepicker__times');
            this.$datetimePicker.append(this.$timePicker);
        }

        dom.hide(this.$datetimePicker);
        dom.hide(this.$monthSelect);
        dom.hide(this.$yearSelect);
        document.body.append(this.$datetimePicker);
    }

    _createMonthPicker() {
        return dom.createElement('header', 'gdtp-monthpicker', `
            <button type="button" class="gdtp-monthpicker__prev gdtp-button-icon gdtp-prev"></button>
            <button type="button" class="gdtp-monthpicker__today gdtp-button-icon"></button>
            <div class="gdtp-monthpicker__months">
                <span class="gdtp-monthpicker__label is-month"></span>
                <div class="gdtp-monthpicker__select is-month"></div>
            </div>
            <div class="gdtp-monthpicker__years">
                <span class="gdtp-monthpicker__label is-year"></span>
                <div class="gdtp-monthpicker__select is-year"></div>
            </div>
            <button type="button" class="gdtp-monthpicker__next gdtp-button-icon gdtp-next"></button>
        `);
    }

    _createWeekdayHeader(startDay) {
        const header = Array.from({ length: 7 }, (_, j) => {
            const dayName = this.i18n[this.globalLocale].dayOfWeekShort[(j + startDay) % 7];
            return `<div class="gdtp-calendar__weekday">${dayName}</div>`;
        }).join('');
        return dom.createElement('div', 'gdtp-calendar__weekdays', header);
    }

    _createFooter() {
        return dom.createElement('footer', 'gdtp-datepicker__footer', `
            <button type="button" class="gdtp-button gdtp-button__close">${ this._getText('close') }</button>
            <button type="button" class="gdtp-button gdtp-button__clear">${ this._getText('clear') }</button>
        `);
    }

    _createTimePicker() {
        return dom.createElement('div', 'gdtp-timepicker', `
            <button type="button" class="gdtp-timepicker__prev gdtp-button-icon"></button>
            <div class="gdtp-timepicker__times"></div>
            <button type="button" class="gdtp-timepicker__next gdtp-button-icon"></button>
        `);
    }

    _bindEvents() {
        const options = this.options;

        this._bindInputEvents();
        this._bindDatepickerEvents();
        this._bindMonthEvents();
        this._bindCalendarEvents();
        this._bindFooterEvents();

        if (options.timepicker) {
            this._bindTimeEvents();
        }
    }

    _bindInputEvents() {
        ['click', 'focusin'].forEach((eventName) => {
            this.$input.addEventListener(eventName, (e) => {
                if (this.$input.matches(':disabled')) {
                    return;
                }

                this.open();
            });
        });

        this.$input.addEventListener('keydown', (e) => {
            let key = e.key;
            if (key === "Enter" || key === "Escape" || key === "Tab") {
                this.close();
                this.$input.focus();
                return false;
            }
        });
    }

    _bindDatepickerEvents() {
        /*---------- Click outside ---------- */
        document.addEventListener('click', (e) => {
            if (e.target === this.$input || this.$datetimePicker.contains(e.target)) {
                return false;
            }

            this.close();
        });

        this.$datetimePicker.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this._closeMonthYearPicker();
            return false;
        });

        this.$datetimePicker.addEventListener('dt.changeView', (e) => {
            e.stopPropagation();
            this._buildHtml();
        });

        this.$datetimePicker.addEventListener('dt.change', (e) => {
            e.stopPropagation();

            if (this.options.onChange && typeof this.options.onChange === 'function') {
                this.options.onChange.call(this, this.currentValue);
            }
        });

        this.$datetimePicker.addEventListener('dt.afterOpen', (e) => {
            e.stopPropagation();
            if (!this.options.timepicker) return;

            /** scroll timebox tới time đang được chọn */
            let top = this.$timebox.querySelector('.is-current');
            this.$timebox.scrollTop = top?.offsetTop || 0;
        });
    }

    _bindMonthEvents() {
        /*---------- click label tháng, năm ---------- */
        dom.delegateEvent(this.$datetimePicker, '.gdtp-monthpicker__label', 'click', (e) => {
            e.stopPropagation();

            const $select = e.target.nextElementSibling;
            this._closeMonthYearPicker();
            dom.show($select);
            $select.scrollTop = $select.querySelector('.is-current').offsetTop;
        });

        /*---------- Click option trong list tháng, năm ---------- */
        dom.delegateEvent(this.$datetimePicker, '.gdtp-monthpicker__option', 'click', (e) => {
            const { currentViewDateTime } = this;
            const elem = e.target;
            const selectElem = elem.closest('.gdtp-monthpicker__select');

            dom.hide(selectElem);
            currentViewDateTime[selectElem.classList.contains('is-month') ? 'setMonth' : 'setFullYear'](elem.dataset.value);
            dom.triggerEvent(this.$datetimePicker, 'dt.changeView');
        });

        /*---------- click today button ---------- */
        dom.delegateEvent(this.$datetimePicker, '.gdtp-monthpicker__today', 'click', (e) => {
            let today = new Date();
            this.currentViewDateTime.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
            dom.triggerEvent(this.$datetimePicker, 'dt.changeView');
        });

        /*---------- click nút mũi tên ở lựa chọn tháng ---------- */
        dom.delegateEvent(this.$datetimePicker, '.gdtp-prev, .gdtp-next', 'click', (e) => {
            const elem = e.target;
            if (elem.classList.contains('gdtp-next')) {
                this.goToNextMonth();
            } else if (elem.classList.contains('gdtp-prev')) {
                this.goToPrevMonth();
            }
        });
    }

    _bindCalendarEvents() {
        /*---------- click chọn ngày ---------- */
        dom.delegateEvent(this.$datetimePicker, '.gdtp-calendar__date', 'click', (e) => {
            const elem = e.target.closest('.gdtp-calendar__date');
            if (elem.classList.contains('is-disabled')) return false;

            const { currentViewDateTime, options } = this;

            currentViewDateTime.setFullYear(elem.dataset.year, elem.dataset.month, elem.dataset.date);
            this.currentValue = new Date(currentViewDateTime);
            this.$input.value = this._formatInputDate(this.currentValue);

            this._closeMonthYearPicker();
            dom.triggerEvent(this.$datetimePicker, 'dt.change');
            dom.triggerEvent(this.$datetimePicker, 'dt.changeView');
            dom.triggerEvent(this.$input, 'change');

            // nếu không có timepicker thì luôn đóng khi chọn ngày
            if (options.closeOnDateSelect  || !options.timepicker) {
                this.close();
            }
        });
    }

    _bindFooterEvents() {
        this.$datepickerFooter.querySelector('.gdtp-button__close').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.close();
        });

        this.$datepickerFooter.querySelector('.gdtp-button__clear').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.clear();
        });
    }

    _bindTimeEvents() {
        /*---------- click nút mũi tên ở lựa chọn time ---------- */
        this.$datetimePicker.addEventListener('click', (e) => {
            if (!e.target.matches('.gdtp-timepicker__prev, .gdtp-timepicker__next')) return;

            const elem = e.target;
            const timebox = this.$timebox;

            let currentScrollTop = timebox.scrollTop;
            let timeElem = timebox.querySelector('.gdtp-timepicker__time');
            let timeHeight = timeElem.offsetHeight;
            if (elem.classList.contains('gdtp-timepicker__next')) {
                timebox.scrollTop = currentScrollTop + timeHeight;
            } else if (elem.classList.contains('gdtp-timepicker__prev')) {
                timebox.scrollTop = currentScrollTop - timeHeight;
            }
        });

        /*---------- click chọn giờ ---------- */
		this.$datetimePicker.addEventListener('click', (e) => {
            e.stopPropagation();

            if (!e.target.matches('.gdtp-timepicker__time')) return;

            let elem = e.target;
            if (elem.classList.contains('is-disabled')) {
                return false;
            }

            const { currentViewDateTime } = this;

            currentViewDateTime.setHours(elem.dataset.hour, elem.dataset.minute);
            this.currentValue = new Date(currentViewDateTime);
            this.$input.value = this._formatInputDate(this.currentValue);

            dom.triggerEvent(this.$datetimePicker, 'dt.change');
            dom.triggerEvent(this.$input, 'change');

            this.close();
        });
    }

    _buildHtml() {
        this._buildMonthYearPicker();
        this._buildCalendar();
        if (this.options.timepicker) {
            this._buildTimePicker();
        }
    }

    _buildMonthYearPicker() {
        const { options, currentViewDateTime } = this;
        const month = currentViewDateTime.getMonth();
        const year = currentViewDateTime.getFullYear();

        const monthName = (month) => this.i18n[this.globalLocale].months[month];

        const populateOptions = (container, start, end, currentValue, labelFunc = val => val) => {
            const s = parseInt(start, 10);
            const e = parseInt(end, 10);

            container.innerHTML = Array.from({ length: e - s + 1 }, (_, i) => {
                const value = s + i;
                return `<div class="gdtp-monthpicker__option ${value === currentValue ? 'is-current' : ''}" data-value="${value}">
                            ${labelFunc(value)}
                        </div>`;
            }).join('');
        };

        /** Month & Year label */
        this.$monthPicker.querySelector('.gdtp-monthpicker__label.is-month').innerHTML = monthName(month);
        this.$monthPicker.querySelector('.gdtp-monthpicker__label.is-year').innerHTML = year;

        /** Month & Year select options */
        populateOptions(this.$yearSelect, options.yearStart, options.yearEnd, year);
        populateOptions(this.$monthSelect, 0, 11, month, monthName);
    }

    _buildCalendar() {
        const { options, currentViewDateTime, currentValue } = this;

        const getCalendarStartDate = (year, month, startDay) => {
            let date = new Date(year, month, 1);
            while (date.getDay() !== startDay) {
                date.setDate(date.getDate() - 1);
            }
            return date;
        }

        const year = currentViewDateTime.getFullYear();
        const month = currentViewDateTime.getMonth();
        const startDay = options.dayOfWeekStart;
        let currentDate = getCalendarStartDate(year, month, startDay);
        let daysInMonth = dateUtils.daysInMonth(currentViewDateTime);
        let maxDate = dateUtils.parseDate(options.maxDate);
        let minDate = dateUtils.parseDate(options.minDate);
        let today = new Date();

        let calendar = '';
        let renderedDays = 0;

        while (
            renderedDays < daysInMonth ||
            currentDate.getDay() !== startDay ||
            currentDate.getMonth() === month
        ) {
            calendar += this._renderDateCell(currentDate, {
                month,
                today,
                currentValue,
                minDate,
                maxDate
            });
            currentDate.setDate(currentDate.getDate() + 1);
            renderedDays++;
        }

        this.$calendarDates.innerHTML = calendar;
    }

    _renderDateCell(date, { month, today, currentValue, minDate, maxDate }) {
        const day = date.getDay();
        const d = date.getDate();
        const m = date.getMonth();
        const y = date.getFullYear();

        const classes = ['gdtp-calendar__date'];

        const isDisabled =
            (minDate && date < minDate) ||
            (maxDate && date > maxDate) ||
            !this._isDateAllowed(date) ||
            this._isDateDisabled(date) ||
            this.$input.matches('[disabled]');

        if (isDisabled) classes.push('is-disabled');
        if (m !== month) classes.push('is-other-month');
        if (dateUtils.isSameDay(date, currentValue)) classes.push('is-current');
        if (dateUtils.isSameDay(today, date)) classes.push('is-today');
        if (dateUtils.isWeekend(date)) classes.push('is-weekend');

        return `<div data-date="${d}" data-month="${m}" data-year="${y}" data-day="${day}" class="${classes.join(' ')}"><span>${d}</span></div>`;
    }

    _buildTimePicker() {
        const { options, currentViewDateTime } = this;

        const applyTimePickerOptions = () => {
            if (!options.beforeShowTime || typeof options.beforeShowTime !== 'function') return;
            const extraOpts = options.beforeShowTime.call(this, currentViewDateTime);

            if (!extraOpts || !utils.isPlainObject(extraOpts)) return;

            // Update options from extended configuration
            options.minTime = extraOpts.minTime || options.minTime;
            options.maxTime = extraOpts.maxTime || options.maxTime;
            options.allowedTimes = extraOpts.allowedTimes || options.allowedTimes;
            options.disabledTimes = extraOpts.disabledTimes || options.disabledTimes;

            if (extraOpts.allowedTimeRanges) {
                this.allowedTimeRanges = this._normalizeTimeRanges(extraOpts.allowedTimeRanges);
            }

            if (extraOpts.disabledTimeRanges) {
                this.disabledTimeRanges = this._normalizeTimeRanges(extraOpts.disabledTimeRanges);
            }
        }

        const getMinutesOfDay = (timeStr, fallback) => {
            if (!timeStr) return fallback;
            const t = dateUtils.parseTime(timeStr);
            return t.getHours() * 60 + t.getMinutes();
        };

        const renderTimeCell = (hour, minute, isCurrent) => {
            const h = utils.padZero(hour, 2);
            const m = utils.padZero(minute, 2);
            const strTime = `${h}:${m}`;
            const time = dateUtils.parseTime(strTime);

            const classes = ['gdtp-timepicker__time'];
            if (isCurrent) classes.push('is-current');

            if (!this._isTimeAllowed(time) || this._isTimeDisabled(time)) {
                if (options.hideDisabledTimes) return '';
                classes.push('is-disabled');
            }

            return `<div class="${classes.join(' ')}" data-hour="${hour}" data-minute="${minute}">${strTime}</div>`;
        };

        applyTimePickerOptions();
        const minTimeMinutes = getMinutesOfDay(options.minTime, 0);
        const maxTimeMinutes = getMinutesOfDay(options.maxTime, 1440);

        let hour = currentViewDateTime.getHours();
        let minute = Math.ceil(currentViewDateTime.getMinutes() / options.step) * options.step;
        if (minute === 60) {
            hour += 1;
            minute = 0;
        }

        // --- Generate HTML ---
        let timeHtml = '';
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += options.step) {
                const timeInMinutes = h * 60 + m;
                if (timeInMinutes < minTimeMinutes || timeInMinutes > maxTimeMinutes) continue;

                const isCurrent = (h === hour && m === minute);
                timeHtml += renderTimeCell(h, m, isCurrent);
            }
        }

        this.$timebox.innerHTML = timeHtml;
    }

    _isDateInListOrRange(date, list, ranges, defaultResult) {
        if (!list.length && !ranges.length) return defaultResult;

        const dateStr = dateUtils.formatDate(date, 'YYYY/MM/DD');

        if (list.includes(dateStr)) return true;

        return ranges.some(range => dateUtils.isDateBetween(date, range.minDate, range.maxDate));
    }

    _isDateAllowed(date) {
        return this._isDateInListOrRange(date, this.options.allowedDates || [], this.allowedDateRanges || [], true);
    }

    _isDateDisabled(date) {
        const isInDisabledListOrRange = this._isDateInListOrRange(date, this.options.disabledDates || [], this.disabledDateRanges || [], false);

        const disabledWeekDays = this.options.disabledWeekDays || [];
        const isDisabledWeekDay = disabledWeekDays.includes(date.getDay());

        return isInDisabledListOrRange || isDisabledWeekDay;
    }

    _isTimeInListOrRange(time, list, ranges, defaultResult) {
        if (!list.length && !ranges.length) return defaultResult;

        const timeStr = dateUtils.formatDate(time, 'HH:mm');

        if (list.includes(timeStr)) return true;
        return ranges.some(range => dateUtils.isTimeBetween(time, range.min, range.max));
    }

    _isTimeAllowed(time) {
        return this._isTimeInListOrRange(time, this.options.allowedTimes || [], this.allowedTimeRanges || [], true);
    }

    _isTimeDisabled(time) {
        return this._isTimeInListOrRange(time, this.options.disabledTimes || [], this.disabledTimeRanges || [], false);
    }

    _isTimeAvailable(time) {
        const minTime = this.options.minTime || '00:00';
        const maxTime = this.options.maxTime || '23:59';

        const minMinutes = dateUtils.timeToMinutes(dateUtils.parseTime(minTime));
        const maxMinutes = dateUtils.timeToMinutes(dateUtils.parseTime(maxTime));
        const timeMinutes = dateUtils.timeToMinutes(time);

        const withinBounds = timeMinutes >= minMinutes && timeMinutes <= maxMinutes;

        return withinBounds && this._isTimeAllowed(time) && !this._isTimeDisabled(time);
    }

    _closeMonthYearPicker() {
        dom.hide(this.$monthSelect);
        dom.hide(this.$yearSelect);
    }

    _getText(str) {
        return this.i18n[this.globalLocale][str] || str;
    }

    /*=============================================
    =            Public methods            =
    =============================================*/

    getValue() {
        return this.currentValue;
    }

    getValueString() {
        const format = this.options.timepicker
                ? 'YYYY/MM/DD HH:mm'
                : 'YYYY/MM/DD';

        return this.currentValue ? dateUtils.formatDate(this.currentValue, format) : '';
    }

    open() {
        if (this.isDatetimepickerOpen) return;
        this._toggleDatetimePicker(true);
    }

    close() {
        if (!this.isDatetimepickerOpen) return;
        this._toggleDatetimePicker(false);
    }

    _toggleDatetimePicker(isOpen) {
        const action = isOpen ? dom.show : dom.hide;
        action(this.$datetimePicker);
        this.isDatetimepickerOpen = isOpen;
        window.removeEventListener('resize', this._setPosition);

        if (isOpen) {
            this._setPosition();
            window.addEventListener('resize', this._setPosition);
            dom.triggerEvent(this.$datetimePicker, 'dt.afterOpen');
        } else {
            this._closeMonthYearPicker();
            this.cleanupPopup();
        }
    }

    clear() {
        this.currentValue = null;
        this.$input.value = '';

        dom.triggerEvent(this.$datetimePicker, 'dt.change');
        dom.triggerEvent(this.$datetimePicker, 'dt.changeView');
        dom.triggerEvent(this.$input, 'change');

        if (this.options.closeOnClear) {
            this.close();
        }
    }

    on(eventName, callback) {
        if (typeof callback !== 'function') return;

        switch (eventName) {
            case 'change':
                this.options.onChange = callback;
                break;
        }
    }

    goToMonth(month, year) {
        const { currentViewDateTime } = this;
        const daysInTargetMonth = new Date(year, month + 1, 0).getDate();
        const safeDate = Math.min(currentViewDateTime.getDate(), daysInTargetMonth);

        currentViewDateTime.setFullYear(year, month, safeDate);
        dom.triggerEvent(this.$datetimePicker, 'dt.changeView');
    }

    goToNextMonth() {
        const { month, year } = this._getAdjustedMonth(1);
        this.goToMonth(month, year);
    }

    goToPrevMonth() {
        const { month, year } = this._getAdjustedMonth(-1);
        this.goToMonth(month, year);
    }

    _getAdjustedMonth(offset) {
        const current = this.currentViewDateTime;
        const newDate = new Date(current.getFullYear(), current.getMonth() + offset, 1);
        return {
            year: newDate.getFullYear(),
            month: newDate.getMonth()
        };
    }

    _formatInputDate(date) {
        return dateUtils.formatDate(date, this.options.format);
    }

    _setPosition = () => {
        this.cleanupPopup = dom.setPosition(this.$datetimePicker, this.$input);
    }
}