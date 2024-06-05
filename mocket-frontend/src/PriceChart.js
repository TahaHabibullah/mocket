import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { parseTimeSeriesData, parseTimeSeriesLabels, getPriceDiff } from "./Utils";
import Chart from 'react-apexcharts';
import QuoteHeader from "./QuoteHeader";
import "./PriceChart.css";
import "./QuoteHeader.css";

const PriceChart = ({ liveData, quoteData }) => {
    const restEndpoint = "http://19.26.28.37:8080/trade-service/data/price";
    const { symbol } = useParams();
    const [data, setData] = useState(null);
    const [currData, setCurrData] = useState(liveData);
    const [currDiff, setCurrDiff] = useState(getPriceDiff(quoteData.previous_close, liveData));
    const [labels, setLabels] = useState(null);
    const [toggledIndex, setToggledIndex] = useState(0);
    const [mouseOn, setMouseOn] = useState(false);
    const buttons = [
        { text: '1D' },
        { text: '1W' },
        { text: '1M' },
        { text: '1Y' }
    ];
    const state = {
      options: {
        chart: {
            id: "basic-line",
            toolbar: {
                show: false
            },
            selection: {
                enabled: false
            },
            events: {
                mouseMove: function() {
                    setMouseOn(true);
                },
                mouseLeave: function() {
                    setMouseOn(false);
                    setCurrData(liveData);
                    setCurrDiff(getPriceDiff(getPrevClose(), liveData));
                }
            }
        },
        xaxis: {
            categories: labels,
            labels: {
                show: false
            },
            axisBorder: {
                show: false
              },
              axisTicks: {
                show: false
              }
        },
        yaxis: {
            show: false
        },
        grid: {
            show: false
        },
        tooltip: {
            theme: "dark",
            custom: function({series, seriesIndex, dataPointIndex, w}) {
                setCurrData(series[seriesIndex][dataPointIndex].toFixed(2));
                setCurrDiff(getPriceDiff(getPrevClose(), series[seriesIndex][dataPointIndex].toFixed(2)));
                return (
                    '<div/>'
                )
            }
        },
        annotations: {
            yaxis: [
                {
                    y: toggledIndex === 0 ? quoteData.previous_close : data[0],
                    fillColor: '#cccccc',
                }
            ]
        }
      },
    }

    const getPrevClose = () => {
        if(toggledIndex === 0) {
            return quoteData.previous_close;
        }
        else {
            return data[0];
        }
    }
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
            setCurrDiff(getPriceDiff(getPrevClose(), liveData));
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
                {data ? <Chart options={state.options} series={[{data: data}]} type="line" width="100%"/> : <div/>}
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