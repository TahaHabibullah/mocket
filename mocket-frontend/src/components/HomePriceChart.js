import React, { useEffect, useState, useRef } from "react";
import { useMediaQuery } from 'react-responsive';
import { parseTimeSeriesData, parseTimeSeriesLabels, parseLabel, 
         getPriceDiff, getStartDate, parsePrice, getLastBusinessDay } from "./Utils";
import { Chart as ChartJS, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from "react-chartjs-2";
import Alert from "./Alert";
import "../styling/PriceChart.css";
import "../styling/Home.css";

ChartJS.register(annotationPlugin);
ChartJS.register(...registerables);

const HomePriceChart = ({ prevClose, total }) => {
    const restEndpoint = "http://19.26.28.37:8080/database/user/getGraph?id=669c943e6e45b63f43d7add8&";
    const [data, setData] = useState(null);
    const [currData, setCurrData] = useState(total);
    const [currDiff, setCurrDiff] = useState(getPriceDiff(prevClose, total));
    const [labels, setLabels] = useState(null);
    const [toggledIndex, setToggledIndex] = useState(0);
    const [error, setError] = useState(null);
    const setCurrDataRef = useRef();
    const setCurrDiffRef = useRef();
    const getPrevCloseRef = useRef();
    const getTotalRef = useRef();
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
    getPrevCloseRef.current = prevClose;
    getTotalRef.current = total;
    getDataRef.current = data;
    getToggledIndexRef.current = toggledIndex;
    getLabelsRef.current = labels;

    const CustomTooltipPlugin = {
        id: 'custom-tooltip',
        beforeDraw: (chart) => {
            const setCurrData = chart.config.options.setCurrDataRef.current;
            const setCurrDiff = chart.config.options.setCurrDiffRef.current;
            const prevClose = chart.config.options.getPrevCloseRef.current;
            const total = chart.config.options.getTotalRef.current;
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
                setCurrDiff(getPriceDiff(toggledIndex === 0 ? prevClose : data[0], dataY));
                
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
                setCurrData(total);
                setCurrDiff(getPriceDiff(toggledIndex === 0 ? prevClose : data[0], total));
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
                            yMin: toggledIndex === 0 ? prevClose : data[0],
                            yMax: toggledIndex === 0 ? prevClose : data[0],
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
            getPrevCloseRef,
            getTotalRef,
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

    const callRestApi = async () => {
        var params;
        const start_date = getStartDate(toggledIndex);
        if(toggledIndex === 0) {
            params = "interval=5min&start_date=" + getLastBusinessDay();
        }
        else if(toggledIndex === 1) {
            params = "interval=15min&start_date=" + start_date;
        }
        else if(toggledIndex === 2) {
            params = "interval=1h&start_date=" + start_date;
        }
        else {
            params = "interval=1day&start_date=" + start_date;
        }
        return fetch(restEndpoint + params, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, 
        })
        .then((response) => { if(response.ok) return response.json() })
        .then((responseJson) => {
            console.log(responseJson);
            if(responseJson.length < 1) {
                setError("API limit exceeded. Try again later.");
            }
            else {
                const fullData = JSON.parse(JSON.stringify(responseJson));
                setData(parseTimeSeriesData(fullData));
                setLabels(parseTimeSeriesLabels(fullData));
            }
        }).catch(error => {
            setError("Failed to fetch data from API.");
            console.log(error);
        })
    }

    return (
        <div>
            {error ? (
                <Alert message={error} style={"error"} setError={setError}/>
            ) : (
                <div/>
            )}
            <div className="home-header">
                <div className="home-header-balance">${parsePrice(currData)}</div>
            </div>
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

export default HomePriceChart;