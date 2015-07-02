/// <reference path="jquery-2.1.4.js" />
/// <reference path="timer.js" />

const MILI_SECONDS_IN_HOUR = 3600 * 1000;
const MILI_SECONDS_IN_MINUTE = 60 * 1000;
const MILI_SECONDS_IN_SECOND = 1000;

$(document).ready(function () {

    (function initTransitions() {

        var modeButtons = $('.switch-clocks a'),
            body = $('body');

        //	Changing the different clock modes using the buttons.

        modeButtons.on('click', function (e) {

            var that = $(e.target);

            // Making the according button accented.

            modeButtons.removeClass('accent-4');
            that.addClass('accent-4');

            // By adding classes to the body we manipulate which clock is shown through CSS.

            if (that.hasClass('alarm')) {
                body.removeClass();
                body.addClass('alarm-mode');
            }

            if (that.hasClass('stopwatch')) {
                body.removeClass();
                body.addClass('stopwatch-mode');
            }

            if (that.hasClass('timer')) {
                body.removeClass();
                body.addClass('timer-mode');
            }

        });
    }());
    (function setHoverShadows() {
        // A hover effect on the clocks.
        var clock = $('.clock');
        clock.on('mouseenter', function (e) {
            $(this).addClass('z-depth-3');
        });
        clock.on('mouseleave', function (e) {
            $(this).removeClass('z-depth-3');
        });
    }());

    var timer = new Timer();
    $('#start').click(function () {
        if (!timer.isActive) {
            timer.start();
            setInterval(showTime, 50);
        }
    });
    $('#pause').click(function () {
        timer.pause();
        clearInterval(showTime);
    });
    $('#reset').click(function () {
        timer.reset();
        showTime();
    });
    $('#editGoal').click(function () {
        $('#goal').hide();
        $('#editGoal').hide();
        $('#goalForm').show();
    });
    $('.clock').click(function () {
        timer.toggle();
        timer.isActive ? setInterval(showTime, 50) : clearInterval(showTime);
    });
    $('input[type=text].goalInput').keydown(function (event) {
        var allowedKeyCodes = [8, 9, 13, 46, 37, 38, 39, 40] //Backspace, Tab, Enter, Delete, Arrow Keys
        if (($.inArray(event.which, allowedKeyCodes) === -1) && isNaN(String.fromCharCode(event.which))) {
            event.preventDefault();
        }

    });
    $('#goalSubmit').click(function () {
        var hours = $('#goalHours').val() || '00';
        var minutes = $('#goalMinutes').val() || '00';
        var seconds = $('#goalSeconds').val() || '00';
        var goal = hours * MILI_SECONDS_IN_HOUR +
                   minutes * MILI_SECONDS_IN_MINUTE +
                   seconds * MILI_SECONDS_IN_SECOND;
        if (goal) {
            timer.goal = goal;
            $('#goal').html([hours, minutes, seconds].join(':'));
            $('#goalHours').val(hours);
            $('#goalMinutes').val(minutes);
            $('#goalSeconds').val(seconds);
        }
        else {
            timer.goal = null;
            $('#goal').html('None');
        }
        $('#goal').show();
        $('#editGoal').show();
        $('#goalForm').hide();
        return false;
    });

    function showTime() {
        var currentTime = timer.getElapsedMilliseconds();
        var hours = Math.floor(currentTime / MILI_SECONDS_IN_HOUR);
        currentTime -= hours * MILI_SECONDS_IN_HOUR;
        var minutes = Math.floor(currentTime / MILI_SECONDS_IN_MINUTE);
        currentTime -= minutes * MILI_SECONDS_IN_MINUTE;
        var seconds = Math.floor(currentTime / MILI_SECONDS_IN_SECOND);
        currentTime -= MILI_SECONDS_IN_SECOND * seconds;
        $('#time').html(pad(hours, 2) + "." + pad(minutes, 2) + "." + pad(seconds, 2) + "." + pad(currentTime, 3));
        showProgressBar();
    }

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    function showProgressBar() {
        if (timer.goal == null) {
            $('#filledBar').css('width', '0%');
            $('#emptyBar').css('width', '0%');
            return;
        }
        var failedDeadline = timer.goal < timer.getElapsedMilliseconds();
        var completeArea = failedDeadline ?
            timer.goal : timer.getElapsedMilliseconds();
        var total = failedDeadline ?
            timer.getElapsedMilliseconds() : timer.goal;
        var incompleteArea = total - completeArea;
        $('#filledBar').css('width', 100 * completeArea / total - 1 + '%');
        $('#emptyBar').css('width', 100 * incompleteArea / total - 1 + '%');
        //$('#filledBar').css('background-color', 'green');
        $('#emptyBar').css('background-color', failedDeadline ? '#ff1744' : 'inherit');
    }
    (function initPage() {
        $('#goalForm').hide();
    }());
});
