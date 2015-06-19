var Timer = function() {
    this._activeIntervals = [];
    this._lastStartTime = null;
    this.goal = null;
    this.isActive = false;
}
Timer.prototype.reset = function () {
    this._lastStartTime = this.isActive ? Date.now() : null;
    this._activeIntervals = [];
}
Timer.prototype.start = function () {
    if (this.isActive) {
        return;
    }
    this._lastStartTime = Date.now();
    this.isActive = true;
}
Timer.prototype.pause = function () {
    if (!this.isActive) {
        return;
    }
    this._activeIntervals.push(
        {
            start: this._lastStartTime,
            end: Date.now()
        });
    this.isActive = false;
    this._lastStartTime = null;
}
Timer.prototype.getElapsedMilliseconds = function () {
    var total = 0;
    for (var i = 0; i < this._activeIntervals.length; i++) {
        total += this._activeIntervals[i].end - this._activeIntervals[i].start;
    }
    if (this.isActive) {
        total += Date.now() - this._lastStartTime;
    }
    return total;
}
