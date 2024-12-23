/**
 * @see https://github.com/kartik-v/php-date-formatter
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2020
 * @version 1.3.6
*/
!function(t,e){"function"==typeof define&&define.amd?define([],e):"object"==typeof module&&module.exports?module.exports=e():t.DateFormatter=e()}("undefined"!=typeof self?self:this,function(){var t,e;return e={DAY:864e5,HOUR:3600,defaults:{dateSettings:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],meridiem:["AM","PM"],ordinal:function(t){var e=t%10,n={1:"st",2:"nd",3:"rd"};return 1!==Math.floor(t%100/10)&&n[e]?n[e]:"th"}},separators:/[ \-+\/.:@]/g,validParts:/[dDjlNSwzWFmMntLoYyaABgGhHisueTIOPZcrU]/g,intParts:/[djwNzmnyYhHgGis]/g,tzParts:/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,tzClip:/[^-+\dA-Z]/g},getInt:function(t,e){return parseInt(t,e?e:10)},compare:function(t,e){return"string"==typeof t&&"string"==typeof e&&t.toLowerCase()===e.toLowerCase()},lpad:function(t,n,r){var a=t.toString();return r=r||"0",a.length<n?e.lpad(r+a,n):a},merge:function(t){var n,r;for(t=t||{},n=1;n<arguments.length;n++)if(r=arguments[n])for(var a in r)r.hasOwnProperty(a)&&("object"==typeof r[a]?e.merge(t[a],r[a]):t[a]=r[a]);return t},getIndex:function(t,e){for(var n=0;n<e.length;n++)if(e[n].toLowerCase()===t.toLowerCase())return n;return-1}},t=function(t){var n=this,r=e.merge(e.defaults,t);n.dateSettings=r.dateSettings,n.separators=r.separators,n.validParts=r.validParts,n.intParts=r.intParts,n.tzParts=r.tzParts,n.tzClip=r.tzClip},t.prototype={constructor:t,getMonth:function(t){var n,r=this;return n=e.getIndex(t,r.dateSettings.monthsShort)+1,0===n&&(n=e.getIndex(t,r.dateSettings.months)+1),n},parseDate:function(t,n){var r,a,u,i,o,s,c,f,l,d,g=this,h=!1,m=!1,p=g.dateSettings,y={date:null,year:null,month:null,day:null,hour:0,min:0,sec:0};if(!t)return null;if(t instanceof Date)return t;if("U"===n)return u=e.getInt(t),u?new Date(1e3*u):t;switch(typeof t){case"number":return new Date(t);case"string":break;default:return null}if(r=n.match(g.validParts),!r||0===r.length)throw new Error("Invalid date format definition.");for(u=r.length-1;u>=0;u--)"S"===r[u]&&r.splice(u,1);for(a=t.replace(g.separators,"\x00").split("\x00"),u=0;u<a.length;u++)switch(i=a[u],o=e.getInt(i),r[u]){case"y":case"Y":if(!o)return null;l=i.length,y.year=2===l?e.getInt((70>o?"20":"19")+i):o,h=!0;break;case"m":case"n":case"M":case"F":if(isNaN(o)){if(s=g.getMonth(i),!(s>0))return null;y.month=s}else{if(!(o>=1&&12>=o))return null;y.month=o}h=!0;break;case"d":case"j":if(!(o>=1&&31>=o))return null;y.day=o,h=!0;break;case"g":case"h":if(c=r.indexOf("a")>-1?r.indexOf("a"):r.indexOf("A")>-1?r.indexOf("A"):-1,d=a[c],-1!==c)f=e.compare(d,p.meridiem[0])?0:e.compare(d,p.meridiem[1])?12:-1,o>=1&&12>=o&&-1!==f?y.hour=o%12===0?f:o+f:o>=0&&23>=o&&(y.hour=o);else{if(!(o>=0&&23>=o))return null;y.hour=o}m=!0;break;case"G":case"H":if(!(o>=0&&23>=o))return null;y.hour=o,m=!0;break;case"i":if(!(o>=0&&59>=o))return null;y.min=o,m=!0;break;case"s":if(!(o>=0&&59>=o))return null;y.sec=o,m=!0}if(h===!0){var D=y.year||0,v=y.month?y.month-1:0,S=y.day||1;y.date=new Date(D,v,S,y.hour,y.min,y.sec,0)}else{if(m!==!0)return null;y.date=new Date(0,0,0,y.hour,y.min,y.sec,0)}return y.date},guessDate:function(t,n){if("string"!=typeof t)return t;var r,a,u,i,o,s,c=this,f=t.replace(c.separators,"\x00").split("\x00"),l=/^[djmn]/g,d=n.match(c.validParts),g=new Date,h=0;if(!l.test(d[0]))return t;for(u=0;u<f.length;u++){if(h=2,o=f[u],s=e.getInt(o.substr(0,2)),isNaN(s))return null;switch(u){case 0:"m"===d[0]||"n"===d[0]?g.setMonth(s-1):g.setDate(s);break;case 1:"m"===d[0]||"n"===d[0]?g.setDate(s):g.setMonth(s-1);break;case 2:if(a=g.getFullYear(),r=o.length,h=4>r?r:4,a=e.getInt(4>r?a.toString().substr(0,4-r)+o:o.substr(0,4)),!a)return null;g.setFullYear(a);break;case 3:g.setHours(s);break;case 4:g.setMinutes(s);break;case 5:g.setSeconds(s)}i=o.substr(h),i.length>0&&f.splice(u+1,0,i)}return g},parseFormat:function(t,n){var r,a=this,u=a.dateSettings,i=/\\?(.?)/gi,o=function(t,e){return r[t]?r[t]():e};return r={d:function(){return e.lpad(r.j(),2)},D:function(){return u.daysShort[r.w()]},j:function(){return n.getDate()},l:function(){return u.days[r.w()]},N:function(){return r.w()||7},w:function(){return n.getDay()},z:function(){var t=new Date(r.Y(),r.n()-1,r.j()),n=new Date(r.Y(),0,1);return Math.round((t-n)/e.DAY)},W:function(){var t=new Date(r.Y(),r.n()-1,r.j()-r.N()+3),n=new Date(t.getFullYear(),0,4);return e.lpad(1+Math.round((t-n)/e.DAY/7),2)},F:function(){return u.months[n.getMonth()]},m:function(){return e.lpad(r.n(),2)},M:function(){return u.monthsShort[n.getMonth()]},n:function(){return n.getMonth()+1},t:function(){return new Date(r.Y(),r.n(),0).getDate()},L:function(){var t=r.Y();return t%4===0&&t%100!==0||t%400===0?1:0},o:function(){var t=r.n(),e=r.W(),n=r.Y();return n+(12===t&&9>e?1:1===t&&e>9?-1:0)},Y:function(){return n.getFullYear()},y:function(){return r.Y().toString().slice(-2)},a:function(){return r.A().toLowerCase()},A:function(){var t=r.G()<12?0:1;return u.meridiem[t]},B:function(){var t=n.getUTCHours()*e.HOUR,r=60*n.getUTCMinutes(),a=n.getUTCSeconds();return e.lpad(Math.floor((t+r+a+e.HOUR)/86.4)%1e3,3)},g:function(){return r.G()%12||12},G:function(){return n.getHours()},h:function(){return e.lpad(r.g(),2)},H:function(){return e.lpad(r.G(),2)},i:function(){return e.lpad(n.getMinutes(),2)},s:function(){return e.lpad(n.getSeconds(),2)},u:function(){return e.lpad(1e3*n.getMilliseconds(),6)},e:function(){var t=/\((.*)\)/.exec(String(n))[1];return t||"Coordinated Universal Time"},I:function(){var t=new Date(r.Y(),0),e=Date.UTC(r.Y(),0),n=new Date(r.Y(),6),a=Date.UTC(r.Y(),6);return t-e!==n-a?1:0},O:function(){var t=n.getTimezoneOffset(),r=Math.abs(t);return(t>0?"-":"+")+e.lpad(100*Math.floor(r/60)+r%60,4)},P:function(){var t=r.O();return t.substr(0,3)+":"+t.substr(3,2)},T:function(){var t=(String(n).match(a.tzParts)||[""]).pop().replace(a.tzClip,"");return t||"UTC"},Z:function(){return 60*-n.getTimezoneOffset()},c:function(){return"Y-m-d\\TH:i:sP".replace(i,o)},r:function(){return"D, d M Y H:i:s O".replace(i,o)},U:function(){return n.getTime()/1e3||0}},o(t,t)},formatDate:function(t,n){var r,a,u,i,o,s=this,c="",f="\\";if("string"==typeof t&&(t=s.parseDate(t,n),!t))return null;if(t instanceof Date){for(u=n.length,r=0;u>r;r++)o=n.charAt(r),"S"!==o&&o!==f&&(r>0&&n.charAt(r-1)===f?c+=o:(i=s.parseFormat(o,t),r!==u-1&&s.intParts.test(o)&&"S"===n.charAt(r+1)&&(a=e.getInt(i)||0,i+=s.dateSettings.ordinal(a)),c+=i));return c}return""}},t});

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
		i18n: {
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
		},

		ownerDocument: document,
		contentWindow: window,

		value: '',

		format:	'Y/m/d H:i',
		formatTime:	'H:i',
		formatDate:	'Y/m/d',

		startDate:	false, // new Date(), '1986/12/08', '-1970/01/05','-1970/01/05',
		step: 60,
		monthChangeSpinner: true,

		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		closeOnWithoutClick: true,
		closeOnInputClick: true,
		openOnFocus: true,

		timepicker: true,
		datepicker: true,
		weeks: false,

		defaultTime: false,	// use formatTime format (ex. '10:00' for formatTime:	'H:i')
		defaultDate: false,	// use formatDate format (ex new Date() or '1986/12/08' or '-1970/01/05' or '-1970/01/05')

		minDate: false,
		maxDate: false,
		minTime: false,
		maxTime: false,
		minDateTime: false,
		maxDateTime: false,

		allowTimes: [],
		opened: false,
		initTime: true,
		inline: false,
		theme: '',
		touchMovedThreshold: 5,

		onSelectDate: function () {},
		onSelectTime: function () {},
		onChangeMonth: function () {},
		onGetWeekOfYear: function () {},
		onChangeYear: function () {},
		onChangeDateTime: function () {},
		onShow: function () {},
		onClose: function () {},
		onGenerate: function () {},

		hours12: false,
		next: 'xdsoft_next',
		prev : 'xdsoft_prev',
		dayOfWeekStart: 0,
		parentSelector: 'body',
		timeHeightInTimePicker: 25,
		timepickerScrollbar: true,
		todayButton: true,
		prevButton: true,
		nextButton: true,
		defaultSelect: true,

		scrollMonth: true,
		scrollTime: true,
		scrollInput: true,

		lazyInit: false,
		mask: false,
		validateOnBlur: true,
		allowBlank: true,
		yearStart: 1950,
		yearEnd: 2050,
		monthStart: 0,
		monthEnd: 11,
		style: '',
		id: '',
		fixed: false,
		roundTime: 'round', // ceil, floor
		className: '',
		highlightedDates: [],
		highlightedPeriods: [],
		allowDates : [],
		allowDateRe : null,
		disabledDates : [],
		disabledWeekDays: [],
		beforeShowDay: null,

		enterLikeTab: true,
        insideParent: false,
	};

    dateHelper = null;
    defaultDateHelper = null;
    globalLocaleDefault = 'vi';
    globalLocale = 'vi';

    options = {};
    currentTime = null;
    triggerAfterOpen = false;
    dtChangeTimer = 0;
    dtInputTimer = 0;
    setPosFunc = null;
    ctrlDown = false;
    cmdDown = false;

    constructor(el, opts)
    {
        this.$input = this.getEl(el);
        if (!this.$input) return;

        this.options = (this.isPlainObject(opts) || !opts) ? { ...this.defaultOptions, ...opts } : { ...this.defaultOptions };

        this.$datetimePicker = this.createElement('div', 'xdsoft_datetimepicker xdsoft_noselect');
        this.$datePicker = this.createElement('div', 'xdsoft_datepicker active');
        this.$monthPicker = this.createElement('div', 'xdsoft_monthpicker', '<button type="button" class="xdsoft_prev"></button><button type="button" class="xdsoft_today_button"></button><div class="xdsoft_label xdsoft_month"><span></span><i></i></div><div class="xdsoft_label xdsoft_year"><span></span><i></i></div><button type="button" class="xdsoft_next"></button>');
        this.$calendar = this.createElement('div', 'xdsoft_calendar');
        this.$timePicker = this.createElement('div', 'xdsoft_timepicker active', '<button type="button" class="xdsoft_prev"></button><div class="xdsoft_time_box"><div class="xdsoft_time_variant"></div></div><button type="button" class="xdsoft_next"></button>');
        this.$timeboxParent = this.$timePicker.querySelector('.xdsoft_time_box');
        this.$timebox = this.$timePicker.querySelector('.xdsoft_time_variant');

        this.$monthSelect = this.createElement('div', 'xdsoft_select xdsoft_monthselect', '<div></div>');
        this.$yearSelect = this.createElement('div', 'xdsoft_select xdsoft_yearselect', '<div></div>');

        this.currentTime = this.now();
        this.setPosFunc = () => { this.setPos(); };
        this.init();
    }

    init() {
        this.initDateFormatter();
        this.createDateTimePicker();
    }

    createDateTimePicker()
    {
        const options = this.options;

        if (options.id) {
            this.$datetimePicker.setAttribute('id', options.id);
        }

        if (options.style) {
            this.$datetimePicker.setAttribute('style', options.style);
        }

        if (options.weeks) {
            this.$datetimePicker.classList.add('xdsoft_showweeks');
        }

        if (options.className.length) {
            this.$datetimePicker.classList.add(...options.className.split(' '));
        }

        this.$monthPicker.querySelector('.xdsoft_month span').after(this.$monthSelect);
        this.$monthPicker.querySelector('.xdsoft_year span').after(this.$yearSelect);

        this.$datePicker.append(this.$monthPicker);
        this.$datePicker.append(this.$calendar);

        this.$datetimePicker.append(this.$datePicker);
        this.$datetimePicker.append(this.$timePicker);

        if (options.insideParent) {
            this.$input.parentElement.append(this.$datetimePicker);
        } else {
            document.querySelector(options.parentSelector).append(this.$datetimePicker);
        }

        this.setCurrentTime(this.getCurrentValue())
        this.bindDatepickerEvents();
        this.bindInputEvents();
        this.bindMonthEvents();
        this.bindTimeEvents();
        this.bindCalendarEvents();
        this.setOptions(options);
    }

    buildHtml() {
        if (
            this.currentTime === undefined
            || this.currentTime === null
            || isNaN(this.currentTime.getTime())
        ) {
            this.currentTime = this.now();
        }

        const { currentTime, options, dateHelper, globalLocale } = this;

        let table = '<table><thead><tr>';

        if (options.weeks) {
            table += '<th></th>';
        }

        for (let j = 0; j < 7; j += 1) {
            table += '<th>' + options.i18n[globalLocale].dayOfWeekShort[(j + options.dayOfWeekStart) % 7] + '</th>';
        }

        table += '</tr></thead>';
        table += '<tbody>';

        let maxDate = false;
        let minDate = false;
        let minDateTime = false;
        let maxDateTime = false;

        if (options.maxDate !== false) {
            maxDate = this.strToDate(options.maxDate);
            maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999);
        }

        if (options.minDate !== false) {
            minDate = this.strToDate(options.minDate);
            minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
        }

        if (options.minDateTime !== false) {
            minDateTime = this.strToDate(options.minDateTime);
            minDateTime = new Date(minDateTime.getFullYear(), minDateTime.getMonth(), minDateTime.getDate(), minDateTime.getHours(), minDateTime.getMinutes(), minDateTime.getSeconds());
        }

        if (options.maxDateTime !== false) {
            maxDateTime = this.strToDate(options.maxDateTime);
            maxDateTime = new Date(maxDateTime.getFullYear(), maxDateTime.getMonth(), maxDateTime.getDate(), maxDateTime.getHours(), maxDateTime.getMinutes(), maxDateTime.getSeconds());
        }

        let maxDateTimeDay;
        if (maxDateTime !== false) {
            maxDateTimeDay = ((maxDateTime.getFullYear() * 12) + maxDateTime.getMonth()) * 31 + maxDateTime.getDate();
        }

        let i = 0;
        let today = this.now();
        let hDate;
        let customDateSettings;
        let newRow = true;

        let start = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1, 12, 0, 0);
        while (start.getDay() !== options.dayOfWeekStart) {
            start.setDate(start.getDate() - 1);
        }

        while (i < this.countDaysInMonth(currentTime) || start.getDay() !== options.dayOfWeekStart || currentTime.getMonth() === start.getMonth()) {
            i += 1;

            let classes = [];
            let day = start.getDay();
            let d = start.getDate();
            let y = start.getFullYear();
            let m = start.getMonth();
            let w = this.getWeekOfYear(start);
            let description = '';

            classes.push('xdsoft_date');

            if (options.beforeShowDay && typeof options.beforeShowDay.call === 'function') {
                customDateSettings = options.beforeShowDay.call(this, start);
            } else {
                customDateSettings = null;
            }

            if(options.allowDateRe && Object.prototype.toString.call(options.allowDateRe) === "[object RegExp]"){
                if(!options.allowDateRe.test(this.formatDate(start))){
                    classes.push('xdsoft_disabled');
                }
            }

            if(options.allowDates && options.allowDates.length > 0){
                if(options.allowDates.indexOf(this.formatDate(start)) === -1){
                    classes.push('xdsoft_disabled');
                }
            }

            let currentDay = ((start.getFullYear() * 12) + start.getMonth()) * 31 + start.getDate();
            if (
                (maxDate !== false && start > maxDate)
                || (minDateTime !== false && start < minDateTime)
                || (minDate !== false && start < minDate)
                || (maxDateTime !== false && currentDay > maxDateTimeDay)
                || (customDateSettings && customDateSettings[0] === false)
            ) {
                classes.push('xdsoft_disabled');
            }

            if (options.disabledDates.indexOf(this.formatDate(start)) !== -1) {
                classes.push('xdsoft_disabled');
            }

            if (options.disabledWeekDays.indexOf(day) !== -1) {
                classes.push('xdsoft_disabled');
            }

            if (this.$input.matches('[disabled]')) {
                classes.push('xdsoft_disabled');
            }

            if (customDateSettings && customDateSettings[1] !== "") {
                classes.push(customDateSettings[1]);
            }

            if (currentTime.getMonth() !== m) {
                classes.push('xdsoft_other_month');
            }

            if (
                (options.defaultSelect || this.$datetimePicker.dataset.changed)
                && this.formatDate(currentTime) === this.formatDate(start)
            ) {
                classes.push('xdsoft_current');
            }

            if (this.formatDate(today) === this.formatDate(start)) {
                classes.push('xdsoft_today');
            }

            if (start.getDay() === 0 || start.getDay() === 6) {
                classes.push('xdsoft_weekend');
            }

            if (options.highlightedDates[this.formatDate(start)] !== undefined) {
                hDate = options.highlightedDates[this.formatDate(start)];
                classes.push(hDate.style === undefined ? 'xdsoft_highlighted_default' : hDate.style);
                description = hDate.desc === undefined ? '' : hDate.desc;
            }

            if (newRow) {
                table += '<tr>';
                newRow = false;
                if (options.weeks) {
                    table += '<th>' + w + '</th>';
                }
            }

            table += '<td data-date="' + d + '" data-month="' + m + '" data-year="' + y + '"' + ' class="xdsoft_date xdsoft_day_of_week' + start.getDay() + ' ' + classes.join(' ') + '" title="' + description + '">' +
                '<div>' + d + '</div>' +
                '</td>';

            if (start.getDay() === options.dayOfWeekStartPrev) {
                table += '</tr>';
                newRow = true;
            }

            start.setDate(d + 1);
        }
        table += '</tbody></table>';

        this.$calendar.innerHTML = table;

        /** Month & Year label */
        this.$monthPicker.querySelector('.xdsoft_month span').innerHTML = options.i18n[globalLocale].months[currentTime.getMonth()];
        this.$monthPicker.querySelector('.xdsoft_year span').innerHTML = currentTime.getFullYear();

        // generate timebox

        let minTimeMinutesOfDay = 0;
        if (options.minTime !== false) {
            let t = this.strtotime(options.minTime);
            minTimeMinutesOfDay = 60 * t.getHours() + t.getMinutes();
        }

        let maxTimeMinutesOfDay = 24 * 60;
        if (options.maxTime !== false) {
            let t = this.strtotime(options.maxTime);
            maxTimeMinutesOfDay = 60 * t.getHours() + t.getMinutes();
        }

        if (options.minDateTime !== false) {
            let t = this.strToDateTime(options.minDateTime);
            let currentDayIsMinDateTimeDay = this.formatDate(currentTime) === this.formatDate(t);
            if (currentDayIsMinDateTimeDay) {
                let m = 60 * t.getHours() + t.getMinutes();
                if (m > minTimeMinutesOfDay) {
                    minTimeMinutesOfDay = m
                };
            }
        }

        if (options.maxDateTime !== false) {
            let t = this.strToDateTime(options.maxDateTime);
            let currentDayIsMaxDateTimeDay = this.formatDate(currentTime) === this.formatDate(t);
            if (currentDayIsMaxDateTimeDay) {
                let m = 60 * t.getHours() + t.getMinutes();
                if (m < maxTimeMinutesOfDay) {
                    maxTimeMinutesOfDay = m;
                }
            }
        }

        const line_time = (h, m) => {
            let now = this.now();
            now.setHours(h);
            now.setMinutes(m);

            h = parseInt(now.getHours(), 10);
            m = parseInt(now.getMinutes(), 10);

            let classes = [];
            let currentMinutesOfDay = 60 * h + m;
            if (
                this.$input.matches('[disabled]')
                || currentMinutesOfDay >= maxTimeMinutesOfDay
                || currentMinutesOfDay < minTimeMinutesOfDay
            ) {
                classes.push('xdsoft_disabled');
            }

            let current_time = new Date(currentTime);
            current_time.setHours(parseInt(currentTime.getHours(), 10));

            let isALlowTimesInit = options.allowTimes && Array.isArray(options.allowTimes) && options.allowTimes.length;
            if (!isALlowTimesInit) {
                current_time.setMinutes(Math[options.roundTime](currentTime.getMinutes() / options.step) * options.step);
            }

            if (
                (options.initTime || options.defaultSelect || this.$datetimePicker.dataset.changed)
                && current_time.getHours() === parseInt(h, 10)
                && ((!isALlowTimesInit && options.step > 59) || current_time.getMinutes() === parseInt(m, 10))
            ) {
                if (options.defaultSelect || this.$datetimePicker.dataset.changed) {
                    classes.push('xdsoft_current');
                } else if (options.initTime) {
                    classes.push('xdsoft_init_time');
                }
            }

            if (parseInt(today.getHours(), 10) === parseInt(h, 10) && parseInt(today.getMinutes(), 10) === parseInt(m, 10)) {
                classes.push('xdsoft_today');
            }

            return '<div class="xdsoft_time ' + classes.join(' ') + '" data-hour="' + h + '" data-minute="' + m + '">' + this.formatTime(now) + '</div>';
        };

        let time = '';
        if (!options.allowTimes || !Array.isArray(options.allowTimes) || !options.allowTimes.length) {
            for (let i = 0; i < (options.hours12 ? 12 : 24); i += 1) {
                for (let j = 0; j < 60; j += options.step) {
                    let currentMinutesOfDay = i * 60 + j;
                    if (currentMinutesOfDay < minTimeMinutesOfDay) continue;
                    if (currentMinutesOfDay >= maxTimeMinutesOfDay) continue;
                    let h = (i < 10 ? '0' : '') + i;
                    let m = (j < 10 ? '0' : '') + j;
                    time += line_time(h, m);
                }
            }
        } else {
            for (let i = 0; i < options.allowTimes.length; i += 1) {
                let h = this.strtotime(options.allowTimes[i]).getHours();
                let m = this.strtotime(options.allowTimes[i]).getMinutes();
                time += line_time(h, m);
            }
        }

        this.$timebox.innerHTML = time;

        let opt = '';

        for (let i = parseInt(options.yearStart, 10); i <= parseInt(options.yearEnd, 10); i += 1) {
            opt += '<div class="xdsoft_option ' + (currentTime.getFullYear() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + i + '</div>';
        }
        this.$yearSelect.firstChild.innerHTML = opt;

        opt = '';
        for (let i = parseInt(options.monthStart, 10); i <= parseInt(options.monthEnd, 10); i += 1) {
            opt += '<div class="xdsoft_option ' + (currentTime.getMonth() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + options.i18n[globalLocale].months[i] + '</div>';
        }
        this.$monthSelect.firstChild.innerHTML = opt;

        this.triggerEvent(this.$datetimePicker, 'dt.generate');
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
            if (this.triggerAfterOpen) {
                this.triggerEvent(this.$datetimePicker, 'dt.afterOpen');
                this.triggerAfterOpen = false;
            }
        });

        this.$datetimePicker.addEventListener('dt.open', (e) => {
            let onShow = true;
            if (this.options.onShow && typeof this.options.onShow === 'function') {
                onShow = this.options.onShow.call(this, this.currentTime, this.$input, e);
            }
            if (onShow !== false) {
                this.showEl(this.$datetimePicker);
                this.setPos();
                window.removeEventListener('resize', this.setPosFunc);
                window.addEventListener('resize', this.setPosFunc);
            }
        });

        this.$datetimePicker.addEventListener('dt.close', (e) => {
            let onClose = true;
            this.$monthPicker.querySelectorAll('.xdsoft_select').forEach((elem) => {
                this.hideEl(elem);
            });

            if (this.options.onClose && typeof this.options.onClose === 'function') {
                onClose = this.options.onClose.call(this, this.currentTime, this.$input, e);
            }

            if (onClose !== false && !this.options.opened && !this.options.inline) {
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
            if (this.$timebox.querySelector('.xdsoft_current')) {
                classType = '.xdsoft_current';
            } else if (this.$timebox.querySelector('.xdsoft_init_time')) {
                classType = '.xdsoft_init_time';
            }
            if (classType) {
                /** scroll timebox tới time đang được chọn */
                let top = this.$timebox.querySelector(classType);
                this.$timebox.scrollTop = top.offsetTop;
            }
        });

        this.$datetimePicker.addEventListener('dt.changedatetime', (e) => {
            if (this.options.onChangeDateTime && typeof this.options.onChangeDateTime === 'function') {
                this.options.onChangeDateTime.call(this, this.currentTime, this.$input, e);
                delete this.options.value;
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

    inputMaskKeyDownHandler = (event) => {
        let elem = event.target;
        let val = elem.value;
        let key = event.which;
        let pos = elem.selectionStart;
        let selEnd = elem.selectionEnd;
        let hasSel = pos !== selEnd;
        let digit;
        const { options, $input, ctrlDown } = this;

        // only alow these characters
        if (
            ((key >= GKeycode.KEY0 && key <= GKeycode.KEY9) || (key >= GKeycode._KEY0 && key <= GKeycode._KEY9))
            || (key === GKeycode.BACKSPACE || key === GKeycode.DEL)
        ) {
            // get char to insert which is new character or placeholder ('_')
            digit = (key === GKeycode.BACKSPACE || key === GKeycode.DEL)
            ? '_'
            : String.fromCharCode((GKeycode._KEY0 <= key && key <= GKeycode._KEY9) ? key - GKeycode.KEY0 : key);

            // we're deleting something, we're not at the start, and have normal cursor, move back one
            // if we have a selection length, cursor actually sits behind deletable char, not in front
            if (key === GKeycode.BACKSPACE && pos && !hasSel) {
                pos -= 1;
            }

            // don't stop on a separator, continue whatever direction you were going
            //   value char - keep incrementing position while on separator char and we still have room
            //   del char   - keep decrementing position while on separator char and we still have room
            while (true) {
                let maskValueAtCurPos = options.mask.substr(pos, 1);
                let posShorterThanMaskLength = pos < options.mask.length;
                let posGreaterThanZero = pos > 0;
                let notNumberOrPlaceholder = /[^0-9_]/;
                let curPosOnSep = notNumberOrPlaceholder.test(maskValueAtCurPos);
                let continueMovingPosition = curPosOnSep && posShorterThanMaskLength && posGreaterThanZero

                // if we hit a real char, stay where we are
                if (!continueMovingPosition) break;

                // hitting backspace in a selection, you can possibly go back any further - go forward
                pos += (key === GKeycode.BACKSPACE && !hasSel) ? -1 : 1;
            }

            if (event.metaKey) { // cmd has been pressed
                pos = 0;
                hasSel = true;
            }

            if (hasSel) {
                // pos might have moved so re-calc length
                let selLength = selEnd - pos

                // if we have a selection length we will wipe out entire selection and replace with default template for that range
                let defaultBlank = options.mask.replace(/[0-9]/g, '_');
                let defaultBlankSelectionReplacement = defaultBlank.substr(pos, selLength);
                let selReplacementRemainder = defaultBlankSelectionReplacement.substr(1) // might be empty

                let valueBeforeSel = val.substr(0, pos);
                let insertChars = digit + selReplacementRemainder;
                let charsAfterSelection = val.substr(pos + selLength);

                val = valueBeforeSel + insertChars + charsAfterSelection;
            } else {
                let valueBeforeCursor = val.substr(0, pos);
                let insertChar = digit;
                let valueAfterNextChar = val.substr(pos + 1);

                val = valueBeforeCursor + insertChar + valueAfterNextChar;
            }

            if (val.trim() === '') {
                // if empty, set to default
                val = defaultBlank;
            } else {
                // if at the last character don't need to do anything
                if (pos === options.mask.length) {
                    event.preventDefault();
                    return false;
                }
            }

            // resume cursor location
            pos += (key === GKeycode.BACKSPACE) ? 0 : 1;
            // don't stop on a separator, continue whatever direction you were going
            while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
                pos += (key === GKeycode.BACKSPACE) ? 0 : 1;
            }

            if (this.isValidValue(options.mask, val)) {
                elem.value = val;
                this.setCaretPos(elem, pos);
            } else if (val.trim() === '') {
                elem.value = options.mask.replace(/[0-9]/g, '_');
            } else {
                this.triggerEvent($input, 'dt.error_input');
            }
        } else {
            if (
                [GKeycode.AKEY, GKeycode.CKEY, GKeycode.VKEY, GKeycode.ZKEY, GKeycode.YKEY].indexOf(key) !== -1 && ctrlDown
                || [GKeycode.ESC, GKeycode.ARROWUP, GKeycode.ARROWDOWN, GKeycode.ARROWLEFT, GKeycode.ARROWRIGHT, GKeycode.F5, GKeycode.CTRLKEY, GKeycode.TAB, GKeycode.ENTER].indexOf(key) !== -1
            ) {
                return true;
            }
        }

        event.preventDefault();
        return false;
    }

    bindInputEvents() {
        this.dtInputTimer = 0;

        ['dt.open', 'focusin'].forEach((eventName) => {
            this.$input.addEventListener(eventName, (e) => {
                if (
                    this.$input.matches(':disabled')
                    || (this.isVisible(this.$datetimePicker) && this.options.closeOnInputClick)
                ) {
                    return;
                }

                if (!this.options.openOnFocus) {
                    return;
                }

                clearTimeout(this.dtInputTimer);
                this.dtInputTimer = setTimeout(() => {
                    if (this.$input.matches(':disabled')) {
                        return;
                    }

                    this.triggerAfterOpen = true;
                    this.setCurrentTime(this.getCurrentValue(), true);

                    if(this.options.mask) {
                        this.setMask(this.options);
                    }

                    this.triggerEvent(this.$datetimePicker, 'dt.open');
                }, 100);
            });
        });

        this.$input.addEventListener('keydown', this.inputKeyDownHandler);
    }

    bindMonthEvents() {
        /*---------- click label tháng, năm ---------- */
        this.$monthPicker.querySelectorAll('.xdsoft_month span, .xdsoft_year span').forEach((elem) => {
            elem.addEventListener('click', (e) => {
                e.stopPropagation();

                const $select = elem.nextSibling;
                this.$monthPicker.querySelectorAll('.xdsoft_select').forEach((s) => {
                    this.hideEl(s);
                });

                this.showEl($select);
                $select.firstChild.scrollTop = $select.querySelector('.xdsoft_current').offsetTop;
            });
        });

        /*---------- Click option trong list tháng, năm ---------- */
        this.$monthPicker.addEventListener('click', (e) => {
            if (!e.target.matches('.xdsoft_option')) return;

            const { currentTime, options } = this;
            const elem = e.target;
            const selectElem = elem.closest('.xdsoft_select');

            if (currentTime === undefined || currentTime === null) {
                currentTime = this.now();
            }

            let year = currentTime.getFullYear();
            if (currentTime) {
                currentTime[selectElem.classList.contains('xdsoft_monthselect') ? 'setMonth' : 'setFullYear'](elem.dataset.value);
            }

            this.hideEl(selectElem);

            this.triggerEvent(this.$datetimePicker, 'dt.change');

            if (options.onChangeMonth && typeof options.onChangeMonth === 'function') {
                options.onChangeMonth.call(this, currentTime, this.$input);
            }

            if (year !== currentTime.getFullYear() && typeof options.onChangeYear === 'function') {
                options.onChangeYear.call(this, currentTime, this.$input);
            }
        });

        /*---------- click today button ---------- */
		this.$monthPicker.addEventListener('click', (e) => {
            if (!e.target.matches('.xdsoft_today_button')) return;

            this.$datetimePicker.dataset.changed = true;
            this.setCurrentTime(0, true);
            this.triggerEvent(this.$datetimePicker, 'dt.afterOpen');
        });

        /*---------- click nút mũi tên ở lựa chọn tháng ---------- */
        this.$monthPicker.addEventListener('click', (e) => {
            if (!e.target.matches('.xdsoft_prev, .xdsoft_next')) return;

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
            if (!e.target.matches('.xdsoft_prev, .xdsoft_next')) return;

            const elem = e.target;
            const timebox = this.$timebox;

            let currentScrollTop = timebox.scrollTop;
            let timeHeight = this.options.timeHeightInTimePicker;
            if (elem.classList.contains(this.options.next)) {
                timebox.scrollTop = currentScrollTop + timeHeight;
            } else if (elem.classList.contains(this.options.prev)) {
                timebox.scrollTop = currentScrollTop - timeHeight;
            }
        });

        /*---------- click chọn giờ ---------- */
		this.$timePicker.addEventListener('click', (e) => {
            if (!e.target.matches('.xdsoft_time')) return;

            e.stopPropagation();

            let elem = e.target;
            const { currentTime, options } = this;

            if (currentTime === undefined || currentTime === null) {
                currentTime = this.now();
            }

            if (elem.classList.contains('xdsoft_disabled')) {
                return false;
            }

            currentTime.setHours(elem.dataset.hour);
            currentTime.setMinutes(elem.dataset.minute);

            this.triggerEvent(this.$datetimePicker, 'dt.select', [currentTime]);
            this.$input.value = this.str();

            if (options.onSelectTime && typeof options.onSelectTime === 'function') {
                options.onSelectTime.call(this, currentTime, this.$input, e);
            }

            this.$datetimePicker.dataset.changed = true;
            this.triggerEvent(this.$datetimePicker, 'dt.change');
            this.triggerEvent(this.$datetimePicker, 'dt.changedatetime', [currentTime]);

            if (options.inline !== true && options.closeOnTimeSelect === true) {
                this.triggerEvent(this.$datetimePicker, 'dt.close');
            }
        });
    }

    bindCalendarEvents() {
        /*---------- click chọn ngày ---------- */
		let calendarclick = 0;
        this.$calendar.addEventListener('click', (e) => {
            const elem = e.target.closest('td');
            if (!elem.matches('td')) return;

            e.stopPropagation();

            calendarclick += 1;

            let { currentTime, options } = this;

            if (currentTime === undefined || currentTime === null) {
                currentTime = this.now();
            }

            if (elem.classList.contains('xdsoft_disabled')) {
                return false;
            }

            currentTime.setDate(1);
            currentTime.setFullYear(elem.dataset.year);
            currentTime.setMonth(elem.dataset.month);
            currentTime.setDate(elem.dataset.date);

            this.triggerEvent(this.$datetimePicker, 'dt.select', [currentTime]);

            this.$input.value = this.str();

            if (options.onSelectDate &&	typeof options.onSelectDate === 'function') {
                options.onSelectDate.call(this, currentTime, this.$input, e);
            }

            this.$datetimePicker.dataset.changed = true;
            this.triggerEvent(this.$datetimePicker, 'dt.change');
            this.triggerEvent(this.$datetimePicker, 'dt.changedatetime');

            if (
                (
                    calendarclick > 1
                    || (options.closeOnDateSelect === true  || (options.closeOnDateSelect === false && !options.timepicker))
                )
                && !options.inline
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

    initDateFormatter() {
		const locale = this.defaultOptions.i18n[this.globalLocale];

		if (typeof DateFormatter === 'function') {
			this.dateHelper = this.defaultDateHelper = new DateFormatter({
				dateSettings: {
                    days: locale.dayOfWeek,
                    daysShort: locale.dayOfWeekShort,
                    months: locale.months,
                    monthsShort: locale.monthsShort
                },
			});
		}
	}

    getValue() {
        return this.getCurrentTime();
    }

    setOptions(opts) {
        const {
            allowTimes,
            allowDates,
            allowDateRe,
            highlightedDates,
            highlightedPeriods,
            disabledDates,
            disabledWeekDays,
            ...newOpts
        } = opts;

        this.options = { ...this.options, ...newOpts };
        const options = this.options;

        if (allowTimes && Array.isArray(allowTimes) && allowTimes.length) {
            options.allowTimes = allowTimes;
        }

        if (allowDates && Array.isArray(allowDates) && allowDates.length) {
            options.allowDates = allowDates;
        }

        if (allowDateRe && Object.prototype.toString.call(allowDateRe) === "[object String]") {
            options.allowDateRe = new RegExp(allowDateRe);
        }

        if (disabledDates && Array.isArray(disabledDates) && disabledDates.length) {
            options.disabledDates = disabledDates;
        }

        if (disabledWeekDays && Array.isArray(disabledWeekDays) && disabledWeekDays.length) {
            options.disabledWeekDays = disabledWeekDays;
        }

        options.highlightedDates = this._parseHighlightedDates(highlightedDates, highlightedPeriods);

        if (isNaN(options.dayOfWeekStart)) {
            options.dayOfWeekStart = 0;
        } else {
            options.dayOfWeekStart = parseInt(options.dayOfWeekStart, 10) % 7;
        }

        if (options.minDate && /^[\+\-](.*)$/.test(options.minDate)) {
            options.minDate = this.dateHelper.formatDate(this.strToDateTime(options.minDate), options.formatDate);
        }

        if (options.maxDate &&  /^[\+\-](.*)$/.test(options.maxDate)) {
            options.maxDate = this.dateHelper.formatDate(this.strToDateTime(options.maxDate), options.formatDate);
        }

        if (options.minDateTime &&  /^\+(.*)$/.test(options.minDateTime)) {
            options.minDateTime = this.strToDateTime(options.minDateTime).dateFormat(options.formatDate);
        }

        if (options.maxDateTime &&  /^\+(.*)$/.test(options.maxDateTime)) {
            options.maxDateTime = this.strToDateTime(options.maxDateTime).dateFormat(options.formatDate);
        }

        if ((options.open || options.opened) && (!options.inline)) {
            this.triggerEvent(this.$input, 'dt.open');
        }

        if (options.inline) {
            this.triggerAfterOpen = true;
            this.$datetimePicker.classList.add('xdsoft_inline');
            this.$input.after(this.$datetimePicker);
            this.hideEl(this.$input);
        }

        if (options.datepicker) {
            this.$datePicker.classList.add('active');
        } else {
            this.$datePicker.classList.remove('active');
        }

        if (options.timepicker) {
            this.$timePicker.classList.add('active');
        } else {
            this.$timePicker.classList.remove('active');
        }

        if (options.value) {
            this.setCurrentTime(options.value);
            if (this.$input && this.$input.value) {
                this.$input.value = this.str();
            }
        }

        this.$monthPicker.querySelector('.xdsoft_today_button').style.visibility = !options.todayButton ? 'hidden' : 'visible';
        this.$monthPicker.querySelector('.' + options.prev).style.visibility = !options.prevButton ? 'hidden' : 'visible';
        this.$monthPicker.querySelector('.' + options.next).style.visibility = !options.nextButton ? 'hidden' : 'visible';

        this.setMask(options);

        // if (options.validateOnBlur) {
        // TODO validate khi chọn ngày
        // }

        options.dayOfWeekStartPrev = (options.dayOfWeekStart === 0) ? 6 : options.dayOfWeekStart - 1;

        this.triggerEvent(this.$datetimePicker, 'dt.change');
        // this.triggerEvent(this.$datetimePicker, 'dt.afterOpen');

        // this.$datetimePicker.dataset.options = options;
    };

    setLocale(locale) {
        var newLocale = this.defaultOptions.i18n[locale] ? locale : this.globalLocaleDefault;
        if (this.globalLocale !== newLocale) {
            this.globalLocale = newLocale;
            // reinit date formatter
            this.initDateFormatter();
        }
    }

    getCurrentValue() {
        let ct = null;

        const { options } = this;

        if (options.startDate) {
            ct = this.strToDate(options.startDate);
        } else {
            let inputValue = this.$input?.value ?? '';

            if (options.value || inputValue) {
                ct = this.strToDateTime(ct);
            } else if (options.defaultDate) {
                ct = this.strToDateTime(options.defaultDate);
                if (options.defaultTime) {
                    let time = this.strtotime(options.defaultTime);
                    ct.setHours(time.getHours());
                    ct.setMinutes(time.getMinutes());
                }
            }
        }

        if (ct && this.isValidDate(ct)) {
            this.$datetimePicker.dataset.changed = true;
        } else {
            ct = 0;
        }

        return ct || 0;
    }

    setPos() {
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

        if ((options.ownerDocument.documentElement.clientWidth - dateInputOffset.left) < this.$datetimePicker.offsetWidth) {
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

                if (options.contentWindow.getComputedStyle(ancestorNode).getPropertyValue('position') === 'fixed') {
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

            ancestorNodePosition = options.contentWindow.getComputedStyle(ancestorNode).getPropertyValue('position');

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

    setMask(options)
    {
        const { $input, dateHelper, ctrlDown, cmdDown } = this;

        if (options.mask) {
            $input.removeEventListener('keydown', this.inputKeyDownHandler);
            $input.removeEventListener('keydown', this.inputMaskKeyDownHandler);
        }

        if (options.mask === true) {
            if (dateHelper.formatMask) {
                options.mask = dateHelper.formatMask(options.format)
            } else {
                options.mask = options.format
                    .replace(/Y/g, '9999')
                    .replace(/F/g, '9999')
                    .replace(/m/g, '19')
                    .replace(/d/g, '39')
                    .replace(/H/g, '29')
                    .replace(/i/g, '59')
                    .replace(/s/g, '59');
            }
        }

        if (typeof options.mask === 'string') {
            if (!this.isValidValue(options.mask, $input.value)) {
                $input.value = options.mask.replace(/[0-9]/g, '_');
                this.setCaretPos($input, 0);
            }

            $input.addEventListener('paste', (event) => {
                // couple options here
                // 1. return false - tell them they can't paste
                // 2. insert over current characters - minimal validation
                // 3. full fledged parsing and validation
                // let's go option 2 for now

                // fires multiple times for some reason

                // https://stackoverflow.com/a/30496488/1366033
                let clipboardData = event.clipboardData || event.originalEvent.clipboardData || window.clipboardData;
                let pastedData = clipboardData.getData('text');
                let elem = event.target;
                let val = elem.value;
                let pos = elem.selectionStart;

                let valueBeforeCursor = val.substr(0, pos);
                let valueAfterPaste = val.substr(pos + pastedData.length);

                val = valueBeforeCursor + pastedData + valueAfterPaste;
                pos += pastedData.length;

                if (this.isValidValue(options.mask, val)) {
                    elem.value = val;
                    this.setCaretPos(elem, pos);
                } else if (val.trim() === '') {
                    elem.value = options.mask.replace(/[0-9]/g, '_');
                } else {
                    this.triggerEvent($input, 'dt.error_input');
                }

                event.preventDefault();
                return false;
            });

            $input.addEventListener('keydown', this.inputMaskKeyDownHandler);
        }
    }

    isValidValue(mask, value) {
        let reg = mask
            .replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g, '\\$1')
            .replace(/_/g, '{digit+}')
            .replace(/([0-9]{1})/g, '{digit$1}')
            .replace(/\{digit([0-9]{1})\}/g, '[0-$1_]{1}')
            .replace(/\{digit[\+]\}/g, '[0-9_]{1}');

        return (new RegExp(reg)).test(value);
    }

    getCaretPos(input) {
        const { options } = this;
        try {
            if (options.ownerDocument.selection && options.ownerDocument.selection.createRange) {
                var range = options.ownerDocument.selection.createRange();
                return range.getBookmark().charCodeAt(2) - 2;
            }

            if (input.setSelectionRange) {
                return input.selectionStart;
            }
        } catch (e) {
            return 0;
        }
    }

    setCaretPos(node, pos) {
        const { options } = this;
        node = (typeof node === "string" || node instanceof String) ? options.ownerDocument.getElementById(node) : node;

        if (!node) {
            return false;
        }

        if (node.createTextRange) {
            var textRange = node.createTextRange();
            textRange.collapse(true);
            textRange.moveEnd('character', pos);
            textRange.moveStart('character', pos);
            textRange.select();

            return true;
        }

        if (node.setSelectionRange) {
            node.setSelectionRange(pos, pos);
            return true;
        }

        return false;
    };

    _parseHighlightedDates(highlightedDates, highlightedPeriods) {
        const result = {};

        if (highlightedDates && Array.isArray(highlightedDates) && highlightedDates.length) {
            highlightedDates.forEach((value) => {
                let splitData = value.split(',').map((x) => x.trim());
                let newDate = new HighlightedDate(this.dateHelper.parseDate(splitData[0], options.formatDate), splitData[1], splitData[2]);
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
                    newDate = new HighlightedDate(dateStart, desc, style);
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

    now(norecursion = false) {
        let d = new Date();

        if (norecursion) {
            return d;
        }

        if (this.options.defaultDate) {
            let date = this.strToDateTime(this.options.defaultDate);
            d.setFullYear(date.getFullYear());
            d.setMonth(date.getMonth());
            d.setDate(date.getDate());
        }

        if (this.options.defaultTime) {
            let time = this.strtotime(this.options.defaultTime);
            d.setHours(time.getHours());
            d.setMinutes(time.getMinutes());
            d.setSeconds(time.getSeconds());
            d.setMilliseconds(time.getMilliseconds());
        }

        return d;
    }

    strToDateTime(sDateTime) {
        let tmpDate = [];
        let timeOffset;
        let currentTime;

        const { dateHelper, options } = this;

        if (sDateTime && sDateTime instanceof Date && this.isValidDate(sDateTime)) {
            return sDateTime;
        }

        // TODO: làm đơn giản lại
        tmpDate = /^([+-]{1})(.*)$/.exec(sDateTime);

        if (tmpDate) {
            tmpDate[2] = dateHelper.parseDate(tmpDate[2], options.formatDate);
        }

        if (tmpDate  && tmpDate[2]) {
            timeOffset = tmpDate[2].getTime() - (tmpDate[2].getTimezoneOffset()) * 60000;
            currentTime = new Date((this.now(true)).getTime() + parseInt(tmpDate[1] + '1', 10) * timeOffset);
        } else {
            currentTime = sDateTime ? dateHelper.parseDate(sDateTime, options.format) : this.now();
        }

        if (!this.isValidDate(currentTime)) {
            currentTime = this.now();
        }

        return currentTime;
    }

    strToDate(sDate) {
        if (sDate && sDate instanceof Date && this.isValidDate(sDate)) {
            return sDate;
        }

        const { dateHelper, options } = this;

        let currentTime = sDate ? dateHelper.parseDate(sDate, options.formatDate) : this.now(true);

        if (!this.isValidDate(currentTime)) {
            currentTime = this.now(true);
        }
        return currentTime;
    }

    strtotime(sTime) {
        if (sTime && sTime instanceof Date && _this.isValidDate(sTime)) {
            return sTime;
        }

        const { dateHelper, options } = this;

        var currentTime = sTime ? dateHelper.parseDate(sTime, options.formatTime) : this.now(true);

        if (!this.isValidDate(currentTime)) {
            currentTime = this.now(true);
        }
        return currentTime;
    }

    str() {
        var format = this.options.format;
        return this.dateHelper.formatDate(this.currentTime, format);
    }

    isValidDate(d) {
        if (Object.prototype.toString.call(d) !== "[object Date]") {
            return false;
        }
        return !isNaN(d.getTime());
    }

    formatDate(d, format = '') {
        let fm = format || this.options.formatDate;
        return this.dateHelper.formatDate(d, fm);
    }

    formatTime(d, format = '') {
        let fm = format || this.options.formatTime;
        return this.dateHelper.formatDate(d, fm);
    }

    setCurrentTime(dTime, requireValidDate) {
        if (typeof dTime === 'string') {
            this.currentTime = this.strToDateTime(dTime);
        }
        else if (this.isValidDate(dTime)) {
            this.currentTime = dTime;
        }
        else if (!dTime && !requireValidDate && this.options.allowBlank && !this.options.inline) {
            this.currentTime = null;
        }
        else {
            this.currentTime = this.now();
        }

        this.triggerEvent(this.$datetimePicker, 'dt.change');
    }

    empty() {
        this.currentTime = null;
    }

    getCurrentTime() {
        return this.currentTime;
    };

    nextMonth() {
        if (this.currentTime === undefined || this.currentTime === null) {
            this.currentTime = this.now();
        }

        let month = this.currentTime.getMonth() + 1;

        if (month === 12) {
            this.currentTime.setFullYear(this.currentTime.getFullYear() + 1);
            month = 0;
        }

        let year = this.currentTime.getFullYear();

        this.currentTime.setDate(
            Math.min(
                new Date(this.currentTime.getFullYear(), month + 1, 0).getDate(),
                this.currentTime.getDate()
            )
        );
        this.currentTime.setMonth(month);

        if (this.options.onChangeMonth && typeof this.options.onChangeMonth === 'function') {
            this.options.onChangeMonth.call(this, this.currentTime, this.$datetimePicker.dataset.input);
        }

        if (year !== this.currentTime.getFullYear() && typeof this.options.onChangeYear === 'function') {
            this.options.onChangeYear.call(this, this.currentTime, this.$datetimePicker.dataset.input);
        }

        this.triggerEvent(this.$datetimePicker, 'dt.change');
        return month;
    }

    prevMonth() {

        if (this.currentTime === undefined || this.currentTime === null) {
            this.currentTime = this.now();
        }

        let month = this.currentTime.getMonth() - 1;

        if (month === -1) {
            this.currentTime.setFullYear(this.currentTime.getFullYear() - 1);
            month = 11;
        }

        this.currentTime.setDate(
            Math.min(
                new Date(this.currentTime.getFullYear(), month + 1, 0).getDate(),
                this.currentTime.getDate()
            )
        );

        this.currentTime.setMonth(month);

        if (this.options.onChangeMonth && typeof this.options.onChangeMonth === 'function') {
            this.options.onChangeMonth.call(this, this.currentTime, this.$datetimePicker.dataset.input);
        }

        this.triggerEvent(this.$datetimePicker, 'dt.change');
        return month;
    }

    getWeekOfYear(datetime) {
        if (this.options.onGetWeekOfYear && typeof this.options.onGetWeekOfYear === 'function') {
            var week = this.options.onGetWeekOfYear.call(this, datetime);
            if (typeof week !== 'undefined') {
                return week;
            }
        }

        let onejan = new Date(datetime.getFullYear(), 0, 1);

        //First week of the year is th one with the first Thursday according to ISO8601
        if (onejan.getDay() !== 4) {
            onejan.setMonth(0, 1 + ((4 - onejan.getDay()+ 7) % 7));
        }

        return Math.ceil((((datetime - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    /*=============================================
    =            Utils            =
    =============================================*/

    countDaysInMonth(month, year) {
		return new Date(year, month, 0).getDate();
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

class HighlightedDate
{
    constructor(date, desc, style) {
        this.date = date;
        this.desc = desc;
        this.style = style;
    }
}