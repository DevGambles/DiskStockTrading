import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getHoldingData } from "@/utils";

const DiskSettings = () => {

  const [holdingData, setHoldingData] = useState([]);
  
  // initialize
  useEffect(() => {
    const initHoldingData = async () => {
      if(holdingData?.length == 0) {
        const res = await getHoldingData();
        if(res.data.length > 0) {
          setHoldingData(res.data);
        }
      }
    }
    initHoldingData();
  }, [])

  return (
    <div className="home min-h-screen text-black flex items-center flex-col">
      <section className="w-full">
        <div className="w-full rounded-lg shadow-lg p-4 mb-16 overflow-x-auto">
          <table className="w-full border border-grey">
            <thead>
              <tr className="text-md tracking-wide text-left text-gray-900 bg-yellow-100 border-b border-gray-600">
                <th className="px-12 py-2 text-left" colSpan={4}>Stock Universe</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-md font-bold font-bold border" colSpan={2}>Conditions for Alpha</td>
                <td className="text-center px-4 py-3 text-md font-bold font-bold border" colSpan={2}>Stock Stats</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">Alpha sell on 10% drop</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">not used</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">No of Stocks up NOW</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">149</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">BUY when KLevel is below or equal to</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">2</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">% of Stocks UP</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">80%</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">SELL when KLevel is above or equal to</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">5</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">% of Stocks DOWN</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">20%</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">If Loss on SELL, quantity to be </td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">If Gain on SELL, quantity to be </td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">Cool Off Period (days)</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">Stop Loss trigger when depreciation is</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">Alpha as % of Earmarked Capital</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">No of sessions to enter</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">Deep Alpha Hold % of Earmarked</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">no of stocks to invest per session</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">Amount per BUY per stock as a % of Earmarked</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">Minimum Amount of BUY per stock</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">Deep Alpha Hold % of Earmarked</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">stoploss %</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">Max investment per stock of Earmarked Capital</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">{"Difference of V-Level and K-Level to BUY >="}</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">If Appreciation % is more than this, SELL</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">Max investment per stock of Earmarked Capital</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
              <tr className="text-gray-700">
                <td className="text-center px-4 py-3 text-ms font-bold border">Interest rate</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">asd</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default React.memo(DiskSettings)

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
}
