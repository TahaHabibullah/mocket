import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { parseTimeSeriesData, parseTimeSeriesLabels, parseLabel, 
         getPriceDiff, getStartDate, fillLiveList, getCurrTime, truncateTime } from "./Utils";
import { Chart as ChartJS, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from "react-chartjs-2";
import QuoteHeader from "./QuoteHeader";
import Alert from "./Alert";
import axios from "axios";
import "../styling/PriceChart.css";

ChartJS.register(annotationPlugin);
ChartJS.register(...registerables);

const PriceChart = ({ name, liveData, quoteData, isMarketOpen }) => {
    const restEndpoint = '/trade-service/data/price';
    const { symbol } = useParams();
    const [data, setData] = useState(null);
    const [currData, setCurrData] = useState(liveData);
    const [currDiff, setCurrDiff] = useState(getPriceDiff(quoteData.previous_close, liveData));
    const [labels, setLabels] = useState(null);
    const [toggledIndex, setToggledIndex] = useState(0);
    const [liveIndex, setLiveIndex] = useState(0);
    const [error, setError] = useState(null);
    const [tooltipActive, setTooltipActive] = useState(false);
    const setCurrDataRef = useRef();
    const setCurrDiffRef = useRef();
    const getLiveDataRef = useRef();
    const getQuoteDataRef = useRef();
    const getDataRef = useRef();
    const getToggledIndexRef = useRef();
    const getLabelsRef = useRef();
    const drawLabelRef = useRef();
    const prevSymbol = useRef(symbol);
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
                setTooltipActive(true);
                
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
                drawLabel.style.top = `calc(${chart.canvas.offsetTop-12}px - 0.5vmin)`;
                drawLabel.textContent = parseLabel(labels[dataX], toggledIndex);
                drawLabel.style.display = 'block';
    
                activePoint.element.options.pointStyle = 'circle';
                activePoint.element.options.borderWidth = 2;
                activePoint.element.options.borderColor = '#ffffff';
            }
            else {
                setCurrData(liveData);
                setCurrDiff(getPriceDiff(toggledIndex === 0 ? quoteData.previous_close : data[0], liveData));
                setTooltipActive(false);
                drawLabel.style.display = 'none';
            }
        },
        beforeDestroy: () => {
            ChartJS.unregister(CustomTooltipPlugin);
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
            spanGaps: true,
            maintainAspectRatio: false,
            responsive: true,
            setCurrDataRef,
            setCurrDiffRef,
            getLiveDataRef,
            getQuoteDataRef,
            getDataRef,
            getToggledIndexRef,
            getLabelsRef,
            drawLabelRef
        }
    };

    const handleToggle = (i) => {
        setToggledIndex(i);
    };
    const getButtonStyle = (i) => {
        return i === toggledIndex ? 'price-chart-interval-button-toggled' : 'price-chart-interval-button-untoggled';
    };
    const getDiffStyle = () => {
        return currDiff[0] === '+' ? 'quote-header-diff-green' : 'quote-header-diff-red'
    };

    useEffect (() => {
        if(prevSymbol.current !== symbol) {
            if(toggledIndex === 0) {
                callRestApi();
            }
            else {
                setToggledIndex(0);
            }
            prevSymbol.current = symbol;
        }
        else {
            callRestApi();
        }
    }, [toggledIndex, symbol]);

    useEffect(() => {
        if(data && toggledIndex === 0) {
            const currTime = truncateTime(getCurrTime());
            const prevTime = labels[liveIndex-1];
            var dataCopy = [...data];
            var labelsCopy = [...labels];
            labelsCopy[liveIndex] = currTime;
            dataCopy[liveIndex] = liveData;
            setLabels(labelsCopy);
            setData(dataCopy);
            if(new Date(currTime) - new Date(prevTime) >= 300000) {
                setLiveIndex(liveIndex < 78 ? liveIndex + 1 : 77);
            }
        }
    }, [liveData]);

    const callRestApi = async () => {
        var body;
        const start_date = getStartDate(toggledIndex);
        const feed = isMarketOpen ? "iex" : undefined
        if(toggledIndex === 0) {
            body = {symbol: symbol, interval: "5Min", start_date: quoteData.datetime, order: "asc", feed: feed};
        }
        else if(toggledIndex === 1) {
            body = {symbol: symbol, interval: "15Min", start_date: start_date, order: "asc", feed: feed};
        }
        else if(toggledIndex === 2) {
            body = {symbol: symbol, interval: "1Hour", start_date: start_date, order: "asc"};
        }
        else {
            body = {symbol: symbol, interval: "1Day", start_date: start_date, order: "asc"};
        }
        return axios.post(restEndpoint, body)
        .then((response) => {
            if(response.data.status === "error") {
                setError("API limit exceeded. Try again later.");
            }
            else {
                const fullData = response.data[0].values;
                const timeSeriesData = parseTimeSeriesData(fullData);
                const timeSeriesLabels = parseTimeSeriesLabels(fullData);
                if(toggledIndex === 0 && isMarketOpen) {
                    setLiveIndex(fullData.length);
                    setData(fillLiveList(timeSeriesData));
                    setLabels(fillLiveList(timeSeriesLabels));
                }
                else {
                    setData(timeSeriesData);
                    setLabels(timeSeriesLabels);
                }
            }
        }).catch(error => {
            setError("Failed to fetch data from API.");
            console.log(error);
        })
    };
    return (
        <div>
            {error ? (
                <Alert message={error} style={"error"} setAlert={setError}/>
            ) : (
                <div/>
            )}
            <QuoteHeader name={name} symbol={quoteData.symbol} live={currData} tooltipActive={tooltipActive}/>
            <div className={getDiffStyle()}>{currDiff}</div>
            <div className="price-chart">
                <Line 
                    options={config.options} 
                    data=
                    {
                        {
                            labels: Array(labels ? labels.length : 0).fill(0),
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
    );
};

export default PriceChart;