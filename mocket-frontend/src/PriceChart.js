import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { parseTimeSeriesData, parseTimeSeriesLabels, parseLabel, 
         getPriceDiff, getStartDate, fillLiveList, getCurrTime, truncateTime } from "./Utils";
import { Chart as ChartJS, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from "react-chartjs-2";
import QuoteHeader from "./QuoteHeader";
import "./PriceChart.css";
import "./QuoteHeader.css";

ChartJS.register(annotationPlugin);
ChartJS.register(...registerables);

const PriceChart = ({ liveData, quoteData }) => {
    const restEndpoint = "http://19.26.28.37:8080/trade-service/data/price";
    const { symbol } = useParams();
    const [data, setData] = useState(null);
    const [currData, setCurrData] = useState(liveData);
    const [currDiff, setCurrDiff] = useState(getPriceDiff(quoteData.previous_close, liveData));
    const [labels, setLabels] = useState(null);
    const [toggledIndex, setToggledIndex] = useState(0);
    const [liveIndex, setLiveIndex] = useState(0);
    const setCurrDataRef = useRef();
    const setCurrDiffRef = useRef();
    const getLiveDataRef = useRef();
    const getQuoteDataRef = useRef();
    const getDataRef = useRef();
    const getToggledIndexRef = useRef();
    const getLabelsRef = useRef();
    const drawLabelRef = useRef();
    const buttons = [
        { text: '1D' },
        { text: '1W' },
        { text: '1M' },
        { text: '1Y' }
    ];
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1320 });
    const isMobile = useMediaQuery({ maxWidth: 767 });
    setCurrDataRef.current = setCurrData;
    setCurrDiffRef.current = setCurrDiff;
    getLiveDataRef.current = liveData;
    getQuoteDataRef.current = quoteData;
    getDataRef.current = data;
    getToggledIndexRef.current = toggledIndex;
    getLabelsRef.current = labels;

    const CustomTooltipPlugin = {
        id: 'custom-tooltip',
        beforeDraw: (chart) => {
            const setCurrData = chart.config.options.setCurrDataRef.current;
            const setCurrDiff = chart.config.options.setCurrDiffRef.current;
            const liveData = chart.config.options.getLiveDataRef.current;
            const quoteData = chart.config.options.getQuoteDataRef.current;
            const data = chart.config.options.getDataRef.current;
            const toggledIndex = chart.config.options.getToggledIndexRef.current;
            const labels = chart.config.options.getLabelsRef.current;
            const drawLabel = chart.config.options.drawLabelRef.current;
            if (chart.tooltip._active && chart.tooltip._active.length) {
                const ctx = chart.ctx;
                const activePoint = chart.tooltip._active[0];
                const x = activePoint.element.x;
                const topY = chart.scales.y.top;
                const bottomY = chart.scales.y.bottom;
    
                const dataX = activePoint.element.$context.parsed.x;
                const dataY = activePoint.element.$context.parsed.y;
                setCurrData(dataY.toFixed(2));
                setCurrDiff(getPriceDiff(toggledIndex === 0 ? quoteData.previous_close : data[0], dataY));
                
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash([5, 5]);
                ctx.moveTo(x, bottomY);
                ctx.lineTo(x, topY);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.stroke();
                ctx.restore();
    
                const chartRect = chart.canvas.getBoundingClientRect();
                drawLabel.style.left = `${chartRect.left + x}px`;
                drawLabel.style.top = `calc(${chartRect.top-12}px - 0.5vmin)`;
                drawLabel.textContent = parseLabel(labels[dataX], toggledIndex);
                drawLabel.style.display = 'block';
    
                activePoint.element.options.pointStyle = 'circle';
                activePoint.element.options.borderWidth = 2;
                activePoint.element.options.borderColor = '#ffffff';
            }
            else {
                setCurrData(liveData);
                setCurrDiff(getPriceDiff(toggledIndex === 0 ? quoteData.previous_close : data[0], liveData));
                drawLabel.style.display = 'none';
            }
        }
    };

    ChartJS.register(CustomTooltipPlugin);

    const config = {
        options: {
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        breakeven: {
                            type: 'line',
                            yMin: toggledIndex === 0 ? quoteData.previous_close : data[0],
                            yMax: toggledIndex === 0 ? quoteData.previous_close : data[0],
                            borderColor: '#cccccc',
                            borderDash: [1, 3],
                            borderWidth: 1,
                        }
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false,
                    mode: 'index',
                    intersect: false,
                },
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            elements: {
                point: {
                    pointStyle: false
                }
            },
            maintainAspectRatio: false,
            responsive: true,
            setCurrDataRef,
            setCurrDiffRef,
            getLiveDataRef,
            getQuoteDataRef,
            getDataRef,
            getToggledIndexRef,
            getLabelsRef,
            drawLabelRef,
        }
    };

    const handleToggle = (i) => {
        setToggledIndex(i);
    }
    const getButtonStyle = (i) => {
        return i === toggledIndex ? 'price-chart-interval-button-toggled' : 'price-chart-interval-button-untoggled';
    }
    const getDiffStyle = () => {
        return currDiff[0] === '+' ? 'quote-header-diff-green' : 'quote-header-diff-red'
    }

    useEffect (() => {
        callRestApi();
    }, [toggledIndex]);

    useEffect(() => {
        if(data && toggledIndex === 0) {
            const currTime = truncateTime(getCurrTime());
            const prevTime = labels[liveIndex-1];
            var dataCopy = [...data];
            var labelsCopy = [...labels];
            dataCopy[liveIndex] = liveData;
            labelsCopy[liveIndex] = currTime;
            setData(dataCopy);
            setLabels(labelsCopy);
            console.log("Prev time: " + prevTime);
            console.log("Curr time: " + currTime);
            if(new Date(currTime) - new Date(prevTime) >= 300000) {
                setLiveIndex(liveIndex < 78 ? liveIndex + 1 : 77);
            }
        }
    }, [liveData])

    const callRestApi = async () => {
        var body;
        const start_date = getStartDate(toggledIndex);
        if(toggledIndex === 0) {
            body = {"symbol": symbol, "interval": "5min", "date": quoteData.datetime, "order": "ASC"};
        }
        else if(toggledIndex === 1) {
            body = {"symbol": symbol, "interval": "15min", "start_date": start_date, "order": "ASC"};
        }
        else if(toggledIndex === 2) {
            body = {"symbol": symbol, "interval": "1h", "start_date": start_date, "order": "ASC"};
        }
        else {
            body = {"symbol": symbol, "interval": "1day", "start_date": start_date, "order": "ASC"};
        }
        return fetch(restEndpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, 
            body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            const fullData = JSON.parse(JSON.stringify(responseJson.values));
            const timeSeriesData = parseTimeSeriesData(fullData);
            const timeSeriesLabels = parseTimeSeriesLabels(fullData);
            if(toggledIndex === 0 && quoteData.is_market_open) {
                setLiveIndex(fullData.length);
                setData(fillLiveList(timeSeriesData));
                setLabels(fillLiveList(timeSeriesLabels));
            }
            else {
                setData(timeSeriesData);
                setLabels(timeSeriesLabels);
            }
        })
    }

    return (
        <div>
            <QuoteHeader live={currData} data={quoteData}/>
            <div className={getDiffStyle()}>{currDiff}</div>
            <div className="price-chart">
                <Line 
                    options={config.options} 
                    data=
                    {
                        {
                            labels: labels, 
                            datasets: 
                            [{
                                data: data,
                                borderWidth: isMobile ? 1 : isTablet ? 2 : 3,
                                borderColor: 'rgb(35, 138, 255)'
                            }]
                        }
                    }
                />
            </div>
            <div 
                ref={drawLabelRef} 
                style={{
                    position: 'absolute',
                    display: 'none',
                    color: 'rgba(255, 255, 255, 0.8)',
                    pointerEvents: 'none',
                    transform: 'translateX(-50%)',
                    font: 'max(12px, calc(4px + 1vmin)) Arial'
                }}
            />
            <div className="price-chart-interval">
                {buttons.map((b, i) => (
                    <React.Fragment key={i}>
                        <button
                            className={getButtonStyle(i)}
                            onClick={() => handleToggle(i)}
                        >
                            {b.text}
                        </button>
                        {i < buttons.length-1 && <div className="price-chart-interval-divider"/>}
                    </React.Fragment>
                ))}
            </div>
            <div className="price-chart-divider"/>
        </div>
    )
}

export default PriceChart;