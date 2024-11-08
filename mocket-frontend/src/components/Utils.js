import { jwtDecode } from "jwt-decode";

const regex = /^[a-zA-Z]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isAlpha(text) {
    return regex.test(text);
}

export function truncateOutput(text) {
    if(!text)
        return "";

    if(window.innerWidth < 767) {
        if(text.length < 18) {
            return text;
        }
        else {
            return text.substring(0, 20) + "...";
        }
    }
    else if(window.innerWidth < 1320) {
        if(text.length < 23) {
            return text;
        }
        else {
            return text.substring(0, 20) + "...";
        }
    }
    else { 
        if(text.length < 33) {
            return text;
        }
        else {
            return text.substring(0, 30) + "...";
        }
    }
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
        return adj + "M";
    }
    else if(vol / 1000 > 1) {
        const adj = parseFloat(vol / 1000).toFixed(1);
        return adj + "K";
    }
    else {
        return vol;
    }
}

export function checkInput(text) {
    if(text.length < 1 || !isAlpha(text))
        return false;
    else
        return true;
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
    const diffPercent = (diff === 0 ? 0 : diff / parseFloat(previous_close)) * 100;
    if(diffPercent >= 0) {
        res += " (+" + diffPercent.toFixed(2) + "%)";
    }
    else {
        res += " (" + diffPercent.toFixed(2) + "%)";
    }
    return res;
}

export function isMarketOpen() {
    const curr = new Date();

    const options = {
        timeZone: "America/New_York",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
    };

    const [hours, minutes] = curr.toLocaleString('en-US', options).split(":").map(Number);

    const startHour = 9;
    const startMinute = 30;
    const endHour = 16;
    const endMinute = 0;

    const isMarketOpen = (hours > startHour || (hours === startHour && minutes >= startMinute)) &&
                    (hours < endHour || (hours === endHour && minutes === endMinute));

    return isMarketOpen;
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
    var date;
    if(mode === 3) {
        date = new Date(label + "T00:00:00");
    }
    else {
        date = new Date(label);
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const year = date.getFullYear();
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
        return `${month} ${day}, ${year}`;
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

export function getSymPositions(positions, symbol) {
    var result = [];
    for(var i = 0; i < positions.length; i++) {
        if(positions[i].symbol === symbol) {
            result.push(positions[i]);
        }
    }
    return result;
}

export function buyInputValid(num, bal, price) {
    if(!num) {
        return false;
    }

    var result = parseInt(num);
    if(result < 1) {
        return false;
    }
    else {
        if(price * result > bal) {
            return false;
        }
        else {
            return true;
        }
    }
}

export function sellInputValid(num, shares) {
    if(!num) {
        return false;
    }

    var result = parseInt(num);
    if(result < 1) {
        return false;
    }
    else {
        if(num > shares) {
            return false;
        }
        else {
            return true;
        }
    }
}

export function getTotalShares(positions) {
    var result = 0;
    for(var i = 0; i < positions.length; i++) {
        result += positions[i].quantity;
    }
    return result;
}

export function getAverageCost(positions) {
    var shares = 0;
    var total = 0;
    for(var i = 0; i < positions.length; i++) {
        total += positions[i].quantity * positions[i].buy;
        shares += positions[i].quantity;
    }
    return parsePrice(total / shares);
}

export function getTotalValue(positions, live) {
    var result = 0;
    for(var i = 0; i < positions.length; i++) {
        result += positions[i].quantity * live;
    }
    return parsePrice(result);
}

export function getTotalReturn(positions, live) {
    var cost = 0;
    var curr = 0;
    for(var i = 0; i < positions.length; i++) {
        cost += positions[i].quantity * positions[i].buy;
        curr += positions[i].quantity * live;
    }
    return getPriceDiff(cost, curr);
}

export function getPortfolioValue(positions, balance, quotes) {
    if(quotes.length < 1 || positions.length < 1) {
        return parsePrice(balance);
    }
    var result = balance;
    for(var i = 0; i < quotes.length; i++) {
        for(var j = 0; j < positions.length; j++) {
            if(quotes[i].symbol === positions[j].symbol) {
                result += positions[j].quantity * quotes[i].close;
            }
        }
    }
    return parsePrice(result);
}

export function getPortfolioPrevClose(positions, balance, quotes) {
    if(quotes.length < 1 || positions.length < 1) {
        return parsePrice(balance);
    }
    const moment = require("moment");
    const open = moment().set({hour: 9, minute: 30, second: 0, millisecond: 0});
    var result = balance;
    for(var i = 0; i < quotes.length; i++) {
        for(var j = 0; j < positions.length; j++) {
            if(quotes[i].symbol === positions[j].symbol) {
                const openTimestamp = moment(positions[j].openTimestamp, "YYYY-MM-DD HH:mm:ss");
                if(openTimestamp.isAfter(open)) {
                    result += positions[j].quantity * quotes[i].close;
                }
                else {
                    result += positions[j].quantity * quotes[i].previous_close;
                }
                
            }
        }
    }
    return parsePrice(result);
}

export function getLastBusinessDay() {
    const date = new Date(getCurrTime());
    if(date.getHours() < 9) {
        date.setDate(date.getDate() - 1);
    }
    else if(date.getHours() === 9 && date.getMinutes() < 30) {
        date.setDate(date.getDate() - 1);
    }

    if(date.getDay() === 0) {
        date.setDate(date.getDate() - 2);
    }
    else if(date.getDay() === 6) {
        date.setDate(date.getDate() - 1);
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day =  date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getCombinedPositions(positions) {
    const result = new Map();
    for(var i = 0; i < positions.length; i++) {
        if(result.has(positions[i].symbol)) {
            var temp = {...result.get(positions[i].symbol)};
            temp.quantity += positions[i].quantity;
            result.set(positions[i].symbol, temp);
        }
        else {
            result.set(positions[i].symbol, positions[i]);
        }
    }
    return result;
}

export function getSymQuote(quoteList, symbol) {
    for(var i = 0; i < quoteList.length; i++) {
        if(quoteList[i].symbol === symbol) {
            return quoteList[i];
        }
    }
    return null;
}

export function validEmail(email) {
    return String(email).toLowerCase().match(emailRegex);
}

export function expiredToken() {
    const currTime = Date.now() / 1000;
    const token = localStorage.getItem('token');
    if(token === null) {
        return true;
    }
    const decoded = jwtDecode(token);
    if(decoded.exp < currTime) {
        return true;
    }
    else {
        return false;
    }
}

export function getUserId(token) {
    return jwtDecode(token).sub;
}