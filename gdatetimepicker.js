var GKeycode = {
    KEY0: 48,
    KEY9: 57,
    _KEY0: 96,
    _KEY9: 105,
    CTRLKEY: 17,
    CMDKEY: 91,
    DEL: 46,
    ENTER: 13,
    ESC: 27,
    BACKSPACE: 8,
    ARROWLEFT: 37,
    ARROWUP: 38,
    ARROWRIGHT: 39,
    ARROWDOWN: 40,
    TAB: 9,
    F5: 116,
    AKEY: 65,
    CKEY: 67,
    VKEY: 86,
    ZKEY: 90,
    YKEY: 89,
};

class GDatetimepicker
{
    defaultOptions  = {
        /** @var {String} Format datetime */
		format: 'DD/MM/YYYY HH:mm',
        /** @var {String|null} Ngày ban đầu, format Y/m/d hoặc Y/m/d H:i (nếu có timepicker)  */
		initValue: null,

        /** @var {Number} Năm nhỏ nhất trong lịch */
		yearStart: (new Date()).getFullYear() - 5,
        /** @var {Number} Năm lớn nhất trong lịch */
		yearEnd: (new Date()).getFullYear() + 5,
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
        /** @var {String} Ngày nhỏ nhất trong lịch, format Y/m/d H:i */
		minDate: '',
        /** @var {String} Ngày lớn nhất trong lịch, format Y/m/d H:i */
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

        /** @var String Selector chứa datetime picker */
        parentSelector: 'body',
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
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayOfWeekShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            meridiem: ['AM', 'PM'],
            close: 'Close',
            clear: 'Clear',
            today: 'Today',
            thisMonth: 'This month',
            nextMonth: 'Next month',
            prevMonth: 'Previous month',
        },
        vi: { // Vietnamese
            months: [
                "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
            ],
            monthsShort: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
            dayOfWeekShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
            dayOfWeek: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
            meridiem: ['AM', 'PM'],
            close: 'Đóng',
            clear: 'Xoá',
            today: 'Hôm nay',
            thisMonth: 'Tháng này',
            nextMonth: 'Tháng sau',
            prevMonth: 'Tháng trước',
        },
    };

    globalLocale = 'vi';

    timeFormat = 'HH:mm';
    dateFormat = 'YYYY/MM/DD';
    datetimeFormat = 'YYYY/MM/DD HH:mm';

    /** @var {String} Định dạng cho datetimepicker value, là dạng date hay datetime tuỳ theo timepicker có hay không */
    valueFormat = '';

    options = {};
    allowedDateRanges = [];
    disabledDateRanges = [];
    allowedTimeRanges = [];
    disabledTimeRanges = [];

    /** @var {Date|null} thời gian của view lịch hiện tại */
    currentViewDateTime = null;
    /** @var {Date|null} thời gian hiện tại của datetimepicker */
    currentValue = null;
    /** @var {Boolean} */
    isDatetimepickerOpen = false;

    constructor(el, opts) {
        this.$input = el instanceof HTMLElement ? el : document.querySelector(el);
        if (!this.$input) return;

        this.options = { ...this.defaultOptions, ...this.normalizeOptions(opts) };

        this.valueFormat = this.options.timepicker ? this.datetimeFormat : this.dateFormat;

        if (! this.options.timepicker) {
            this.options.format = this.options.format.replace(/(HH:mm|HHmm|HH mm|HH:mm:ss|HHmmss|HH mm ss)/g, '').trim();
        }

        if (this.options.locale && this.i18n[this.options.locale]) {
            this.globalLocale = this.options.locale;
        }

        this.allowedDateRanges = this.normalizeDateRanges(this.options.allowedDateRanges);
        this.disabledDateRanges = this.normalizeDateRanges(this.options.disabledDateRanges);
        this.allowedTimeRanges = this.normalizeTimeRanges(this.options.allowedTimeRanges);
        this.disabledTimeRanges = this.normalizeTimeRanges(this.options.disabledTimeRanges);

        this.$datetimePicker = this.createElement('div', 'gdtp-datetimepicker');
        this.$datePicker = this.createElement('section', 'gdtp-datepicker active');
        this.$monthPicker = this.createElement('header', 'gdtp-monthpicker', `
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
        this.$monthSelect = this.$monthPicker.querySelector('.gdtp-monthpicker__select.is-month');
        this.$yearSelect = this.$monthPicker.querySelector('.gdtp-monthpicker__select.is-year');
        this.$calendar = this.createElement('div', 'gdtp-calendar');
        this.$datepickerFooter = this.createElement('footer', 'gdtp-datepicker__footer', `
            <button type="button" class="gdtp-button gdtp-button__close">${ this.getText('close') }</button>
            <button type="button" class="gdtp-button gdtp-button__clear">${ this.getText('clear') }</button>
        `);
        this.$timePicker = this.createElement('div', 'gdtp-timepicker', `
            <button type="button" class="gdtp-timepicker__prev gdtp-button-icon"></button>
            <div class="gdtp-timepicker__times"></div>
            <button type="button" class="gdtp-timepicker__next gdtp-button-icon"></button>
        `);
        this.$timebox = this.$timePicker.querySelector('.gdtp-timepicker__times');

        this.init();
    }

    normalizeOptions(opts) {
        if (!this.isPlainObject(opts)) return {};

        opts.allowedDates = this.normalizeArray(opts.allowedDates);
        opts.allowedDateRanges = this.normalizeArray(opts.allowedDateRanges);
        opts.disabledDates = this.normalizeArray(opts.disabledDates);
        opts.disabledDateRanges = this.normalizeArray(opts.disabledDateRanges);
        opts.disabledWeekDays = this.normalizeArray(opts.disabledWeekDays);
        opts.minDate = opts.minDate && this.isValidDate(opts.minDate) ? opts.minDate : '';
        opts.maxDate = opts.maxDate && this.isValidDate(opts.maxDate) ? opts.maxDate : '';

        opts.allowedTimes = this.normalizeArray(opts.allowedTimes);
        opts.allowedTimeRanges = this.normalizeArray(opts.allowedTimeRanges);
        opts.disabledTimes = this.normalizeArray(opts.disabledTimes);
        opts.disabledTimeRanges = this.normalizeArray(opts.disabledTimeRanges);
        opts.minTime = opts.minTime && this.isValidTime(opts.minTime) ? opts.minTime : this.defaultOptions.minTime;
        opts.maxTime = opts.maxTime && this.isValidTime(opts.maxTime) ? opts.maxTime : this.defaultOptions.maxTime;

        opts.initValue = opts.initValue && this.isValidDate(opts.initValue) ? opts.initValue : '';

        if (isNaN(opts.dayOfWeekStart)) {
            opts.dayOfWeekStart = 0;
        } else {
            opts.dayOfWeekStart = parseInt(opts.dayOfWeekStart, 10) % 7;
        }

        return opts;
    }

    normalizeDateRanges(dateRanges) {
        if (! Array.isArray(dateRanges) || ! dateRanges.length) return [];

        return dateRanges.map((r) => {
            if (r.length !== 2) return;

            return {
                minDate: this.parseDate(r[0]),
                maxDate: this.parseDate(r[1]),
            };
        }).filter((x) => x);
    }

    normalizeTimeRanges(timeRanges) {
        if (! Array.isArray(timeRanges) || ! timeRanges.length) return [];

        return timeRanges.map((r) => {
            if (r.length !== 2) return;

            return  {
                min: this.parseTime(r[0]),
                max: this.parseTime(r[1]),
            }
        }).filter((x) => x);
    }

    init() {
        this.initCurrentValue();
        this.initCurrentViewDateTime();
        this.createDateTimePicker();
    }

    initCurrentValue() {
        const initDate = this.options.initValue ? this.parseDate(this.options.initValue) : null;
        const inputDate = this.$input.value ? this.parseInputDate(this.$input.value) : null;

        this.currentValue = initDate || inputDate;
        if (initDate) {
            this.$input.value = this.formatInputDate(initDate);
        }
    }

    initCurrentViewDateTime() {
        let viewDate = this.currentValue ? new Date(this.currentValue) : new Date();

        if (! this.options.timepicker) {
            this.currentViewDateTime = new Date(viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate());
            return;
        };

        this.roundTimeByStep(viewDate, this.options.step);
        let minTime = this.parseTime(this.options.minTime);
        let maxTime = this.parseTime(this.options.maxTime);
        let minMinutes = minTime ? this.timeToMinutes(minTime) : 0;
        let maxMinutes = maxTime ? this.timeToMinutes(maxTime) : 24 * 60;
        let viewMinutes = this.timeToMinutes(viewDate);

        if (viewMinutes < minMinutes) {
            viewDate.setHours(minTime.getHours(), minTime.getMinutes());
        }

        if (viewMinutes > maxMinutes) {
            viewDate.setHours(maxTime.getHours(), maxTime.getMinutes());
        }

        let currentDate = viewDate.getDate();
        while (
            ! this.isTimeAvailable(viewDate)
            && this.timeToMinutes(viewDate) < maxMinutes
            && viewDate.getDate() === currentDate
        ) {
            viewDate.setMinutes(viewDate.getMinutes() + this.options.step);
        }

        if (! this.isTimeAvailable(viewDate)) {
            viewDate.setHours(0, 0);
            viewDate.setDate(currentDate);
        }

        this.currentViewDateTime = new Date(viewDate);
    }

    getValue() {
        return this.currentValue;
    }

    getValueString() {
        return this.currentValue ? this.formatDate(this.currentValue) : '';
    }

    createDateTimePicker() {
        const options = this.options;

        this.$input.setAttribute('readonly', true);

        this.$datePicker.append(this.$monthPicker);
        this.$datePicker.append(this.$calendar);
        this.$datePicker.append(this.$datepickerFooter);

        this.$datetimePicker.append(this.$datePicker);
        if (options.timepicker) {
            this.$datetimePicker.append(this.$timePicker);
        }

        document.body.append(this.$datetimePicker);

        this.bindInputEvents();
        this.bindDatepickerEvents();
        this.bindMonthEvents();
        this.bindCalendarEvents();
        this.bindFooterEvents();

        if (options.timepicker) {
            this.bindTimeEvents();
        }

        this.triggerEvent(this.$datetimePicker, 'dt.changeView');
    }

    open() {
        if (this.isDatetimepickerOpen) {
            return;
        }

        this.showEl(this.$datetimePicker, 'flex');
        this.setPosition();
        window.removeEventListener('resize', this.setPosition);
        window.addEventListener('resize', this.setPosition);

        this.triggerEvent(this.$datetimePicker, 'dt.afterOpen');
        this.isDatetimepickerOpen = true;
    }

    close() {
        this.closeMonthYearPicker();
        this.hideEl(this.$datetimePicker);
        this.isDatetimepickerOpen = false;
    }

    clear() {
        this.currentValue = null;
        this.$input.value = '';

        this.triggerEvent(this.$datetimePicker, 'dt.change');
        this.triggerEvent(this.$datetimePicker, 'dt.changeView');
        this.triggerEvent(this.$input, 'change');

        if (this.options.closeOnClear) {
            this.close();
        }
    }

    closeMonthYearPicker() {
        this.hideEl(this.$monthSelect);
        this.hideEl(this.$yearSelect);
    }

    on(eventName, callback) {
        if (typeof callback !== 'function') return;

        switch (eventName) {
            case 'change':
                this.options.onChange = callback;
                break;
        }
    }

    bindInputEvents() {
        ['click', 'focusin'].forEach((eventName) => {
            this.$input.addEventListener(eventName, (e) => {
                if (this.$input.matches(':disabled')) {
                    return;
                }

                this.open();
            });
        });

        this.$input.addEventListener('keydown', (e) => {
            let key = e.which;
            if (key === GKeycode.ENTER || key === GKeycode.ESC || key === GKeycode.TAB) {
                this.close();
                this.$input.focus();
                return false;
            }
        });
    }

    bindDatepickerEvents() {
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
            this.closeMonthYearPicker();
            return false;
        });

        this.$datetimePicker.addEventListener('dt.changeView', (e) => {
            e.stopPropagation();
            this.buildHtml();
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

    bindMonthEvents() {
        /*---------- click label tháng, năm ---------- */
        this.$monthPicker.querySelectorAll('.gdtp-monthpicker__label').forEach((elem) => {
            elem.addEventListener('click', (e) => {
                e.stopPropagation();

                const $select = elem.nextElementSibling;
                this.closeMonthYearPicker();
                this.showEl($select);
                $select.scrollTop = $select.querySelector('.is-current').offsetTop;
            });
        });

        /*---------- Click option trong list tháng, năm ---------- */
        this.$monthPicker.addEventListener('click', (e) => {
            if (!e.target.matches('.gdtp-monthpicker__option')) return;

            const { currentViewDateTime } = this;
            const elem = e.target;
            const selectElem = elem.closest('.gdtp-monthpicker__select');

            this.hideEl(selectElem);
            currentViewDateTime[selectElem.classList.contains('is-month') ? 'setMonth' : 'setFullYear'](elem.dataset.value);
            this.triggerEvent(this.$datetimePicker, 'dt.changeView');
        });

        /*---------- click today button ---------- */
		this.$monthPicker.addEventListener('click', (e) => {
            if (!e.target.matches('.gdtp-monthpicker__today')) return;

            let today = new Date();
            this.currentViewDateTime.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
            this.triggerEvent(this.$datetimePicker, 'dt.changeView');
        });

        /*---------- click nút mũi tên ở lựa chọn tháng ---------- */
        this.$monthPicker.addEventListener('click', (e) => {
            if (!e.target.matches('.gdtp-prev, .gdtp-next')) return;

            const elem = e.target;

            if (elem.classList.contains('gdtp-next')) {
                this.goToNextMonth();
            } else if (elem.classList.contains('gdtp-prev')) {
                this.goToPrevMonth();
            }
        });
    }

    bindFooterEvents() {
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

    bindCalendarEvents() {
        /*---------- click chọn ngày ---------- */
        this.$calendar.addEventListener('click', (e) => {
            e.stopPropagation();

            const elem = e.target.closest('.gdtp-calendar__date');

            if (!elem || !elem.matches('.gdtp-calendar__date')) return false;

            if (elem.classList.contains('is-disabled')) return false;

            const { currentViewDateTime, options } = this;

            currentViewDateTime.setFullYear(elem.dataset.year, elem.dataset.month, elem.dataset.date);
            this.currentValue = new Date(currentViewDateTime);
            this.$input.value = this.formatInputDate(this.currentValue);

            this.closeMonthYearPicker();
            this.triggerEvent(this.$datetimePicker, 'dt.change');
            this.triggerEvent(this.$datetimePicker, 'dt.changeView');
            this.triggerEvent(this.$input, 'change');

            // nếu không có timepicker thì luôn đóng khi chọn ngày
            if (options.closeOnDateSelect === true  || !options.timepicker) {
                this.close();
            }
        });
    }

    bindTimeEvents() {
        /*---------- click nút mũi tên ở lựa chọn time ---------- */
        this.$timePicker.addEventListener('click', (e) => {
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
		this.$timePicker.addEventListener('click', (e) => {
            e.stopPropagation();

            if (!e.target.matches('.gdtp-timepicker__time')) return;

            let elem = e.target;
            if (elem.classList.contains('gdtp-disabled')) {
                return false;
            }

            const { currentViewDateTime } = this;

            currentViewDateTime.setHours(elem.dataset.hour, elem.dataset.minute);
            this.currentValue = new Date(currentViewDateTime);
            this.$input.value = this.formatInputDate(this.currentValue);

            this.triggerEvent(this.$datetimePicker, 'dt.change');
            this.triggerEvent(this.$input, 'change');

            this.close();
        });
    }

    buildHtml() {
        this.buildMonthYearPicker();
        this.buildCalendar();
        if (this.options.timepicker) {
            this.buildTimePicker();
        }
    }

    buildMonthYearPicker() {
        const { options, currentViewDateTime } = this;
        const month = currentViewDateTime.getMonth();
        const year = currentViewDateTime.getFullYear();

        /** Month & Year label */
        this.$monthPicker.querySelector('.gdtp-monthpicker__label.is-month').innerHTML = this.getMonthName(month);
        this.$monthPicker.querySelector('.gdtp-monthpicker__label.is-year').innerHTML = year;

        /** Month & Year select options */
        let opt = '';

        for (let i = parseInt(options.yearStart, 10); i <= parseInt(options.yearEnd, 10); i += 1) {
            opt += `<div class="gdtp-monthpicker__option ${year === i ? 'is-current' : ''}" data-value="${i}">${i}</div>`;
        }
        this.$yearSelect.innerHTML = opt;

        opt = '';
        for (let i = 0; i <= 11; i += 1) {
            opt += `<div class="gdtp-monthpicker__option ${month === i ? 'is-current' : ''}" data-value="${i}">${this.getMonthName(i)}</div>`;
        }
        this.$monthSelect.innerHTML = opt;
    }

    buildCalendar() {
        const { options, currentViewDateTime, currentValue } = this;

        let header = '<div class="gdtp-calendar__weekdays">';
        for (let j = 0; j < 7; j += 1) {
            header += `<div class="gdtp-calendar__weekday">${this.getDayShortName((j + options.dayOfWeekStart) % 7)}</div>`;
        }
        header += '</div>';

        const year = currentViewDateTime.getFullYear();
        const month = currentViewDateTime.getMonth();
        // ngày đầu tiên trong tháng current view
        let currentDate = new Date(year, month, 1);

        // loop back về ngày bắt đầu trong tuần đó, có thể là những ngày cuối của tháng trước
        while (currentDate.getDay() !== options.dayOfWeekStart) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        let daysInMonth = this.countDaysInMonth(currentViewDateTime);
        let maxDate = this.parseDate(options.maxDate);
        let minDate = this.parseDate(options.minDate);
        let today = new Date();

        let calendar = '<div class="gdtp-calendar__dates">';

        let i = 0;
        while (
            i < daysInMonth // in ngày của tháng trước nếu có
            || currentDate.getDay() !== options.dayOfWeekStart // in thêm ngày của tháng sau khi row trong tuần còn chỗ
            || currentDate.getMonth() === month // in ngày của tháng hiện tại
        ) {
            i += 1;

            let classes = ['gdtp-calendar__date'];
            let day = currentDate.getDay();
            let d = currentDate.getDate();
            let y = currentDate.getFullYear();
            let m = currentDate.getMonth();

            if ((maxDate && currentDate > maxDate) || (minDate && currentDate < minDate)) {
                classes.push('is-disabled');
            }

            if (! this.isDateAllowed(currentDate)) {
                classes.push('is-disabled');
            }

            if (this.isDateDisabled(currentDate)) {
                classes.push('is-disabled');
            }

            if (this.$input.matches('[disabled]')) {
                classes.push('is-disabled');
            }

            if (currentViewDateTime.getMonth() !== m) {
                classes.push('is-other-month');
            }

            if (this.isSameDate(currentDate, currentValue)) {
                classes.push('is-current');
            }

            if (this.isSameDate(today, currentDate)) {
                classes.push('is-today');
            }

            if (this.isWeekend(currentDate)) {
                classes.push('is-weekend');
            }

            calendar += `<div data-date="${d}" data-month="${m}" data-year="${y}" data-day="${day}" class="${this.arrayUnique(classes).join(' ')}"><span>${d}</span></div>`;

            currentDate.setDate(d + 1);
        }

        calendar += '</div>';
        this.$calendar.innerHTML = header + calendar;
    }

    isDateAllowed(date) {
        const { allowedDates } = this.options;
        const { allowedDateRanges } = this;

        if (allowedDates.length === 0 && allowedDateRanges.length === 0) {
            return true;
        }

        if (allowedDates.length && allowedDates.includes(this.formatDateOnly(date))) {
            return true;
        }

        return allowedDateRanges.some((x) => this.isDateBetween(date, x.minDate, x.maxDate));
    }

    isDateDisabled(date) {
        const { disabledDates, disabledWeekDays } = this.options;
        const { disabledDateRanges } = this;

        if (!disabledDates.length && !disabledWeekDays.length && !disabledDateRanges.length) {
            return false;
        }

        if (disabledDates.length && disabledDates.includes(this.formatDateOnly(date))) {
            return true;
        }

        if (disabledWeekDays.length && disabledWeekDays.includes(date.getDay())) {
            return true;
        }

        return disabledDateRanges.some((x) => this.isDateBetween(date, x.minDate, x.maxDate));
    }

    buildTimePicker() {
        const { options, currentViewDateTime } = this;

        let extraOpts = null;
        if (options.beforeShowTime && typeof options.beforeShowTime === 'function') {
            extraOpts = options.beforeShowTime.call(this, currentViewDateTime);
        }

        if (extraOpts && this.isPlainObject(extraOpts)) {
            options.minTime = extraOpts.minTime || options.minTime;
            options.maxTime = extraOpts.maxTime || options.maxTime;
            options.allowedTimes = extraOpts.allowedTimes || options.allowedTimes;
            options.disabledTimes = extraOpts.disabledTimes || options.disabledTimes;

            if (extraOpts.allowedTimeRanges) {
                this.allowedTimeRanges = this.normalizeTimeRanges(extraOpts.allowedTimeRanges);
            }

            if (extraOpts.disabledTimeRanges) {
                this.disabledTimeRanges = this.normalizeTimeRanges(extraOpts.disabledTimeRanges);
            }
        }

        let minTimeMinutesOfDay = 0;
        if (options.minTime) {
            let t = this.parseTime(options.minTime);
            minTimeMinutesOfDay = 60 * t.getHours() + t.getMinutes();
        }

        let maxTimeMinutesOfDay = 24 * 60;
        if (options.maxTime) {
            let t = this.parseTime(options.maxTime);
            maxTimeMinutesOfDay = 60 * t.getHours() + t.getMinutes();
        }

        let roundCurrentViewMinutesByStep = Math.ceil(currentViewDateTime.getMinutes() / options.step) * options.step;
        let currentViewHours = currentViewDateTime.getHours();
        if (roundCurrentViewMinutesByStep === 60) {
            currentViewHours += 1;
            roundCurrentViewMinutesByStep = 0;
        }

        let timeHtml = '';
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 60; j += options.step) {
                let currentStepMinutesOfDay = i * 60 + j;
                let classes = ['gdtp-timepicker__time'];

                if (currentStepMinutesOfDay > maxTimeMinutesOfDay || currentStepMinutesOfDay < minTimeMinutesOfDay) {
                    continue;
                }

                let h = this.padZero(i, 2);
                let m = this.padZero(j, 2);
                let strTime = `${h}:${m}`;
                let time = this.parseTime(strTime);

                if (!this.isTimeAllowed(time) || this.isTimeDisabled(time)) {
                    if (this.options.hideDisabledTimes) {
                        continue;
                    }
                    classes.push('is-disabled');
                }

                if (currentViewHours === i && roundCurrentViewMinutesByStep === j) {
                    classes.push('is-current');
                }

                timeHtml += `<div class="${this.arrayUnique(classes).join(' ')}" data-hour="${i}" data-minute="${j}">${h}:${m}</div>`;
            }
        }

        this.$timebox.innerHTML = timeHtml;
    }

    isTimeAllowed(time) {
        const { allowedTimes } = this.options;
        const { allowedTimeRanges } = this;

        if (!allowedTimes.length && !allowedTimeRanges.length) {
            return true;
        }

        if (allowedTimes.length && allowedTimes.includes(this.formatTimeOnly(time))) {
            return true;
        }

        return allowedTimeRanges.some((x) => this.isTimeBetween(time, x.min, x.max));
    }

    isTimeDisabled(time) {
        const { disabledTimes } = this.options;
        const { disabledTimeRanges } = this;

        if (!disabledTimes.length && !disabledTimeRanges.length) {
            return false;
        }

        if (disabledTimes.length && disabledTimes.includes(this.formatTimeOnly(time))) {
            return true;
        }

        return disabledTimeRanges.some((x) => this.isTimeBetween(time, x.min, x.max));
    }

    isTimeAvailable(time) {
        let minTime = this.parseTime(this.options.minTime);
        let maxTime = this.parseTime(this.options.maxTime);
        let minMinutes = this.timeToMinutes(minTime);
        let maxMinutes = this.timeToMinutes(maxTime);
        let timeMinutes = this.timeToMinutes(time);

        return (minMinutes && timeMinutes >= minMinutes)
            && (maxMinutes && timeMinutes <= maxMinutes)
            && this.isTimeAllowed(time)
            && !this.isTimeDisabled(time);
    }

    goToMonth(month, year) {
        const  { currentViewDateTime } = this;
        const newMonth = new Date(year, month + 1, 0); // ngày cuối của tháng thứ m
        const newDate = Math.min(currentViewDateTime.getDate(), newMonth.getDate());
        currentViewDateTime.setFullYear(year, month, newDate);
        this.triggerEvent(this.$datetimePicker, 'dt.changeView');
    }

    goToNextMonth() {
        let m = this.currentViewDateTime.getMonth();
        let y = this.currentViewDateTime.getFullYear();

        y = m === 11 ? y + 1 : y;
        m = m === 11 ? 0 : m + 1;
        this.goToMonth(m, y);
    }

    goToPrevMonth() {
        let m = this.currentViewDateTime.getMonth();
        let y = this.currentViewDateTime.getFullYear();

        y = m === 0 ? y - 1 : y;
        m = m === 0 ? 11 : m - 1;
        this.goToMonth(m, y);
    }

    getText(str) {
        return this.i18n[this.globalLocale][str] || str;
    }

    getMonthName(month) {
        return this.i18n[this.globalLocale].months[month];
    }

    getDayShortName(day) {
        return this.i18n[this.globalLocale].dayOfWeekShort[day];
    }

    /*=============================================
    =            Datetime utils            =
    =============================================*/
    /**
     * Kiểm tra chuỗi ngày tháng hoặc đối tượng Date có hợp lệ không
     * @param {string|Date} date
     * @param {string} format
     * @returns {boolean}
     */
    isValidDate(date, format = '') {
        const newDate = date instanceof Date ? date : this.parseDate(date, format);
        return !isNaN(newDate);
    }

    /**
     * Kiểm tra chuỗi giờ phút có hợp lệ không
     * @param {string} time
     * @returns {boolean}
     */
    isValidTime(time) {
        if (!time) {
            return false;
        }

        let a = time.split(":");

        if (a.length != 2) {
           return false;
        }

        let h = parseInt(a[0], 10);
        let m = parseInt(a[1], 10);

        if (isNaN(h) || isNaN(m)) {
            return false;
        }

        if (h >= 24 || m >= 60) {
            return false;
        }

        return true;
    }

    isSameDate(d1, d2) {
        if (!d1 || !d2) return false;

        return d1.getFullYear() === d2.getFullYear()
            && d1.getMonth() === d2.getMonth()
            && d1.getDate() === d2.getDate();
    }

    isDateBetween(date, minDate, maxDate) {
        const d = this.copyDate(date, false);
        const min = minDate ? this.copyDate(minDate, false) : null;
        const max = maxDate ? this.copyDate(maxDate, false) : null;

        return (!min || d >= min) && (!max || d <= max);
    }

    isTimeBetween(time, minTime, maxTime) {
        const timeMinutes = this.timeToMinutes(time);
        const minMinutes = this.timeToMinutes(minTime);
        const maxMinutes = this.timeToMinutes(maxTime);

        return timeMinutes >= minMinutes && timeMinutes <= maxMinutes;
    }

    isWeekend(date) {
        return date.getDay() === 0 || date.getDay() === 6;
    }

    /**
     * Chuyển đổi chuỗi thành đối tượng Date theo định dạng cho trước
     * @param {string} date
     * @param {string} format
     * @returns {Date|null}
     */
    parseDate(str, format = '') {
        if (str === null) return null;
        if (str === undefined) return null;
        if (str instanceof Date) return new Date(str);

        if (! format) {
            format = this.options.timepicker && this.strHasTime(str)
                ? this.datetimeFormat
                : this.dateFormat;
        }

        const formatParts = format.split(/[-/ :]/);
        const dateParts = str.split(/[-/ :]/);

        let year, month, day, hours = 0, minutes = 0;

        formatParts.forEach((part, index) => {
            switch (part) {
                case 'YYYY':
                    year = parseInt(dateParts[index], 10);
                    break;
                case 'MM':
                    month = parseInt(dateParts[index], 10) - 1;
                    break;
                case 'DD':
                    day = parseInt(dateParts[index], 10);
                    break;
                case 'HH':
                    hours = parseInt(dateParts[index], 10);
                    break;
                case 'mm':
                    minutes = parseInt(dateParts[index], 10);
                    break;
            }
        });

        const newDate = new Date(year, month, day, hours, minutes);
        if (newDate.getFullYear() !== year || newDate.getMonth() !== month || newDate.getDate() !== day ||
            newDate.getHours() !== hours || newDate.getMinutes() !== minutes) {
            return null;
        }

        return newDate;
    }

    /**
     * Chuyển đổi chuỗi dạng giờ phút HH:mm thành đối tượng Date
     * @param {string} str
     * @returns {Date}
     */
    parseTime(str) {
        if (!this.isValidTime(str)) return null;

        let a = str.split(":");

        const d = new Date();
        d.setHours(parseInt(a[0], 10), parseInt(a[1], 10));

        return d;
    }

    parseInputDate(d) {
        return this.parseDate(d, this.options.format);
    }

    /**
     * Format date thành chuỗi theo định dạng cho trước
     * @param {Date} date
     * @param {string} format
     * @returns {string}
     */
    formatDate(date, format = '') {
        if (!this.isValidDate(date)) return '';

        if (! format) {
            format = this.options.timepicker && this.strHasTime(date)
                ? this.datetimeFormat
                : this.dateFormat;
        }
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const dateValue = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const seconds = date.getSeconds();

        const matches = (match) => {
            switch (match) {
                case 'YY':
                    return String(year).slice(-2);
                case 'YYYY':
                    return this.padZero(year, 4);
                case 'M':
                    return String(month);
                case 'MM':
                    return this.padZero(month, 2);
                case 'D':
                    return String(dateValue);
                case 'DD':
                    return this.padZero(dateValue, 2);
                case 'H':
                    return String(hour);
                case 'HH':
                    return this.padZero(hour, 2);
                case 'm':
                    return String(minute);
                case 'mm':
                    return this.padZero(minute, 2);
                case 's':
                    return String(seconds);
                case 'ss':
                    return this.padZero(seconds, 2);
                default:
                    break;
            }
            return null;
        };

        const regexFormat = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
        return format.replace(regexFormat, (match, $1) => $1 || matches(match));
    }

    /**
     * Format date thành chuỗi dùng hiển thị trên input
     * @param {Date} date
     * @returns {string}
     */
    formatInputDate(date) {
        return this.formatDate(date, this.options.format);
    }

    /**
     * Format date chỉ gồm ngày tháng năm, dạng YYYY/MM/DD
     * @param {Date} date
     * @returns {string}
    */
    formatDateOnly(date) {
        return this.formatDate(date, 'YYYY/MM/DD');
    };

    /**
     * Format date chỉ gồm giờ phút, dạng HH:mm
     * @param {Date} date
     * @returns {string}
    */
    formatTimeOnly(date) {
        return this.formatDate(date, 'HH:mm');
    };

    countDaysInMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }

    roundTimeByStep(time, step) {
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let roundedMinutes = Math.ceil(minutes / step) * step;

        if (roundedMinutes === 60) {
            hours += 1;
            roundedMinutes = 0;
        }

        time.setHours(hours, roundedMinutes, 0, 0);
    }

    /**
     * Copies date
     * @param {Date} date
     * @param {Boolean} [keepTime] - should keep the time in a new date or not
     * @return {Date}
     */
    copyDate(date, keepTime = true) {
        let newDate = new Date(date.getTime());

        if (typeof keepTime === 'boolean' && !keepTime) {
            this.resetTime(newDate);
        }

        return newDate;
    }

    /**
     * Reset time to zero
     * @param {Date} date
     * @returns {Date}
     */
    resetTime(date) {
        date.setHours(0, 0, 0, 0);
        return date;
    }

    /**
     * Kiểm tra chuỗi ngày tháng có phần time hay không
     * @param {string} dateTimeString
     * @returns {boolean}
     */
    strHasTime(dateTimeString) {
        const timeRegex = /\b([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?\b/;
        return timeRegex.test(dateTimeString);
    }

    timeToMinutes(time) {
        return time.getHours() * 60 + time.getMinutes();
    }

    /*=============================================
    =            Utils            =
    =============================================*/

    normalizeArray(value) {
        return value && Array.isArray(value) ? value : [];
    }

    arrayUnique(arr) {
        return [...new Set(arr)];
    }

    isPlainObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    /**
     * Thêm số 0 vào đầu chuỗi số cho đủ độ dài length
     * @param {number} number
     * @param {number} length Độ dài chuỗi sau khi thêm số 0
     * @returns {string}
     */
    padZero(number, length) {
        return String(number).padStart(length, '0');
    }

    /*---------- DOM Utils ---------- */

    createElement(tagName = 'div', className = '', innerHtml = '', id = '', attrs = {}) {
        let $element = document.createElement(tagName);
        if (className) $element.classList.add(...className.split(' '));
        if (id) $element.id = id;

        if (innerHtml) {
            $element.innerHTML = innerHtml;
        }

        if (attrs) {
            this.setAttribute($element, attrs);
        }

        return $element;
    }

    setAttribute(el, attrs) {
        for (let [name, value] of Object.entries(attrs)) {
            if (value === undefined) continue;

            el.setAttribute(name, value);
        }
        return el;
    }

    hideEl(el) {
        el.style.display = 'none';
    }

    showEl(el, value = 'block') {
        el.style.display = value;
    }

    isVisible(el) {
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }

    triggerEvent(el, eventType, detail) {
        el.dispatchEvent(new CustomEvent(eventType, { detail }));
    }

    /** Tính offset của element so với page */
    getOffset(element) {
        let rect = element.getBoundingClientRect();
        let win = element.ownerDocument.defaultView;

        return {
            top: rect.top + win.scrollY,
            right: rect.right + win.scrollX,
            bottom: rect.bottom + win.scrollY,
            left: rect.left + win.scrollX,
        };
    }

    setPosition = () => {
        let pageOffsetBottom = window.innerHeight + window.scrollY;
        let pageWidth = document.body.clientWidth;
        let dtpHeight = this.$datetimePicker.offsetHeight;
        let dtpWidth = this.$datetimePicker.offsetWidth;
        let inputOffset = this.getOffset(this.$input);

        let position = "absolute";
        let top = inputOffset.bottom + dtpHeight > pageOffsetBottom
            ? Math.max(0, inputOffset.top - dtpHeight)
            : inputOffset.bottom;
        let left = inputOffset.left;

        /** không đủ chỗ theo chiều ngang của datetimepicker */
        if (dtpWidth + left > pageWidth) {
            left = inputOffset.right > pageWidth
                ? pageWidth - dtpWidth
                : Math.max(0, inputOffset.right - dtpWidth);
        }

        let datetimepickerCss = {
            position: position,
            left: left + 'px',
            top: top + 'px',
            bottom: ''  //Initialize to prevent previous values interfering with new ones.
        };

        this.setCss(this.$datetimePicker, datetimepickerCss);
    }

    setCss(el, styles = {}) {
        for (let i in styles){
            el.style[i] = styles[i];
        }
    }

}