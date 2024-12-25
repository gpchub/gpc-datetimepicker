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
        /** @var String Format datetime */
		format: 'YYYY/MM/DD HH:mm',

        /** @var Boolean Đóng khi chọn ngày */
		closeOnDateSelect: false,
        /** @var Boolean Đóng khi chọn giờ */
		closeOnTimeSelect: true,

        /** @var Date|null Ngày ban đầu, dùng format trong formatDate  */
		initValue: null,

		minDate: false,
		maxDate: false,
		minTime: false,
		maxTime: false,
        /** @var Number Năm nhỏ nhất trong lịch */
		yearStart: 1950,
        /** @var Number Năm lớn nhất trong lịch */
		yearEnd: 2050,
        highlightedDates: [],
		highlightedPeriods: [],
		allowDates: [],
		allowDateRe: null,
		disabledDates: [],
		disabledWeekDays: [],

		allowTimes: [],
        disabledTimes: [],

        /** @var Number Thứ bắt đầu trong tuần (0: CN, 1-6: T2-T7) */
        dayOfWeekStart: 0,
        /** @var Boolean Hiện nút Today */
		todayButton: true,
        /** @var Boolean Hiện nút Tháng trước */
        prevButton: true,
        /** @var Boolean Hiện nút Tháng sau */
		nextButton: true,

        /** @var Boolean Hiện timepicker */
		timepicker: true,
        /** @var Number Khoảng cách phút trong ô chọn giờ */
		step: 60,
        /** @var String Cách làm tròn số phút trong ô chọn giờ */
		roundTime: 'round', // ceil, floor

        hours12: false,// TODO đang lỗi

		defaultSelect: true, // BUG không có tác dụng

        /** @var Boolean Hiện input mask */
		mask: false,
        /** @var Boolean Validate khi rời khỏi input */
		validateOnBlur: true,
        /** @var Boolean Cho phép input empty khi validate */
		allowBlank: true,

        /** @var String Selector chứa datetime picker */
        parentSelector: 'body',
        /** @var Boolean Datetimepicker đặt trong parent của input */
        insideParent: false,
        /** @var String Classname nút next ở phần chọn tháng và chọn giờ */
		next: 'gdtp-next',
        /** @var String Classname nút prev ở phần chọn tháng và chọn giờ */
		prev : 'gdtp-prev',
        /** @var Boolean Datetimepicker position: fixed */
		fixed: false,

		beforeShowDay: function () {},
        beforeShowTime: function () {},
        onSelectDate: function () {},
		onSelectTime: function () {},
		onChangeMonth: function () {},
		onGetWeekOfYear: function () {},
		onChangeYear: function () {},
		onChangeDateTime: function () {},
		onShow: function () {},
		onClose: function () {},
		onGenerate: function () {},
	};

    i18n = {
        en: { // English
            months: [
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayOfWeekShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
            dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            meridiem: ['AM', 'PM'],
        },
        vi: { // Vietnamese
            months: [
                "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
            ],
            monthsShort: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
            dayOfWeekShort: [ "CN", "T2", "T3", "T4", "T5", "T6", "T7" ],
            dayOfWeek: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
            meridiem: ['AM', 'PM'],
        },
    };

    globalLocale = 'vi';

    /** @var String Format for minTime and maxTime */
    timeFormat = 'HH:mm';
    /** @var String Format for minDate and maxDate */
    dateFormat = 'YYYY/MM/DD';
    /** @var String Format date time */
    datetimeFormat = 'YYYY/MM/DD HH:mm';

    valueFormat = '';

    options = {};

    /** thời gian của view hiện tại */
    currentViewDateTime = null;
    /** thời gian hiện tại của datetimepicker */
    currentValue = null;

    dtChangeTimer = 0;
    ctrlDown = false;
    cmdDown = false;

    constructor(el, opts) {
        this.$input = this.getEl(el);
        if (!this.$input) return;

        this.options = { ...this.defaultOptions, ...this.normalizeOptions(opts) };

        this.valueFormat = this.options.timepicker ? this.datetimeFormat : this.dateFormat;
        if (this.options.locale && this.i18n[this.options.locale]) {
            this.globalLocale = this.options.locale;
        }

        this.$datetimePicker = this.createElement('div', 'gdtp-datetimepicker');

        this.$datePicker = this.createElement('div', 'gdtp-datepicker active');
        this.$calendar = this.createElement('div', 'gdtp-calendar');
        this.$monthPicker = this.createElement('div', 'gdtp-monthpicker', '<button type="button" class="gdtp-prev"></button><button type="button" class="gdtp-today-button"></button><div class="gdtp-label gdtp-month"><span></span><i></i></div><div class="gdtp-label gdtp-year"><span></span><i></i></div><button type="button" class="gdtp-next"></button>');
        this.$monthSelect = this.createElement('div', 'gdtp-select gdtp-monthselect', '<div></div>');
        this.$yearSelect = this.createElement('div', 'gdtp-select gdtp-yearselect', '<div></div>');

        this.$timePicker = this.createElement('div', 'gdtp-timepicker active', '<button type="button" class="gdtp-prev"></button><div class="gdtp-time-box"><div class="gdtp-time-variant"></div></div><button type="button" class="gdtp-next"></button>');
        this.$timebox = this.$timePicker.querySelector('.gdtp-time-variant');

        this.init();
    }

    init() {
        this.initCurrentValue();
        this.initCurrentViewDateTime();
        this.createDateTimePicker();
    }

    initCurrentValue() {
        /**
         * Thứ tự ưu tiên
         * - init date & time
         * - input value
         * - null
         */
        if (!this.options.initValue && !this.$input.value) {
            return;
        }

        let initDate;
        let inputDate;

        if (this.options.initValue) {
            initDate = this.parseDate(this.options.initValue);
        }

        if (this.$input.value) {
            inputDate = this.parseInputDate(this.$input.value);
        }

        if (initDate) {
            this.currentValue = initDate;
            this.$input.value = this.formatInputDate(initDate);
        } else {
            this.currentValue = inputDate;
        }
    }

    initCurrentViewDateTime() {
        this.currentViewDateTime = this.currentValue ?? this.now();
    }

    getValue() {
        return this.currentValue;
    }

    createDateTimePicker() {
        const options = this.options;

        this.$input.setAttribute('readonly', true);
        this.$monthPicker.querySelector('.gdtp-month span').after(this.$monthSelect);
        this.$monthPicker.querySelector('.gdtp-year span').after(this.$yearSelect);

        this.$datePicker.append(this.$monthPicker);
        this.$datePicker.append(this.$calendar);

        this.$datetimePicker.append(this.$datePicker);
        this.$datetimePicker.append(this.$timePicker);

        if (options.insideParent) {
            this.$input.parentElement.append(this.$datetimePicker);
        } else {
            document.querySelector(options.parentSelector).append(this.$datetimePicker);
        }

        if (options.timepicker) {
            this.$timePicker.classList.add('active');
        } else {
            this.$timePicker.classList.remove('active');
        }

        this.$monthPicker.querySelector('.gdtp-today-button').style.visibility = !options.todayButton ? 'hidden' : 'visible';
        this.$monthPicker.querySelector('.' + options.prev).style.visibility = !options.prevButton ? 'hidden' : 'visible';
        this.$monthPicker.querySelector('.' + options.next).style.visibility = !options.nextButton ? 'hidden' : 'visible';

        this.bindInputEvents();
        this.bindDatepickerEvents();
        this.bindMonthEvents();
        this.bindTimeEvents();
        this.bindCalendarEvents();
        this.triggerEvent(this.$datetimePicker, 'dt.change');
    }

    bindDatepickerEvents() {
        document.addEventListener('click', (e) => {
            if (e.target === this.$input || this.$datetimePicker.contains(e.target)) {
                return false;
            }

            this.triggerEvent(this.$datetimePicker, 'dt.close');
        });

        this.$datetimePicker.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.hideEl(this.$yearSelect);
            this.hideEl(this.$monthSelect);
            return false;
        });

        this.$datetimePicker.addEventListener('dt.change', (e) => {
            clearTimeout(this.dtChangeTimer);
            this.dtChangeTimer = setTimeout(() => {
                this.buildHtml();
            }, 10);
            e.stopPropagation();
        });

        this.$datetimePicker.addEventListener('dt.generate', (e) => {
            if (this.options.onGenerate && typeof this.options.onGenerate === 'function') {
                this.options.onGenerate.call(this, this.currentTime, this.$datetimePicker.dataset.input);
            }
        });

        this.$datetimePicker.addEventListener('dt.open', (e) => {
            let onShow = true;
            if (this.options.onShow && typeof this.options.onShow === 'function') {
                onShow = this.options.onShow.call(this, this.currentTime, this.$input, e);
            }
            if (onShow !== false) {
                this.showEl(this.$datetimePicker);
                this.setPosition();
                window.removeEventListener('resize', this.setPosition);
                window.addEventListener('resize', this.setPosition);

                this.triggerEvent(this.$datetimePicker, 'dt.afterOpen');
            }
        });

        this.$datetimePicker.addEventListener('dt.close', (e) => {
            let onClose = true;
            this.$monthPicker.querySelectorAll('.gdtp-select').forEach((elem) => {
                this.hideEl(elem);
            });

            if (this.options.onClose && typeof this.options.onClose === 'function') {
                onClose = this.options.onClose.call(this, this.currentTime, this.$input, e);
            }

            if (onClose !== false) {
                this.hideEl(this.$datetimePicker);
            }

            e.stopPropagation();
        });

        this.$datetimePicker.addEventListener('dt.toggle', (e) => {
            if (this.isVisible(this.$datetimePicker)) {
                this.triggerEvent(this.$datetimePicker, 'dt.close');
            } else {
                this.triggerEvent(this.$datetimePicker, 'dt.open');
            }
        });

        this.$datetimePicker.addEventListener('dt.afterOpen', (e) => {
            if (!this.options.timepicker) return;

            let classType;

            if (this.$timebox.querySelector('.gdtp-current')) {
                classType = '.gdtp-current';
            }

            if (classType) {
                /** scroll timebox tới time đang được chọn */
                let top = this.$timebox.querySelector(classType);
                this.$timebox.scrollTop = top.offsetTop;
            }
        });

        this.$datetimePicker.addEventListener('dt.changedatetime', (e) => {
            if (this.options.onChangeDateTime && typeof this.options.onChangeDateTime === 'function') {
                this.options.onChangeDateTime.call(this, this.currentViewDateTime, this.$input, e);
                this.triggerEvent(this.$input, 'change');
            }
        });

    }

    inputKeyDownHandler = (e) => {
        let key = e.which;
        if (key === GKeycode.ENTER || key === GKeycode.TAB) {
            this.triggerEvent(this.$datetimePicker, 'dt.close');
            this.$input.focus();
            return false;
        }
    };

    bindInputEvents() {
        ['dt.open', 'focusin'].forEach((eventName) => {
            this.$input.addEventListener(eventName, (e) => {
                if (this.$input.matches(':disabled')) {
                    return;
                }

                if (this.$input.matches(':disabled')) {
                    return;
                }

                if (this.options.mask) {
                    this.setMask(this.options);
                }

                this.triggerEvent(this.$datetimePicker, 'dt.open');
            });
        });

        this.$input.addEventListener('keydown', this.inputKeyDownHandler);
    }

    bindMonthEvents() {
        /*---------- click label tháng, năm ---------- */
        this.$monthPicker.querySelectorAll('.gdtp-month span, .gdtp-year span').forEach((elem) => {
            elem.addEventListener('click', (e) => {
                e.stopPropagation();

                const $select = elem.nextSibling;
                this.$monthPicker.querySelectorAll('.gdtp-select').forEach((s) => {
                    this.hideEl(s);
                });

                this.showEl($select);
                $select.firstChild.scrollTop = $select.querySelector('.gdtp-current').offsetTop;
            });
        });

        /*---------- Click option trong list tháng, năm ---------- */
        this.$monthPicker.addEventListener('click', (e) => {
            if (!e.target.matches('.gdtp-option')) return;

            const { currentViewDateTime, options } = this;
            const elem = e.target;
            const selectElem = elem.closest('.gdtp-select');

            let year = currentViewDateTime.getFullYear();
            if (currentViewDateTime) {
                currentViewDateTime[selectElem.classList.contains('gdtp-monthselect') ? 'setMonth' : 'setFullYear'](elem.dataset.value);
            }

            this.hideEl(selectElem);

            this.triggerEvent(this.$datetimePicker, 'dt.change');

            if (options.onChangeMonth && typeof options.onChangeMonth === 'function') {
                options.onChangeMonth.call(this, currentViewDateTime, this.$input);
            }

            if (year !== currentViewDateTime.getFullYear() && typeof options.onChangeYear === 'function') {
                options.onChangeYear.call(this, currentViewDateTime, this.$input);
            }
        });

        /*---------- click today button ---------- */
		this.$monthPicker.addEventListener('click', (e) => {
            if (!e.target.matches('.gdtp-today-button')) return;

            let today = this.now();
            this.currentViewDateTime.setMonth(today.getMonth());
            this.currentViewDateTime.setDate(today.getDate());
            this.currentViewDateTime.setFullYear(today.getFullYear());
            this.triggerEvent(this.$datetimePicker, 'dt.change');
        });

        /*---------- click nút mũi tên ở lựa chọn tháng ---------- */
        this.$monthPicker.addEventListener('click', (e) => {
            if (!e.target.matches('.gdtp-prev, .gdtp-next')) return;

            const elem = e.target;

            if (elem.classList.contains(this.options.next)) {
                this.nextMonth();
            } else if (elem.classList.contains(this.options.prev)) {
                this.prevMonth();
            }
        });
    }

    bindTimeEvents() {
        /*---------- click nút mũi tên ở lựa chọn time ---------- */
        this.$timePicker.addEventListener('click', (e) => {
            if (!e.target.matches('.gdtp-prev, .gdtp-next')) return;

            const elem = e.target;
            const timebox = this.$timebox;

            let currentScrollTop = timebox.scrollTop;
            let timeElem = timebox.querySelector('.gdtp-time');
            let timeHeight = timeElem.offsetHeight;
            if (elem.classList.contains(this.options.next)) {
                timebox.scrollTop = currentScrollTop + timeHeight;
            } else if (elem.classList.contains(this.options.prev)) {
                timebox.scrollTop = currentScrollTop - timeHeight;
            }
        });

        /*---------- click chọn giờ ---------- */
		this.$timePicker.addEventListener('click', (e) => {
            if (!e.target.matches('.gdtp-time')) return;

            e.stopPropagation();

            let elem = e.target;
            const { currentViewDateTime, options } = this;

            if (currentViewDateTime === undefined || currentViewDateTime === null) {
                currentViewDateTime = this.now();
            }

            if (elem.classList.contains('gdtp-disabled')) {
                return false;
            }

            currentViewDateTime.setHours(elem.dataset.hour);
            currentViewDateTime.setMinutes(elem.dataset.minute);

            this.currentValue = currentViewDateTime;
            this.$input.value = this.formatInputDate(this.currentValue);

            if (options.onSelectTime && typeof options.onSelectTime === 'function') {
                options.onSelectTime.call(this, currentViewDateTime, this.$input, e);
            }

            this.triggerEvent(this.$datetimePicker, 'dt.change');
            this.triggerEvent(this.$datetimePicker, 'dt.changedatetime');

            if (options.closeOnTimeSelect === true) {
                this.triggerEvent(this.$datetimePicker, 'dt.close');
            }
        });
    }

    bindCalendarEvents() {
        /*---------- click chọn ngày ---------- */
		let calendarclick = 0;
        this.$calendar.addEventListener('click', (e) => {
            const elem = e.target.closest('.gdtp-date');
            if (!elem || !elem.matches('.gdtp-date')) return;

            e.stopPropagation();

            calendarclick += 1;

            const { currentViewDateTime, options } = this;

            if (currentViewDateTime === undefined || currentViewDateTime === null) {
                currentViewDateTime = this.now();
            }

            if (elem.classList.contains('gdtp-disabled')) {
                return false;
            }

            currentViewDateTime.setDate(1);
            currentViewDateTime.setFullYear(elem.dataset.year);
            currentViewDateTime.setMonth(elem.dataset.month);
            currentViewDateTime.setDate(elem.dataset.date);

            this.currentValue = this.currentViewDateTime;
            this.$input.value = this.formatInputDate(this.currentValue);

            if (options.onSelectDate &&	typeof options.onSelectDate === 'function') {
                options.onSelectDate.call(this, currentViewDateTime, this.$input, e);
            }

            this.hideEl(this.$monthSelect);
            this.hideEl(this.$yearSelect);
            this.triggerEvent(this.$datetimePicker, 'dt.change');
            this.triggerEvent(this.$datetimePicker, 'dt.changedatetime');

            if (
                (
                    calendarclick > 1
                    || (options.closeOnDateSelect === true  || (options.closeOnDateSelect === false && !options.timepicker))
                )
            ) {
                this.triggerEvent(this.$datetimePicker, 'dt.close');
            }
            setTimeout(function () {
                calendarclick = 0;
            }, 200);
        });
    }

    bindDocumentEvents() {
        $(options.ownerDocument)
            .off('keydown.xdsoftctrl keyup.xdsoftctrl')
            .off('keydown.xdsoftcmd keyup.xdsoftcmd')
			.on('keydown.xdsoftctrl', function (e) {
				if (e.keyCode === CTRLKEY) {
					ctrlDown = true;
                }
			})
			.on('keyup.xdsoftctrl', function (e) {
				if (e.keyCode === CTRLKEY) {
					ctrlDown = false;
                }
            })
            .on('keydown.xdsoftcmd', function (e) {
                if (e.keyCode === CMDKEY) {
                    cmdDown = true;
                }
			})
			.on('keyup.xdsoftcmd', function (e) {
                if (e.keyCode === CMDKEY) {
                    cmdDown = false;
                }
			});
    }

    buildHtml() {
        this.buildMonthYearPicker();
        this.buildCalendar();
        this.buildTimePicker();
    }

    buildMonthYearPicker() {
        const { options, i18n, globalLocale, currentViewDateTime } = this;

        /** Month & Year label */
        this.$monthPicker.querySelector('.gdtp-month span').innerHTML = i18n[globalLocale].months[currentViewDateTime.getMonth()];
        this.$monthPicker.querySelector('.gdtp-year span').innerHTML = currentViewDateTime.getFullYear();

        /** Month & Year select options */
        let opt = '';

        for (let i = parseInt(options.yearStart, 10); i <= parseInt(options.yearEnd, 10); i += 1) {
            opt += '<div class="gdtp-option ' + (currentViewDateTime.getFullYear() === i ? 'gdtp-current' : '') + '" data-value="' + i + '">' + i + '</div>';
        }
        this.$yearSelect.firstChild.innerHTML = opt;

        opt = '';
        for (let i = 0; i <= 11; i += 1) {
            opt += '<div class="gdtp-option ' + (currentViewDateTime.getMonth() === i ? 'gdtp-current' : '') + '" data-value="' + i + '">' + i18n[globalLocale].months[i] + '</div>';
        }
        this.$monthSelect.firstChild.innerHTML = opt;
    }

    buildCalendar() {
        const { i18n, globalLocale, options, currentViewDateTime } = this;

        let header = '<div class="gdtp-weekdays">';
        for (let j = 0; j < 7; j += 1) {
            header += '<div class="gdtp-weekday">' + i18n[globalLocale].dayOfWeekShort[(j + options.dayOfWeekStart) % 7] + '</div>';
        }
        header += '</div>';

        // ngày đầu tiên trong tháng current view
        let currentDate = new Date(currentViewDateTime.getFullYear(), currentViewDateTime.getMonth(), 1, 12, 0, 0);

        // loop back về ngày bắt đầu trong tuần đó, có thể là những ngày cuối của tháng trước
        while (currentDate.getDay() !== options.dayOfWeekStart) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        let i = 0;
        let daysInMonth = this.countDaysInMonth(currentViewDateTime);
        let maxDate = this.parseDate(options.maxDate);
        let minDate = this.parseDate(options.minDate);
        let today = this.now();
        let hDate;
        let customDateSettings;
        let calendar = '<div class="gdtp-days">';

        while (
            i < daysInMonth // in ngày của tháng trước nếu có
            || currentDate.getDay() !== options.dayOfWeekStart // in thêm ngày của tháng sau khi row trong tuần còn chỗ
            || currentViewDateTime.getMonth() === currentDate.getMonth()
        ) {
            i += 1;

            let classes = [];
            let day = currentDate.getDay();
            let d = currentDate.getDate();
            let y = currentDate.getFullYear();
            let m = currentDate.getMonth();
            let description = '';

            classes.push('gdtp-date');

            if (options.beforeShowDay && typeof options.beforeShowDay.call === 'function') {
                customDateSettings = options.beforeShowDay.call(this, currentDate);
            } else {
                customDateSettings = null;
            }

            if (options.allowDateRe && Object.prototype.toString.call(options.allowDateRe) === "[object RegExp]") {
                if (!options.allowDateRe.test(this.formatDate(currentDate))) {
                    classes.push('gdtp-disabled');
                }
            }

            if (options.allowDates.length > 0 && options.allowDates.indexOf(this.formatDate(currentDate)) === -1) {
                classes.push('gdtp-disabled');
            }

            if (
                (maxDate && currentDate > maxDate)
                || (minDate && currentDate < minDate)
                || (customDateSettings && customDateSettings[0] === false)
            ) {
                classes.push('gdtp-disabled');
            }

            if (options.disabledDates.indexOf(this.formatDate(currentDate)) !== -1) {
                classes.push('gdtp-disabled');
            }

            if (options.disabledWeekDays.indexOf(day) !== -1) {
                classes.push('gdtp-disabled');
            }

            if (this.$input.matches('[disabled]')) {
                classes.push('gdtp-disabled');
            }

            if (customDateSettings && customDateSettings[1] !== "") {
                classes.push(customDateSettings[1]);
            }

            if (currentViewDateTime.getMonth() !== m) {
                classes.push('gdtp-other-month');
            }

            if (this.formatDate(currentViewDateTime) === this.formatDate(currentDate)) {
                classes.push('gdtp-current');
            }

            if (this.formatDate(today) === this.formatDate(currentDate)) {
                classes.push('gdtp-today');
            }

            if (day === 0 || day === 6) {
                classes.push('gdtp-weekend');
            }

            if (options.highlightedDates[this.formatDate(currentDate)] !== undefined) {
                hDate = options.highlightedDates[this.formatDate(currentDate)];
                classes.push(hDate.style === undefined ? 'gdtp-highlighted-default' : hDate.style);
                description = hDate.desc === undefined ? '' : hDate.desc;
            }

            calendar += `<div data-date="${d}" data-month="${m}" data-year="${y}" data-day="${day}" class="${classes.join(' ')}" title="${description}">${d}</div>`;

            currentDate.setDate(d + 1);
        }

        calendar += '</div>';
        this.$calendar.innerHTML = header + calendar;
    }

    buildTimePicker() {
        const { options, currentViewDateTime } = this;

        let extraOpts = null;
        if (options.beforeShowTime && typeof options.beforeShowTime === 'function') {
            extraOpts = options.beforeShowTime.call(this, currentViewDateTime);
        }

        let minTime = extraOpts.minTime || options.minTime;
        let maxTime = extraOpts.maxTime || options.maxTime;
        let allowTimes = extraOpts.allowTimes || options.allowTimes;
        let disabledTimes = extraOpts.disabledTimes || options.disabledTimes;

        let minTimeMinutesOfDay = 0;
        if (minTime) {
            let t = this.parseTime(minTime);
            minTimeMinutesOfDay = 60 * t.getHours() + t.getMinutes();
        }

        let maxTimeMinutesOfDay = 24 * 60;
        if (maxTime) {
            let t = this.parseTime(maxTime);
            maxTimeMinutesOfDay = 60 * t.getHours() + t.getMinutes();
        }

        let roundCurrentViewMinutesByStep = Math[options.roundTime](currentViewDateTime.getMinutes() / options.step) * options.step;
        let currentViewHours = currentViewDateTime.getHours();
        let timeHtml = '';

        if (roundCurrentViewMinutesByStep === 60) {
            currentViewHours += 1;
            roundCurrentViewMinutesByStep = 0;
        }

        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 60; j += options.step) {
                let currentStepMinutesOfDay = i * 60 + j;
                let classes = ['gdtp-time'];

                if (currentStepMinutesOfDay > maxTimeMinutesOfDay || currentStepMinutesOfDay < minTimeMinutesOfDay) {
                    continue;
                }

                let h = (i < 10 ? '0' : '') + i;
                let m = (j < 10 ? '0' : '') + j;
                let strTime = `${h}:${m}`;

                if (allowTimes.length > 0 && !allowTimes.includes(strTime)) {
                    classes.push('gdtp-disabled');
                }

                if (disabledTimes.length > 0 && disabledTimes.includes(strTime)) {
                    classes.push('gdtp-disabled');
                }

                if (currentViewHours === i && roundCurrentViewMinutesByStep === j) {
                    classes.push('gdtp-current');
                }

                timeHtml += `<div class="${classes.join(' ')}" data-hour="${i}" data-minute="${j}">${h}:${m}</div>`;
            }
        }

        this.$timebox.innerHTML = timeHtml;
    }

    normalizeOptions(opts) {
        if (!this.isPlainObject(opts)) return {};

        if (opts.allowDateRe && Object.prototype.toString.call(opts.allowDateRe) === "[object String]") {
            opts.allowDateRe = new RegExp(opts.allowDateRe);
        }

        opts.allowTimes = this.normalizeArray(opts.allowTimes);
        opts.disabledTimes = this.normalizeArray(opts.disabledTimes);
        opts.allowDates = this.normalizeArray(opts.allowDates);
        opts.disabledDates = this.normalizeArray(opts.disabledDates);
        opts.disabledWeekDays = this.normalizeArray(opts.disabledWeekDays);
        opts.highlightedDates = this.parseHighlightedDates(opts.highlightedDates, opts.highlightedPeriods);

        opts.minDate = this.isValidDate(opts.minDate) ? opts.minDate : '';
        opts.maxDate = this.isValidDate(opts.maxDate) ? opts.maxDate : '';
        opts.minTime = this.isValidTime(opts.minTime) ? opts.minTime : '';
        opts.maxTime = this.isValidTime(opts.maxTime) ? opts.maxTime : '';

        opts.initValue = this.isValidDate(opts.initValue) ? opts.initValue : '';

        if (isNaN(opts.dayOfWeekStart)) {
            opts.dayOfWeekStart = 0;
        } else {
            opts.dayOfWeekStart = parseInt(opts.dayOfWeekStart, 10) % 7;
        }
        opts.dayOfWeekStartPrev = (opts.dayOfWeekStart === 0) ? 6 : opts.dayOfWeekStart - 1;

        return opts;
    }

    parseHighlightedDates(highlightedDates, highlightedPeriods) {
        const result = {};

        if (highlightedDates && Array.isArray(highlightedDates) && highlightedDates.length) {
            highlightedDates.forEach((value) => {
                let splitData = value.split(',').map((x) => x.trim());
                let newDate = new GHighlightedDate(this.dateHelper.parseDate(splitData[0], options.formatDate), splitData[1], splitData[2]);
                let dateKey = this.dateHelper.formatDate(hDate.date, options.formatDate);

                if (result[dateKey] !== undefined) {
                    let desc = result[dateKey].desc;
                    if (desc?.length && newDate.desc?.length) {
                        result[dateKey].desc = desc + "\n" + newDate.desc;
                    }
                } else {
                    result[dateKey] = newDate;
                }
            });
        }

        if (highlightedPeriods && Array.isArray(highlightedPeriods) && highlightedPeriods.length) {
            highlightedPeriods.forEach((value) => {
                let dateStart;
                let dateEnd;
                let desc;
                let style;
                let newDate;
                let dateKey;
                let existedDesc;

                if (Array.isArray(value)) {
                    dateStart = value[0];
                    dateEnd = value[1];
                    desc = value[2];
                    style = value[3];
                } else {
                    let splitData = value.split(',').map((x) => x.trim());
                    dateStart = this.dateHelper.parseDate(splitData[0], options.formatDate);
                    dateEnd = this.dateHelper.parseDate(splitData[1], options.formatDate);
                    desc = splitData[2];
                    style = splitData[3];
                }

                while (dateStart <= dateEnd) {
                    newDate = new GHighlightedDate(dateStart, desc, style);
                    dateKey = dateHelper.formatDate(dateStart, options.formatDate);

                    if (result[dateKey] !== undefined) {
                        existedDesc = result[dateKey].desc;
                        if (existedDesc && existedDesc.length && newDate.desc && newDate.desc.length) {
                            result[dateKey].desc = existedDesc + "\n" + newDate.desc;
                        }
                    } else {
                        result[dateKey] = newDate;
                    }

                    dateStart.setDate(dateStart.getDate() + 1);
                }
            });
        }

        return result;
    }

    setPosition = () => {
        let dateInputElem = this.$input;
        let dateInputOffset = this.getOffset(dateInputElem);

        let verticalAnchorEdge = 'top';
        let verticalPosition = (dateInputOffset.top + dateInputElem.offsetHeight) - 1;
        let left = dateInputOffset.left;
        let position = "absolute";

        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let windowScrollTop = window.scrollY;

        const { options } = this;

        if ((document.documentElement.clientWidth - dateInputOffset.left) < this.$datetimePicker.offsetWidth) {
            var diff = this.$datetimePicker.offsetWidth - dateInputElem.offsetWidth;
            left = left - diff;
        }

        if (options.fixed) {
            verticalPosition -= windowScrollTop;
            left -= window.scrollX;
            position = "fixed";
        } else {
            let dateInputHasFixedAncestor = false;

            this.forEachAncestorOf(dateInputElem, (ancestorNode) => {
                if (ancestorNode === null) {
                    return false;
                }

                if (window.getComputedStyle(ancestorNode).getPropertyValue('position') === 'fixed') {
                    dateInputHasFixedAncestor = true;
                    return false;
                }
            });

            if (dateInputHasFixedAncestor && !options.insideParent) {
                position = 'fixed';

                //If the picker won't fit entirely within the viewport then display it above the date input.
                if (verticalPosition + this.$datetimePicker.offsetHeight > windowHeight + windowScrollTop) {
                    verticalAnchorEdge = 'bottom';
                    verticalPosition = (windowHeight + windowScrollTop) - dateInputOffset.top;
                } else {
                    verticalPosition -= windowScrollTop;
                }
            } else {
                if (verticalPosition + this.$datetimePicker.offsetHeight > windowHeight + windowScrollTop) {
                    verticalPosition = dateInputOffset.top - this.$datetimePicker.offsetHeight + 1;
                }
            }

            if (verticalPosition < 0) {
                verticalPosition = 0;
            }

            if (left + dateInputElem.offsetWidth > windowWidth) {
                left = windowWidth - dateInputElem.offsetWidth;
            }
        }

        let datetimepickerElem = this.$datetimePicker;

        this.forEachAncestorOf(datetimepickerElem, (ancestorNode) => {
            var ancestorNodePosition;

            ancestorNodePosition = window.getComputedStyle(ancestorNode).getPropertyValue('position');

            if (ancestorNodePosition === 'relative' && windowWidth >= ancestorNode.offsetWidth) {
                left = left - ((windowWidth - ancestorNode.offsetWidth) / 2);
                return false;
            }
        });

        let datetimepickerCss = {
            position: position,
            left: options.insideParent ? dateInputElem.offsetLeft : left,
            top: '',  //Initialize to prevent previous values interfering with new ones.
            bottom: ''  //Initialize to prevent previous values interfering with new ones.
        };

        if (options.insideParent) {
            datetimepickerCss[verticalAnchorEdge] = dateInputElem.offsetTop + dateInputElem.offsetHeight + 'px';
        } else {
            datetimepickerCss[verticalAnchorEdge] = verticalPosition + 'px';
        }

        this.setCss(this.$datetimePicker, datetimepickerCss);
    }

    nextMonth() {
        const { currentViewDateTime } = this;

        let month = currentViewDateTime.getMonth() + 1;
        let year = currentViewDateTime.getFullYear();

        if (month === 12) {
            currentViewDateTime.setFullYear(currentViewDateTime.getFullYear() + 1);
            month = 0;
        }

        currentViewDateTime.setDate(
            Math.min(
                new Date(currentViewDateTime.getFullYear(), month + 1, 0).getDate(),
                currentViewDateTime.getDate()
            )
        );
        currentViewDateTime.setMonth(month);

        if (this.options.onChangeMonth && typeof this.options.onChangeMonth === 'function') {
            this.options.onChangeMonth.call(this, currentViewDateTime, this.$datetimePicker.dataset.input);
        }

        if (year !== currentViewDateTime.getFullYear() && typeof this.options.onChangeYear === 'function') {
            this.options.onChangeYear.call(this, currentViewDateTime, this.$datetimePicker.dataset.input);
        }

        this.triggerEvent(this.$datetimePicker, 'dt.change');
        return month;
    }

    prevMonth() {
        let month = this.currentViewDateTime.getMonth() - 1;
        let year = this.currentViewDateTime.getFullYear();

        if (month === -1) {
            this.currentViewDateTime.setFullYear(this.currentViewDateTime.getFullYear() - 1);
            month = 11;
        }

        this.currentViewDateTime.setDate(
            Math.min(
                new Date(this.currentViewDateTime.getFullYear(), month + 1, 0).getDate(),
                this.currentViewDateTime.getDate()
            )
        );

        this.currentViewDateTime.setMonth(month);

        if (this.options.onChangeMonth && typeof this.options.onChangeMonth === 'function') {
            this.options.onChangeMonth.call(this, this.currentViewDateTime, this.$datetimePicker.dataset.input);
        }

        if (year !== this.currentViewDateTime.getFullYear() && typeof this.options.onChangeYear === 'function') {
            this.options.onChangeYear.call(this, this.currentViewDateTime, this.$datetimePicker.dataset.input);
        }

        this.triggerEvent(this.$datetimePicker, 'dt.change');
        return month;
    }

    /*=============================================
    =            Datetime utils            =
    =============================================*/
    isValidDate(d) {
        return dayjs(d).isValid();
    }

    isValidTime(t) {
        if (!t) {
            return false;
        }

        let a = t.split(":");

        if (a.length != 2) {
           return false;
        }

        if (isNaN(a[0]) || isNaN(a[1])) {
            return false;
        }

        if (a[0] >= 24 || a[1] >= 60) {
            return false;
        }

        return true;
    }

    isValidInputDate(d, format = '') {
        let fm = format || this.options.format;
        return dayjs(d, fm).isValid();
    }

    isSameDate(d1, d2) {
        return d1.getTime() === d2.getTime();
    }

    parseDate(d) {
        let date = dayjs(d, [this.datetimeFormat, this.dateFormat]);
        return date.isValid() ? date.toDate() : null;
    }

    parseTime(d) {
        let date = dayjs(d, this.timeFormat);
        return date.isValid() ? date.toDate() : null;
    }

    parseInputDate(d) {
        let date = dayjs(d, this.options.format);
        return date.isValid() ? date.toDate() : null;
    }

    formatInputDate(d) {
        return dayjs(d).format(this.options.format);
    }

    formatDate(d) {
        return dayjs(d).format(this.dateFormat);
    }

    now() {
        return new Date();
    }

    countDaysInMonth(date) {
        return dayjs(date).daysInMonth();
    }

    /*=============================================
    =            Utils            =
    =============================================*/

    normalizeArray(value) {
        return value && Array.isArray(value) ? value : [];
    }

    isPlainObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    getEl(el, context = document) {
        return typeof el === 'string'
            ? context['querySelector'](el)
            : el;
    }

    getElAll(el, context = document) {
        return typeof el === 'string'
            ? context['querySelectorAll'](el)
            : el;
    }

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
        return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
    }

    triggerEvent(el, eventType, detail) {
        el.dispatchEvent(new CustomEvent(eventType, { detail }));
    }

    getOffset(element) {
        if (!element.getClientRects().length){
            return { top: 0, left: 0 };
        }

        let rect = element.getBoundingClientRect();
        let win = element.ownerDocument.defaultView;

        return {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset
        };
    }

    forEachAncestorOf(node, callback) {
        do {
            node = node.parentNode;

            if (!node || callback(node) === false) {
                break;
            }
        } while (node.nodeName !== 'HTML');
    };

    setCss(el, styles = {}) {
        for (let i in styles){
            el.style[i] = styles[i];
        }
    }

    onClickOutside(element, callback) {
        document.addEventListener('click', e => {
            if (!element.contains(e.target)) callback();
        });
    };
}

class GHighlightedDate
{
    constructor(date, desc, style) {
        this.date = date;
        this.desc = desc;
        this.style = style;
    }
}