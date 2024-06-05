import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { parseTimeSeriesData, parseTimeSeriesLabels, getPriceDiff } from "./Utils";
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
    const [mouseOn, setMouseOn] = useState(false);
    const setMouseOnRef = useRef();
    const setCurrDataRef = useRef();
    const setCurrDiffRef = useRef();
    const getLiveDataRef = useRef();
    const getQuoteDataRef = useRef();
    const getDataRef = useRef();
    const getToggledIndexRef = useRef();
    const getLabelsRef = useRef();
    const buttons = [
        { text: '1D' },
        { text: '1W' },
        { text: '1M' },
        { text: '1Y' }
    ];
    setMouseOnRef.current = setMouseOn;
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
            const setMouseOn = chart.config.options.setMouseOnRef.current;
            const setCurrData = chart.config.options.setCurrDataRef.current;
            const setCurrDiff = chart.config.options.setCurrDiffRef.current;
            const liveData = chart.config.options.getLiveDataRef.current;
            const quoteData = chart.config.options.getQuoteDataRef.current;
            const data = chart.config.options.getDataRef.current;
            const toggledIndex = chart.config.options.getToggledIndexRef.current;
            const labels = chart.config.options.getLabelsRef.current;
            if (chart.tooltip._active && chart.tooltip._active.length) {
                if(setMouseOn) {
                    setMouseOn(true);
                }
                const ctx = chart.ctx;
                const activePoint = chart.tooltip._active[0];
                const x = activePoint.element.x;
                const topY = chart.scales.y.top;
                const bottomY = chart.scales.y.bottom;
    
                const dataX = activePoint.element.$context.parsed.x;
                const dataY = activePoint.element.$context.parsed.y;
                setCurrData(dataY);
                setCurrDiff(getPriceDiff(toggledIndex === 0 ? quoteData.previous_close : data[0], dataY));
                
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash([5, 5]);
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY-20);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.stroke();
                ctx.restore();
    
                ctx.save();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.textAlign = 'center';
                ctx.font = '12px Arial';
                ctx.fillText(labels ? labels[dataX] : dataX, x, bottomY-8);
                ctx.restore();
    
                activePoint.element.options.pointStyle = 'circle';
                activePoint.element.options.borderWidth = 2;
                activePoint.element.options.borderColor = '#ffffff';
            }
            else {
                setMouseOn(false);
                setCurrData(liveData);
                setCurrDiff(getPriceDiff(toggledIndex === 0 ? quoteData.previous_close : data[0], liveData));
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
            setMouseOnRef,
            setCurrDataRef,
            setCurrDiffRef,
            getLiveDataRef,
            getQuoteDataRef,
            getDataRef,
            getToggledIndexRef,
            getLabelsRef
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

    useEffect (() => {
        if(!mouseOn) {
            setCurrData(liveData);
            setCurrDiff(getPriceDiff(toggledIndex === 0 ? quoteData.previous_close : data[0], liveData));
        }
    }, [liveData]);

    const callRestApi = async () => {
        var body;
        if(toggledIndex === 0) {
            body = {"symbol": symbol, "interval": "5min", "outputSize": "78"};
        }
        else if(toggledIndex === 1) {
            body = {"symbol": symbol, "interval": "15min", "outputSize": "182"};
        }
        else if(toggledIndex === 2) {
            body = {"symbol": symbol, "interval": "1h", "outputSize": "154"};
        }
        else {
            body = {"symbol": symbol, "interval": "1day", "outputSize": "365"};
        }
        return fetch(restEndpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, 
            body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            setData(parseTimeSeriesData(responseJson.values));
            setLabels(parseTimeSeriesLabels(responseJson.values));
        })
    }

    return (
        <div>
            <QuoteHeader live={currData} data={quoteData}/>
            <div className={getDiffStyle()}>{currDiff}</div>
            <div className="price-chart">
                <Line options={config.options} data={{labels: labels, datasets: [{data: data}]}}/>
            </div>

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