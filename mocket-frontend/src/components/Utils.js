const regex = /^[a-zA-Z]+$/;

function isAlpha(text) {
    return regex.test(text);
}

export function truncateOutput(text) {
    if(!text)
        return "";
    else if(text.length < 23)
        return text;
    else
        return text.substring(0, 20) + "...";
}

export function parsePrice(text) {
    if(!text) {
        return "-";
    }
    return parseFloat(text).toFixed(2);
}

export function parseVolume(vol) {
    if(!vol) {
        return "-";
    }
    if(vol / 1000000 > 1) {
        const adj = parseFloat(vol / 1000000).toFixed(2);
        return "" + adj + "M";
    }
    else if(vol / 1000 > 1) {
        const adj = parseFloat(vol / 1000).toFixed(1);
        return "" + adj + "K";
    }
}

export function checkInput(text) {
    if(text.length < 1 || !isAlpha(text))
        return '1';
    else
        return text;
}

export function parseTimeSeriesData(data) {
    var result = [];
    for(var i in data) {
        result.push(parsePrice(data[i].close));
    }
    return result;
}

export function parseTimeSeriesLabels(data) {
    var result = [];
    for(var i in data) {
        result.push(data[i].datetime);
    }
    return result;
}

export function getPriceDiff(previous_close, currPrice) {
    const diff = (parseFloat(currPrice) - parseFloat(previous_close));
    var res = "";
    if(diff >= 0) {
        res += "+$" + diff.toFixed(2);
    }
    else {
        res += "-$" + (diff * -1).toFixed(2);
    }
    const diffPercent = (diff / parseFloat(previous_close)) * 100;
    if(diffPercent >= 0) {
        res += " (+" + diffPercent.toFixed(2) + "%)";
    }
    else {
        res += " (" + diffPercent.toFixed(2) + "%)";
    }
    return res;
}

export function getStartDate(mode) {
    const date = new Date();
    if(mode === 1)
        date.setDate(date.getDate() - 7);
    else if(mode === 2)
        date.setDate(date.getDate() - 30);
    else
        date.setDate(date.getDate() - 365);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day =  date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function parseLabel(label, mode) {
    const date = new Date(label);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    const ampm = hours >= 12 ? 'PM' : 'AM';
        
    hours = hours % 12;
    hours = hours ? hours : 12;
        
    minutes = minutes < 10 ? '0' + minutes : minutes;

    if(mode === 0)
        return `${hours}:${minutes} ${ampm}`;
    else if(mode === 3)
        return `${month} ${day}`;
    else
        return `${month} ${day} ${hours}:${minutes} ${ampm}`;
}

export function fillLiveList(list) {
    var result = [];
    for(let i = 0; i < list.length; i++) {
        result.push(list[i]);
    }
    for(let i = list.length; i < 78; i++) {
        result.push(null);
    }
    return result;
}

export function getCurrTime() {
    const moment = require("moment-timezone");
    const curr = new Date();
    const est = moment(curr).tz("America/New_York").format("YYYY-MM-DD HH:mm:ss");
    return est;
}

export function truncateTime(datetime) {
    const moment = require("moment-timezone");
    const time = new Date(datetime);
    time.setSeconds(0);
    const result = moment(time).format("YYYY-MM-DD HH:mm:ss");
    return result;
}

export function getOpenPositions(positions) {
    var result = [];
    for(var i = 0; i < positions.length; i++) {
        if(positions[i].open) {
            result.push(positions[i]);
        }
    }
    return result;
}