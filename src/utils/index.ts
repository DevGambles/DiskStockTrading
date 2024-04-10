import { toast } from 'react-toastify'
import * as R from "ramda";
import { useState, useEffect } from 'react';
import Holding, { HoldingType } from "@/models/holdingModel";
import LogBook, { LogBookType } from "@/models/logbookModel";
import InitHolding from "@/models/initHoldingModel";

export const getHoldingData = async () => {
    const res = await fetch("/api/holding", {
        method: "GET",
    });

    const response = await res.json();
    return response;
};

export const handleError = (msg: String) => {
    toast.error(msg);
}

export const handleInfo = (msg: String, config: Object | null = null) => {
    if (config) {
        toast.info(msg, config);
    } else {
        toast.info(msg);
    }
}

export const arrangeStocks = (data: any) => {
    return R.pipe<any, any[], any[], any[], any[]>(
        R.chain((x: any) => x.Instrument),
        R.uniq,
        R.filter((x: any) => x?.length && x.length > 0),
        R.map((c: any) => ({ label: c, value: c }))
    )(data);
}

export const useHoldingData = () => {
    const [holdingData, setHoldingData] = useState([]);
  
    useEffect(() => {
      const initHoldingData = async () => {
        if (holdingData?.length === 0) {
          const res = await getHoldingData();
          if (res.data.length > 0) {
            setHoldingData(res.data);
          }
        }
      };
      initHoldingData();
    }, []); // Empty dependency array to run the effect only once
  
    return { holdingData, setHoldingData }; // Return the holdingData state
};

export const getCurrentDateStr = () => new Date().toLocaleString('en-US').split(",")[0];

export const mapHoldingToNewHolding = (
    userId: String,
    holding: any,
    AveragePrice: number
) => {
    let newHolding = new Holding();
    newHolding.userId = userId;
    newHolding.Symbol = holding.Symbol;
    newHolding.ISIN = holding.ISIN;
    newHolding.Sector = holding.Sector;
    newHolding.QuantityAvailable = holding.QuantityAvailable;
    newHolding.QuantityDiscrepant = holding.QuantityDiscrepant;
    newHolding.QuantityLongTerm = holding.QuantityLongTerm;
    newHolding.QuantityPledgedMargin = holding.QuantityPledgedMargin;
    newHolding.QuantityPledgedLoan = holding.QuantityPledgedLoan;
    newHolding.AveragePrice = holding.AveragePrice;
    newHolding.PreviousClosingPrice = holding.PreviousClosingPrice;
    newHolding.UnrealizedPL = holding.UnrealizedPL;
    newHolding.UnrealizedPLPct = holding.UnrealizedPLPct;
    newHolding.CurrentInvestment = holding.QuantityAvailable * AveragePrice;
    holding.updatedAt = new Date();
    return newHolding;
}

export const mapRowToLogbook = async (userId: String, logBook: LogBookType, holding: HoldingType) => {
    var logbook = new LogBook();
    var qty = parseInt(logBook.Qty);
    qty = (logBook.Type == "BUY" ? qty : -qty);
    logbook.Amount = parseInt(logBook.AvgPrice) * qty;

    logbook.userId = userId;
    logbook.Time = new Date(logBook.Time);
    logbook.Type = logBook.Type;
    logbook.Instrument = logBook.Instrument;
    logbook.Product = logBook.Product;
    logbook.Qty = logBook.Qty;
    logbook.AvgPrice = logBook.AvgPrice;
    logbook.Status = logBook.Status;

    var holdingFound = await InitHolding.findOne({
      Symbol: logBook.Instrument,
      userId: userId
    });
    if (holdingFound) {
      logbook.AvgCost = holding.AveragePrice;
      logbook.CumulativeQty = holding.QuantityAvailable;
      logbook.CumulativeInvestment = holding.CurrentInvestment;
    }
    logbook.Profit = (logBook.Type == "SELL" ? (-qty * (parseInt(logBook.AvgPrice) - holdingFound.AveragePrice)) : 0);
    return logbook;
}