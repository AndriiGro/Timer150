/// <reference path="jquery-2.1.4.js" />
/// <reference path="timer.js" />

const MILI_SECONDS_IN_HOUR = 3600 * 1000;
const MILI_SECONDS_IN_MINUTE = 60 * 1000;
const MILI_SECONDS_IN_SECOND = 1000;

$(document).ready(function () {
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
    $('#goal').keyup(function () {
        var timeValues = $('#goal').val().split(':');
        var goal = timeValues[0] * 60 * 60 * 1000 +
                   timeValues[1] * 60 * 1000 +
                   timeValues[2] * 1000;
        timer.goal = goal ? goal : null;
    });
    function showTime() {
        var currentTime = timer.getElapsedMilliseconds();
        var hours = Math.floor(currentTime / MILI_SECONDS_IN_HOUR);
        currentTime -= hours * MILI_SECONDS_IN_HOUR;
        var minutes = Math.floor(currentTime / MILI_SECONDS_IN_MINUTE);
        currentTime -= minutes * MILI_SECONDS_IN_MINUTE;
        var seconds = Math.floor(currentTime / MILI_SECONDS_IN_SECOND);
        currentTime -= MILI_SECONDS_IN_SECOND * seconds;
        $('#time').html(pad(hours,2) + "." + pad(minutes,2) + "." + pad(seconds,2) + "." + pad(currentTime,2));
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
        $('#filledBar').css('background-color', 'green');
        $('#emptyBar').css('background-color', failedDeadline ? 'red' : 'inherit');
    }
});
