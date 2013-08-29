/**
 * Jquery Plugin Rcountdown counts down to specific times in the future.
 *
 * @Type: jQuery
 * @Plugin Name: Rcountdown
 * @Version 1.0.0
 *
 * @Author: Rathinho Zhang
 * @College: Sun Yet-sen University, PRC
 * @Personal Website: http://rathinho.tk/
 *
 * @Usage
 * $(".some").Rcountdown();
 *
 * @Documentation: http://
 *
 */

(function($) {
	$.fn.Rcountdown = function(settings) {
		var defauts = {
			targetDate		:	"",			// Target date that Rcountdown counts down to, its format must be "yyyy/mm/dd/hh/mm/ss"
			format			:	"defaults",	// Countdown format, options["zh", "en", "default"]
			// timestamp	:   false,		
			textAtEnd		:	"---",		// Text that will be display after countdown ends
			showDay			:	true,		// Displays day option
			showZeroDay		:	true,		// Displays day option if daycount is zero
			customStyle		:	false,		// Customized style for Rcountdown box, should be a css Class
			warningSec		:	30,			// Warns users when countdown second is less than 'warningSec'.
			warningStyle	:	false,		// Add warning style, like ".warning {color: red;}"
			callback		:	false		// Callback function called when countdown ends
		};


		// countdown formats
		var format = {
			defaults	:	{
				dayText		:	"/",
				hourText	:	":",
				minText		:	":",
				secText		:	""
			},

			zh			:	{
				dayText		:	"天",
				hourText	:	"小时",
				minText		:	"分",
				secText		:	"秒"
			},

			en			:	{
				dayText		:	"days",
				hourText	:	"hours",
				minText		:	"minutes",
				secText		:	"seconds"
			},
		};

		/*
		 *	Select specific format
		 */
		var currentFormat = format.defaults;

		if (settings.format === "zh") {
			currentFormat = format.zh;
		} else if (settings.format === "en") {
			currentFormat = format.en;
		}


		var settings = $.extend(defauts, settings);		// Extends defaults
		var countdowns = new Array();					// To store counts, avoiding calculating left time repeatedly

		/*
		 *	Generate a countdown for each instance
		 */
		this.each(function() {
			var _this = $(this);

			var countdownBox = $('<span></span>').addClass('Rcountdown-box'),
				dayBox = $('<span></span>').addClass('Rcountdown-daybox'),
				hourBox = $('<span></span>').addClass('Rcountdown-hourbox'),
				minBox = $('<span></span>').addClass('Rcountdown-minbox'),
				secBox = $('<span></span>').addClass('Rcountdown-secbox'),
				dayTextBox = $('<span></span>').addClass('Rcountdown-daytextbox'),
				hourTextBox = $('<span></span>').addClass('Rcountdown-hourtextbox'),
				minTextBox = $('<span></span>').addClass('Rcountdown-mintextbox'),
				secTextBox = $('<span></span>').addClass('Rcountdown-sectextbox');

			hourTextBox.html(currentFormat.hourText);
			minTextBox.html(currentFormat.minText);
			secTextBox.html(currentFormat.secText);

			countdownBox.append(dayBox).append(dayTextBox).append(hourBox).append(hourTextBox).append(minBox).append(minTextBox).append(secBox).append(secTextBox);
			_this.append(countdownBox);

			// Add customized style for countdown
			if (settings.customStyle != false) {
				countdownBox.addClass(settings.customStyle);
			}

			// Initialization of Rcountdown
			Init(_this);
		});
	

		// Initialize countdown
		function Init(_this) {
			var count = 0;

			if (_this.id === undefined) {
				_this.id = 'rct_' + Math.random(new Date().getTime());
			}

			if (_this.id in countdowns) {
				count = countdowns[_this.id];
			} else {
				var target = dateStringParser(settings.targetDate);
				var targetTimestamp = new Date(target[0], target[1]-1, target[2], target[3], target[4], target[5]);	
				var now = new Date();
				now = Math.floor(now.getTime() / 1000);
				targetTimestamp = Math.floor(targetTimestamp.getTime() / 1000);
				
				count = targetTimestamp - now;
			}

			countdowns[_this.id] = count - 1;

			if (settings.warningStyle && count < settings.warningSec) {
				_this.addClass(settings.warningStyle);
			}

			if (count < 0) {	// when countdown ends
				_this.html(settings.textAtEnd);
				if (settings.callback) {
					settings.callback(_this);
				}
			} else {
				setTimeout(function() {

					calc(count, _this);
					Init(_this);
				}, 1000);
			}
		};


		// Calculate left time 
		function calc(count, cxt) {
			var seconds = normalizeNumber(count % 60);
			count = Math.floor(count / 60);
			var minutes = normalizeNumber(count % 60);
			count = Math.floor(count / 60);
			var hours = normalizeNumber(count % 24);
			count = Math.floor(count / 24);
			var days = count;

			if (days == 0 && !settings.showZeroDay) {

			} else {
				cxt.find('.Rcountdown-daybox').html(days);
				cxt.find('.Rcountdown-daytextbox').html(currentFormat.dayText);
			}

			cxt.find('.Rcountdown-hourbox').html(hours);
			cxt.find('.Rcountdown-minbox').html(minutes);
			cxt.find('.Rcountdown-secbox').html(seconds);
		}

		// Datestring parser
		function dateStringParser(dateString) {
			var dateArray = dateString.split("/");

			return dateArray;
		};

		// Normalize one digit number as "01" or "06"
		function normalizeNumber(number) {
			if (number < 10) {
				number = '0' + number;
			}
			return number;
		}
	};
})(jQuery);