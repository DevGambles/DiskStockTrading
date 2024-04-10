import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from 'next/router';
import { Session } from "inspector";
import { getHoldingData, useHoldingData, handleError, getCurrentDateStr } from "@/utils";
import useFileUpload from "@/utils/useFileUpload";

const Home = () => {

  const router = useRouter();
  const dateStr = useMemo(getCurrentDateStr, []);
  const [lastUpdate, setLastUpdate] = useState("");
  const { holdingData, setHoldingData } = useHoldingData();
  const fileInput = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const [ holdingResult, setHoldingResult ] = useState({
    advance: 0,
    investment: 0,
    gain: 0,
    gainToday: 0,
    percent: 0
  });

  const onSuccess = async () => {
    if(holdingData?.length == 0) {
      const res = await getHoldingData();
      if(res.data.length > 0) {
        setHoldingData(res.data);
        setLastUpdate(new Date(res.lastUpdate).toLocaleString('en-US'));
      }
    }
  };

  const onError = async () => {

  };

  const {handleFileUpload, uploadStatus, uploadedFileName } = useFileUpload("/api/holding/upload", onSuccess, onError);

  // handle click upload holding button
  const handleClick = () => {
    if (holdingData.length == 0) {
      fileInput.current?.click();
    }
    else {
      router.push("/settings");
    }
  };

  useEffect(() => {
    var result = {
      advance: 0,
      investment: 0,
      gain: 0,
      gainToday: 0,
      percent: 0
    };
    holdingData.forEach((holding, index) => {
      result.investment += parseFloat(holding['CurrentInvestment']);
      result.gain += parseFloat(holding['UnrealizedPL']);
    });
    result.gain = result.gain / 100000;
    result.percent = result.gain / result.investment;

    result.gain = parseFloat(result.gain.toFixed(2));
    result.percent = parseFloat(result.percent.toFixed(2));
    setHoldingResult(result);
  }, [holdingData]); // Empty dependency array to run the effect only once

  return (
    <div className="home min-h-screen text-black flex items-center flex-col">
      <section className="w-full">
        <div className="flex flex-wrap items-center bg-white py-3 px-8 shadow-sm">
          <div className="flex-1">
            <input
              type="file"
              ref={fileInput}
              hidden
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
            />
            <button
              className="btn btn-primary"
              onClick={handleClick}
            >
              {holdingData.length > 0 ? "Settings" : (uploadStatus ? "Uploading..." : "Upload Holding")}
            </button>
            <span className="text-md font-bold">&nbsp;{uploadedFileName}</span>
          </div>
          <div className="flex items-center">
            <span><b>Today:</b> {dateStr}</span>&nbsp;&nbsp;
            <span><b>Last Update:</b> {lastUpdate}</span>
          </div>
        </div>
        <div className="w-full rounded-lg shadow-lg p-4 mb-16 overflow-x-auto">
          <table className="w-full border border-grey">
            <thead>
              <tr className="text-md tracking-wide text-left text-gray-900 bg-gray-100 border-b border-gray-600">
                <th className="px-2 py-2 text-center bg-yellow-300">Advances<br/>Today</th>
                <th className="px-2 py-2 text-center bg-green-300">{holdingResult.advance??""}%</th>
                <th className="px-2 py-2 text-center bg-yellow-300">Current<br/>Investment</th>
                <th className="px-2 py-2 text-center bg-yellow-300">{holdingResult.investment??""}</th>
                <th className="px-2 py-2 text-center bg-green-300">{holdingResult.gain??""}</th>
                <th className="px-2 py-2 text-center bg-green-300">{holdingResult.gainToday??""}</th>
                <th className="px-2 py-2 text-center"></th>
                <th className="px-2 py-2 text-center bg-green-300">{holdingResult.percent??""}%</th>
                { session?.user.role == "admin" && <th className="px-2 py-2 text-center"></th>}
              </tr>
              <tr className="text-md tracking-wide text-left text-gray-900 bg-gray-100 border-b border-gray-600">
                <th className="px-2 py-2 text-center">Symbol</th>
                <th className="px-2 py-2 text-center">Next Action</th>
                <th className="px-2 py-2 text-center">Current Price</th>
                {/* <th className="px-2 py-2 text-center">K-Level</th>
                <th className="px-2 py-2 text-center">V-Level</th> */}
                <th className="px-2 py-2 text-center">Current Investment</th>
                <th className="px-2 py-2 text-center">Your gains</th>
                {/* <th className="px-2 py-2 text-center">Gains Today</th> */}
                <th className="px-2 py-2 text-center">Average Cost</th>
                <th className="px-2 py-2 text-center">Appreciation%</th>
                <th className="px-2 py-2 text-center">Holdings</th>
                { session?.user.role == "admin" && <th className="px-2 py-2 text-center">LastUpdate</th>
                /* <th className="px-2 py-2 text-center">NAV Live</th>
                <th className="px-2 py-2 text-center">
                  Holding as % of Earmarked
                </th>
                <th className="px-2 py-2 text-center">Theta Earned</th>
                <th className="px-2 py-2 text-center">Dividened Earned</th>
                <th className="px-2 py-2 text-center">
                  Adjusted Average Cost
                </th>
                <th className="px-2 py-2 text-center">Net Gains</th> */}
              </tr>
            </thead>
            <tbody className="bg-white">
              {holdingData.map((row, index) => {
                return (<tr className="text-gray-700" key={index}>
                    <td className="text-center px-4 py-3 text-ms font-bold border">
                      {row['Symbol']}
                    </td>
                    <td className="text-center px-4 py-3 text-ms font-bold border bg-yellow-400">
                      HOLD
                    </td>
                    <td className="text-right px-4 py-3 text-ms font-bold border">
                      {row['PreviousClosingPrice']}
                    </td>
                    {/* <td className="text-center px-4 py-3 text-ms font-bold border bg-yellow-400">
                      -
                    </td>
                    <td className="text-center px-4 py-3 text-ms font-bold border bg-yellow-200">
                      -
                    </td> */}
                    <td className="text-right px-4 py-3 text-ms font-bold border">
                      {row['CurrentInvestment']}
                    </td>
                    <td className="text-right px-4 py-3 text-ms font-bold border bg-green-300">
                      {row['UnrealizedPL']}
                    </td>
                    {/* <td className="text-center px-4 py-3 text-ms font-bold border bg-green-400">
                      -
                    </td> */}
                    <td className="text-right px-4 py-3 text-ms font-bold border bg-green-400">
                      {row['AveragePrice']}
                    </td>
                    <td className="text-right px-4 py-3 text-ms font-bold border bg-green-400">
                      {row['UnrealizedPLPct']}
                    </td>
                    <td className="text-center px-4 py-3 text-ms font-bold border">
                      {row['QuantityAvailable']}
                    </td>
                    {session?.user.role == "admin" && <td className="text-center px-4 py-3 text-ms font-bold border">
                      {new Date(row['updatedAt']).toLocaleString('en-US')}
                    </td>}
                    {/* <td className="text-center px-4 py-3 text-ms font-bold border">
                      -
                    </td>
                    <td className="text-center px-4 py-3 text-ms font-bold border">
                      -
                    </td>
                    <td className="text-center px-4 py-3 text-ms font-bold border">
                      -
                    </td>
                    <td className="text-center px-4 py-3 text-ms font-bold border">
                      -
                    </td>
                    <td className="text-center px-4 py-3 text-ms font-bold border bg-green-400">
                      -
                    </td>
                    <td className="text-center px-4 py-3 text-ms font-bold border bg-green-400">
                      -
                    </td> */}
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
