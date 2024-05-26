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