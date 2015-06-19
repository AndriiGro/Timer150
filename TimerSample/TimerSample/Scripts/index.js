/// <reference path="jquery-2.1.4.js" />
/// <reference path="timer.js" />
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
        var milliseconds = currentTime % 1000;
        currentTime = (currentTime - milliseconds) / 1000;
        var seconds = currentTime % 60;
        currentTime = (currentTime - seconds) / 60;
        var minutes = currentTime % 60;
        var hours = currentTime / 60;
        $('#time').html(hours + "." + minutes + "." + seconds + "." + milliseconds);
        showProgressBar();
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