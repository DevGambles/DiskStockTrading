import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import React, { useCallback, useEffect, useRef, useState } from "react";

const Invest = () => {
  return (
    <div className="home min-h-screen text-black flex items-center flex-col">
      <section className="w-full">
        <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
          <div className="flex flex-row flex-wrap">
            <table className="m-4">
              <thead>
                <tr className="text-md tracking-wide text-left text-gray-900 bg-yellow-100 border-b border-gray-600">
                  <th className="px-12 py-2 text-left">F&O Stocks</th>
                  <th className="px-12 py-2 text-left">Master List</th>
                  <th className="px-12 py-2 text-left">Alpha</th>
                  <th className="px-12 py-2 text-left">DeepAlpha</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="text-gray-700">
                  <td className="text-left px-4 py-3 text-ms font-bold border">AARTI INDUSTRIES LIMITED</td>
                  <td className="text-left px-4 py-3 text-ms font-bold border">AARTIIND</td>
                  <td className="text-center px-4 py-3 text-ms font-bold border">FALSE</td>
                  <td className="text-center px-4 py-3 text-ms font-bold border">FALSE</td>
                </tr>
              </tbody>
            </table>

            <table className="m-4">
              <thead>
                <tr className="text-md tracking-wide text-left text-gray-900 bg-yellow-100 border-b border-gray-600">
                  <th className="px-12 py-2 text-center">13</th>
                  <th className="px-12 py-2 text-center">TO be CLeared</th>
                  <th className="px-12 py-2 text-center">0.00</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="text-gray-700">
                  <td className="text-center px-4 py-3 text-ms bg-blue-100 font-bold border">Stock</td>
                  <td className="text-center px-4 py-3 text-ms bg-blue-100 font-bold border">K-LEVEL</td>
                  <td className="text-center px-4 py-3 text-ms bg-blue-100 font-bold border">BUY</td>
                </tr>
                <tr className="text-gray-700">
                  <td className="text-center px-4 py-3 text-ms font-bold border">BAJFINANCE</td>
                  <td className="text-center px-4 py-3 text-ms font-bold border">0</td>
                  <td className="text-center px-4 py-3 text-ms font-bold border">0.00</td>
                </tr>
              </tbody>
            </table>

            <table className="m-4">
              <thead>
                <tr className="text-md tracking-wide text-left text-gray-900 bg-yellow-100 border-b border-gray-600">
                  <th className="px-12 py-2 text-center">15 November 2023 16:55 Symbol</th>
                  <th className="px-12 py-2 text-center">Change % from last close</th>
                  <th className="px-12 py-2 text-center">Live price</th>
                  <th className="px-12 py-2 text-center">K- Level</th>
                  <th className="px-12 py-2 text-center">V- Level</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="text-gray-700">
                  <td className="text-left px-4 py-3 text-ms font-bold border">AARTIIND</td>
                  <td className="text-left px-4 py-3 text-ms font-bold border">1</td>
                  <td className="text-center px-4 py-3 text-ms font-bold border">522</td>
                  <td className="text-center px-4 py-3 text-ms font-bold border">6</td>
                  <td className="text-center px-4 py-3 text-ms font-bold border">7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default React.memo(Invest)

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
}
