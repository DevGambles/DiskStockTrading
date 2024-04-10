import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Select from "react-select";
import * as R from "ramda";
import { getHoldingData, arrangeStocks, getCurrentDateStr } from "@/utils";

const Home = () => {
  const dateStr = useMemo(getCurrentDateStr, []);
  const [lastUpdate, setLastUpdate] = useState("");
  const [holdingData, setHoldingData] = useState([]);

  useEffect(() => {
    const initHoldingData = async () => {
      if(holdingData?.length == 0) {
        const res = await getHoldingData();
        if(res.data.length > 0) {
          setHoldingData(res.data);
          setLastUpdate(new Date(res.lastUpdate).toLocaleString('en-US'));
        }
      }
    }
    initHoldingData();
  }, [holdingData])

  const [filterStock, setFilterStock] = useState<Set<string>>(
    new Set([])
  );

  // get stocks data from orderData using unique into object of label and value
  const stocks: any[] = useMemo(() => {
    return arrangeStocks(holdingData);
  }, [holdingData]);

  return (
    <div className="home min-h-screen text-black flex items-center flex-col">
      <section className="w-full">
        <div className="flex flex-wrap items-center bg-white py-3 px-8 shadow-sm">
          <div className="flex-1 items-center text-right">
            <span><b>Today:</b> {dateStr}</span>&nbsp;&nbsp;
            <span><b>Last Update:</b> {lastUpdate}</span>
          </div>
        </div>
        <div className="w-full rounded-lg shadow-lg p-4 mb-16 overflow-x-auto">
          <table className="w-full border border-grey setting-table">
            <thead>
              <tr className="text-md tracking-wide text-left text-gray-900 bg-gray-100 border-b border-gray-600">
                <th className="px-2 py-2 text-center">Broker</th>
                <th className="px-2 py-2 text-center">Amount</th>
                <th className="px-2 py-2 text-center bg-red-400">No Auto Action Stocks</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {holdingData.map((row, index) => {
                return (<tr className="text-gray-700" key={index}>
                    <td className="text-center px-4 py-3 text-md border">
                      {"Earmarked Capital (in lakhs)"}
                    </td>
                    <td className="text-md font-bold border">
                      <input type="number" className="text-center text-md"></input>
                    </td>
                    <td className="text-center text-md font-bold border">
                      <Select
                        className="select-stock"
                        placeholder="Stock"
                        options={stocks}
                        onChange={(value) => {
                          setFilterStock(new Set([value]));
                        }}
                      ></Select>
                    </td>
                  </tr>);
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default React.memo(Home)

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
}
