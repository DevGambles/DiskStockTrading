import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHoldingData } from "@/utils";

const Cal = () => {
  const { holdingData } = useHoldingData();

  return (
    <div className="home min-h-screen text-black flex items-center flex-col">
      <section className="w-full">
        <div className="w-full rounded-lg shadow-lg p-4 mb-16 overflow-x-auto">
          <table className="w-full border border-grey">
            <thead>
              <tr className="text-md tracking-wide text-center text-gray-900">
                <th className="px-4 py-2 text-center bg-white border border-gray-400" colSpan={17}>CALCULATIONS</th>
                <th className="px-4 py-2 text-center bg-gray-300 border border-gray-400" rowSpan={3}>Selected Stocks</th>
              </tr>
              <tr className="text-md tracking-wide text-center text-gray-900">
                <th className="px-4 py-2 text-center border border-gray-400" rowSpan={2}>Stock</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-red-600" colSpan={2}>StopLoss</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-red-300">No Action</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-red-300" colSpan={3}>SELL</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-yellow-100" colSpan={2}>Checks</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-green-100" rowSpan={2}>Buy Amount</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-green-100" rowSpan={2}>Net Trade</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-orange-100" colSpan={5}>Deep Alpha</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-green-100" rowSpan={2}>Final Trade(After Deep Alpha)</th>
              </tr>
              <tr className="text-md tracking-wide text-center text-gray-900">
                <th className="px-4 py-2 text-center border border-gray-400 bg-red-600">StopLoss</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-red-600">StopLoss Amount</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-red-300">Check</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-red-300">Profit or Loss</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-red-300">Above Sell Level</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-red-300">Sell Amount</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-yellow-100">Portfolio Exceed Limit</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-yellow-100">Investible</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-orange-100">Check</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-orange-100">Portfolio Exceed Limit</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-orange-100">Allowed Sell</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-orange-100">Sell Less than Allowed Sell</th>
                <th className="px-4 py-2 text-center border border-gray-400 bg-orange-100">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {holdingData.map((row, index) => {
                return (<tr className="text-gray-700" key={index}>
                <td className="text-center px-4 py-3 text-ms font-bold border">ADANIENT</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">FALSE</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">0</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">FALSE</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">10.00%</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">FALSE</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">0</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">FALSE</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">FALSE</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">0</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">0</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">FALSE</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">FALSE</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">292</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">TRUE</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">0</td>
                <td className="text-center px-4 py-3 text-ms font-bold border">0</td>
                <td className="bg-gray-300 text-center px-4 py-3 text-ms font-bold border">ASIANPAINT</td>
              </tr>);
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default React.memo(Cal)

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
}
