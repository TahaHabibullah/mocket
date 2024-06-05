const regex = /^[a-zA-Z]+$/;

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

export function isAlpha(text) {
    return regex.test(text);
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
        result.push(parsePrice(data[i].close))
    }
    return result.reverse();
}

export function parseTimeSeriesLabels(data) {
    var result = [];
    for(var i in data) {
        result.push(data[i].datetime);
    }
    return result.reverse();
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