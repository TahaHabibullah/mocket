import React from "react";
import * as exports from "../components/Utils.js";
Object.entries(exports).forEach(([name, exported]) => window[name] = exported);

describe("truncateOutput", () => {
    it("doesn't truncate strings w/ len < 23", async () => {
        expect(truncateOutput("test")).toBe("test");
    });
    it("does truncate strings w/ len >= 23", async () => {
        expect(truncateOutput("abcdefghijklmnopqrstuvwxyz"))
        .toBe("abcdefghijklmnopqrst...");
    });
    it("returns empty if input is null", async () => {
        expect(truncateOutput(null)).toBe("");
    });
});

describe("parsePrice", () => {
    it("returns a dash if input is null", async () => {
        expect(parsePrice(null)).toBe("-");
    });
    it("rounds input", async () => {
        expect(parsePrice("23.987")).toBe("23.99");
    });
    it("forces 2 sig figs", async () => {
        expect(parsePrice("24")).toBe("24.00");
    });
});

describe("parseVolume", () => {
    it("returns a dash if input is null", async () => {
        expect(parseVolume(null)).toBe("-");
    });
    it("truncates output for volume > 1M, two sig figs", async () => {
        expect(parseVolume("4560917")).toBe("4.56M");
    });
    it("truncates output for volume > 1K, one sig fig", async () => {
        expect(parseVolume("4560")).toBe("4.6K");
    });
    it("returns input if volume < 1K", async () => {
        expect(parseVolume("456")).toBe("456");
    });
    it("testing larger numbers", async () => {
        expect(parseVolume("4560917826")).toBe("4560.92M");
    });
});

describe("checkInput", () => {
    it("returns false for empty string", async () => {
        expect(checkInput("")).toBe(false);
    });
    it("returns false for non-alphabetical string", async () => {
        expect(checkInput("-34gasdfg-3498")).toBe(false);
    });
    it("returns true for passing string", async () => {
        expect(checkInput("test")).toBe(true);
    });
});

describe("parseTimeSeriesData", () => {
    const data = [
        {
            "datetime": "2024-08-02 15:45:00",
            "open": "222.02000",
            "high": "222.24001",
            "low": "221.17000",
            "close": "221.17999",
            "volume": "1185525"
        },
    ];

    const result = [
        "221.18"
    ];

    it("returns empty array when input is an empty array", async () => {
        expect(parseTimeSeriesData([])).toStrictEqual([]);
    });
    it("returns empty array when input is null", async () => {
        expect(parseTimeSeriesData(null)).toStrictEqual([]);
    });
    it("returns array of parsed close values", async () => {
        expect(parseTimeSeriesData(data)).toStrictEqual(result);
    });
});

describe("parseTimeSeriesLabels", () => {
    const data = [
        {
            "datetime": "2024-08-02 15:45:00",
            "open": "222.02000",
            "high": "222.24001",
            "low": "221.17000",
            "close": "221.17999",
            "volume": "1185525"
        },
    ];

    const result = [
        "2024-08-02 15:45:00"
    ];

    it("returns empty array when input is an empty array", async () => {
        expect(parseTimeSeriesLabels([])).toStrictEqual([]);
    });
    it("returns empty array when input is null", async () => {
        expect(parseTimeSeriesLabels(null)).toStrictEqual([]);
    });
    it("returns array of parsed datetime values", async () => {
        expect(parseTimeSeriesLabels(data)).toStrictEqual(result);
    });
});

describe("getPriceDiff", () => {
    it("testing gain diff", async () => {
        expect(getPriceDiff("219.32", "230.49")).toBe("+$11.17 (+5.09%)");
    });
    it("testing loss diff", async () => {
        expect(getPriceDiff("230.49", "219.32")).toBe("-$11.17 (-4.85%)");
    });
});

describe("getStartDate", () => {
    it("returns date from last week", async () => {
        const today = new Date();
        const expected = new Date(
        today.getFullYear(), 
        today.getMonth(), 
        today.getDate()-7).toISOString();

        expect(getStartDate(1))
        .toStrictEqual(expected.substring(0, expected.indexOf("T")));
    });
    it("returns date from last month", async () => {
        const today = new Date();
        const expected = new Date(
        today.getFullYear(), 
        today.getMonth(), 
        today.getDate()-30).toISOString();

        expect(getStartDate(2))
        .toStrictEqual(expected.substring(0, expected.indexOf("T")));
    });
    it("returns date from last year", async () => {
        const today = new Date();
        const expected = new Date(
        today.getFullYear(), 
        today.getMonth(), 
        today.getDate()-365).toISOString();

        expect(getStartDate(3))
        .toStrictEqual(expected.substring(0, expected.indexOf("T")));
    });
    it("defaults to last year", async () => {
        const today = new Date();
        const expected = new Date(
        today.getFullYear(), 
        today.getMonth(), 
        today.getDate()-365).toISOString();

        expect(getStartDate(-1))
        .toStrictEqual(expected.substring(0, expected.indexOf("T")));
    });
});

describe("parseLabel", () => {
    it("parses label for 1 day data", async () => {
        expect(parseLabel("2024-08-02 09:30:00", 0))
        .toBe("9:30 AM");
    });
    it("parses label for 1 week data", async () => {
        expect(parseLabel("2024-08-02 09:30:00", 1))
        .toBe("Aug 2 9:30 AM");
    });
    it("parses label for 1 month data", async () => {
        expect(parseLabel("2024-08-02 09:30:00", 2))
        .toBe("Aug 2 9:30 AM");
    });
    it("parses label for 1 year data", async () => {
        expect(parseLabel("2024-08-02", 3))
        .toBe("Aug 2, 2024");
    });
});

describe("fillLiveList", () => {
    it("fills empty list with 78 null", async () => {
        const result = new Array(78);
        result.fill(null);

        expect(fillLiveList([]))
        .toStrictEqual(result);
    });
    it("fills remaining slots of data with null", async () => {
        const result = new Array(78);
        result.fill(null);
        result[0] = "216.92";

        expect(fillLiveList(["216.92"]))
        .toStrictEqual(result);
    });
});

describe("truncateTime", () => {
    it("zeroes seconds on datetime", async () => {
        expect(truncateTime("2024-08-02 09:30:45"))
        .toStrictEqual("2024-08-02 09:30:00");
    });
});

describe("getOpenPositions", () => {
    it("returns only open positions", async () => {
        const positions = [        
            {
                "id": "66affff1e3301d2ccba6e40f",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 219.86,
                "open": false,
                "openTimestamp": "2024-08-04 18:25:53",
                "closeTimestamp": "2024-08-04 18:26:07"
            },
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];

        const result = [
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];
        expect(getOpenPositions(positions)).toStrictEqual(result);
    });
    it("returns empty array if all positions closed", async () => {
        const positions = [        
            {
                "id": "66afffa7e3301d2ccba6e40d",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 219.86,
                "open": false,
                "openTimestamp": "2024-08-04 18:24:39",
                "closeTimestamp": "2024-08-04 18:26:03"
            },
            {
                "id": "66affff1e3301d2ccba6e40f",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 219.86,
                "open": false,
                "openTimestamp": "2024-08-04 18:25:53",
                "closeTimestamp": "2024-08-04 18:26:07"
            }
        ];
        expect(getOpenPositions(positions)).toStrictEqual([]);
    });
});

describe("getSymPositions", () => {
    it("returns only positions that correspond to symbol", async () => {
        const positions = [        
            {
                "id": "66affd220e6352295ab3aeee",
                "symbol": "NVDA",
                "quantity": 100,
                "buy": 107.27,
                "sell": 0,
                "open": true,
                "openTimestamp": "2024-08-04 18:13:54",
                "closeTimestamp": null
            },
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];

        const result = [
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];
        expect(getSymPositions(positions, "AAPL")).toStrictEqual(result);
    });
    it("returns empty array if no positions correspond", async () => {
        const positions = [        
            {
                "id": "66affd220e6352295ab3aeee",
                "symbol": "NVDA",
                "quantity": 100,
                "buy": 107.27,
                "sell": 0,
                "open": true,
                "openTimestamp": "2024-08-04 18:13:54",
                "closeTimestamp": null
            },
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "RIVN",
                "quantity": 10,
                "buy": 21.98,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];
        expect(getSymPositions(positions, "AAPL")).toStrictEqual([]);
    });
});

describe("buyInputValid", () => {
    it("invalid when shares is null", async () => {
        expect(buyInputValid(null, 200, 30)).toBe(false);
    });
    it("invalid when shares is 0", async () => {
        expect(buyInputValid(0, 200, 30)).toBe(false);
    });
    it("invalid when total value > balance", async () => {
        expect(buyInputValid(10, 200, 30)).toBe(false);
    });
    it("valid when total value <= balance", async () => {
        expect(buyInputValid(5, 200, 30)).toBe(true);
    });
});

describe("sellInputValid", () => {
    it("invalid when shares is null", async () => {
        expect(sellInputValid(null, 10)).toBe(false);
    });
    it("valid when shares is 0", async () => {
        expect(sellInputValid(0, 10)).toBe(false);
    });
    it("invalid when total value > balance", async () => {
        expect(sellInputValid(15, 10)).toBe(false);
    });
    it("valid when total value <= balance", async () => {
        expect(sellInputValid(10, 10)).toBe(true);
    });
});

describe("getTotalShares", () => {
    it("returns sum of quantity of all positions for a symbol", async () => {
        const positions = [        
            {
                "id": "66affd220e6352295ab3aeee",
                "symbol": "AAPL",
                "quantity": 15,
                "buy": 220.21,
                "sell": 0,
                "open": true,
                "openTimestamp": "2024-08-04 18:13:54",
                "closeTimestamp": null
            },
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];

        expect(getTotalShares(positions)).toBe(25);
    });
    it("returns 0 for empty positions", async () => {
        const positions = [];
        expect(getTotalShares(positions)).toBe(0);
    });
});

describe("getAverageCost", () => {
    it("returns average cost of all positions for a symbol", async () => {
        const positions = [        
            {
                "id": "66affd220e6352295ab3aeee",
                "symbol": "AAPL",
                "quantity": 15,
                "buy": 225.21,
                "sell": 0,
                "open": true,
                "openTimestamp": "2024-08-04 18:13:54",
                "closeTimestamp": null
            },
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];

        expect(getAverageCost(positions)).toBe("223.07");
    });
    it("returns - for empty positions", async () => {
        const positions = [];
        expect(getAverageCost(positions)).toBe("-");
    });
});

describe("getTotalValue", () => {
    it("returns total value of all positions for a symbol", async () => {
        const positions = [        
            {
                "id": "66affd220e6352295ab3aeee",
                "symbol": "AAPL",
                "quantity": 15,
                "buy": 225.21,
                "sell": 0,
                "open": true,
                "openTimestamp": "2024-08-04 18:13:54",
                "closeTimestamp": null
            },
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];

        expect(getTotalValue(positions, 222.22)).toBe("5555.50");
    });
    it("returns - for empty positions", async () => {
        const positions = [];
        expect(getTotalValue(positions, 222.22)).toBe("-");
    });
});

describe("getTotalReturn", () => {
    it("returns total return of all positions for a symbol", async () => {
        const positions = [        
            {
                "id": "66affd220e6352295ab3aeee",
                "symbol": "AAPL",
                "quantity": 15,
                "buy": 225.21,
                "sell": 0,
                "open": true,
                "openTimestamp": "2024-08-04 18:13:54",
                "closeTimestamp": null
            },
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];

        expect(getTotalReturn(positions, 222.22)).toBe("-$21.25 (-0.38%)");
    });
    it("returns 0 for empty positions", async () => {
        const positions = [];
        expect(getTotalReturn(positions, 222.22)).toBe("+$0.00 (+0.00%)");
    });
});

describe("getPortfolioValue", () => {
    it("returns portfolio value using open positions and user balance", async () => {
        const positions = [        
            {
                "id": "66affd220e6352295ab3aeee",
                "symbol": "NVDA",
                "quantity": 10,
                "buy": 107.27,
                "sell": 0,
                "open": true,
                "openTimestamp": "2024-08-04 18:13:54",
                "closeTimestamp": null
            },
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];

        const quotes = [
            {
                "symbol": "NVDA",
                "close": "108.43000",
            },
            {
                "symbol": "AAPL",
                "close": "222.22",
            }
        ];
        expect(getPortfolioValue(positions, 10000, quotes)).toBe("13306.50");
    });
    it("returns balance if quotes is empty", async () => {
        const positions = [        
            {
                "id": "66affd220e6352295ab3aeee",
                "symbol": "NVDA",
                "quantity": 100,
                "buy": 107.27,
                "sell": 0,
                "open": true,
                "openTimestamp": "2024-08-04 18:13:54",
                "closeTimestamp": null
            },
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "RIVN",
                "quantity": 10,
                "buy": 21.98,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];
        const quotes = [];
        expect(getPortfolioValue(positions, 10000, quotes)).toBe("10000.00");
    });
    it("returns balance if positions is empty", async () => {
        const positions = [];
        const quotes = [
            {
                "symbol": "NVDA",
                "close": "108.43000",
            },
            {
                "symbol": "AAPL",
                "close": "222.22",
            }
        ];
        expect(getPortfolioValue(positions, 10000, quotes)).toBe("10000.00");
    });
});

describe("getPortfolioValue", () => {
    it("returns portfolio prev close using open positions and user balance", async () => {
        const positions = [        
            {
                "id": "66affd220e6352295ab3aeee",
                "symbol": "NVDA",
                "quantity": 10,
                "buy": 107.27,
                "sell": 0,
                "open": true,
                "openTimestamp": "2024-08-04 18:13:54",
                "closeTimestamp": null
            },
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];

        const quotes = [
            {
                "symbol": "NVDA",
                "close": "108.43000",
                "previous_close": "106.56000",
            },
            {
                "symbol": "AAPL",
                "close": "222.22",
                "previous_close": "220.20000",
            }
        ];
        expect(getPortfolioPrevClose(positions, 10000, quotes)).toBe("13267.60");
    });
    it("returns balance if quotes is empty", async () => {
        const positions = [        
            {
                "id": "66affd220e6352295ab3aeee",
                "symbol": "NVDA",
                "quantity": 100,
                "buy": 107.27,
                "sell": 0,
                "open": true,
                "openTimestamp": "2024-08-04 18:13:54",
                "closeTimestamp": null
            },
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "RIVN",
                "quantity": 10,
                "buy": 21.98,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];
        const quotes = [];
        expect(getPortfolioPrevClose(positions, 10000, quotes)).toBe("10000.00");
    });
    it("returns balance if positions is empty", async () => {
        const positions = [];
        const quotes = [
            {
                "symbol": "NVDA",
                "close": "108.43000",
            },
            {
                "symbol": "AAPL",
                "close": "222.22",
            }
        ];
        expect(getPortfolioPrevClose(positions, 10000, quotes)).toBe("10000.00");
    });
});

describe("getCombinedPositions", () => {
    it("combines the quantity of open positions", async () => {
        const positions = [        
            {
                "id": "66affd220e6352295ab3aeee",
                "symbol": "AAPL",
                "quantity": 15,
                "buy": 225.21,
                "sell": 0,
                "open": true,
                "openTimestamp": "2024-08-04 18:13:54",
                "closeTimestamp": null
            },
            {
                "id": "66b001378da37402b78c186b",
                "symbol": "AAPL",
                "quantity": 10,
                "buy": 219.86,
                "sell": 0.0,
                "open": true,
                "openTimestamp": "2024-08-04 18:31:19",
                "closeTimestamp": null
            }
        ];

        const position = {
            "id": "66affd220e6352295ab3aeee",
            "symbol": "AAPL",
            "quantity": 25,
            "buy": 225.21,
            "sell": 0,
            "open": true,
            "openTimestamp": "2024-08-04 18:13:54",
            "closeTimestamp": null
        };

        const result = new Map();
        result.set("AAPL", position);
        expect(getCombinedPositions(positions)).toStrictEqual(result);
    });
    it("returns balance if quotes is empty", async () => {
        const positions = [];
        expect(getCombinedPositions(positions)).toStrictEqual(new Map());
    });
});

describe("getSymQuote", () => {
    it("returns portfolio prev close using open positions and user balance", async () => {
        const quotes = [
            {
                "symbol": "NVDA",
                "close": "108.43000",
                "previous_close": "106.56000",
            },
            {
                "symbol": "AAPL",
                "close": "222.22",
                "previous_close": "220.20000",
            }
        ];

        const result = {
            "symbol": "AAPL",
            "close": "222.22",
            "previous_close": "220.20000",
        }
        expect(getSymQuote(quotes, "AAPL")).toStrictEqual(result);
    });
    it("returns null when symbol not found", async () => {
        const quotes = [
            {
                "symbol": "NVDA",
                "close": "108.43000",
                "previous_close": "106.56000",
            },
            {
                "symbol": "AAPL",
                "close": "222.22",
                "previous_close": "220.20000",
            }
        ];

        expect(getSymQuote(quotes, "RIVN")).toStrictEqual(null);
    });
});

describe("checkQuoteListError", () => {
    it("returns false when timestamp is not zero", async () => {
        const quotes = [
            {
                "symbol": "NVDA",
                "close": "108.43000",
                "previous_close": "106.56000",
                "timestamp": 1722605400
            },
            {
                "symbol": "AAPL",
                "close": "222.22",
                "previous_close": "220.20000",
                "timestamp": 1722605400
            }
        ];

        expect(checkQuoteListError(quotes)).toBe(false);
    });
    it("returns true when at least one timestamp is zero", async () => {
        const quotes = [
            {
                "symbol": "NVDA",
                "close": "108.43000",
                "previous_close": "106.56000",
            },
            {
                "extended_timestamp": 0,
                "is_market_open": false,
                "timestamp": 0
            }
        ];

        expect(checkQuoteListError(quotes)).toBe(true);
    });
});