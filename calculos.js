var num = 10.1;
var nr = countDecimals(num)
var m = Math.round(num * Math.pow(10, nr));


var countDecimals = function(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}

var num = (1111 * Math.pow(10, -3)) + (2222 * Math.pow(10, -5));