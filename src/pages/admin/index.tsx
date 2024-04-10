import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Select from "react-select";
import { handleError, getCurrentDateStr } from "@/utils";
import useFileUpload from "@/utils/useFileUpload";

const Home = () => {
  const dateStr = useMemo(getCurrentDateStr, []);
  const [lastUpdate, setLastUpdate] = useState("");
  const [holdingData, setHoldingData] = useState([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const onSuccess = async () => {
    getHoldingData();
  };

  const onError = async () => {

  };

  const {handleFileUpload, uploadStatus, uploadedFileName } = useFileUpload("/api/holding/upload", onSuccess, onError);

  // get users list
  const getUserData = async () => {
    if (userData?.length == 0) {
      console.log("GetUser" + userData.length);
      const res = await fetch("/api/admin/users", {
        method: "GET",
      });

      const response = await res.json();
      if (response.data.length > 0)
      {
        let data: any = [];
        response.data.map((row: any, index: any) => {
          data.push({value: row.email, label: row.name});
        });
        setUserData(data);
      }
    }
  };
  
  // handle click upload hoding button
  const handleClick = useCallback(() => {
    fileInput.current?.click();
  }, []);

  // get holding data
  const getHoldingData = async () => {
    let bodyData = {
      'email': selectedUser
    };
    const queryParams = new URLSearchParams(bodyData).toString();
    const res = await fetch(`/api/holding?${queryParams}`, {
      method: "GET",
    });

    const response = await res.json();
    setHoldingData(response.data);
    setLastUpdate(new Date(response.lastUpdate).toLocaleString('en-US'));
  };

  useEffect(() => {
    getHoldingData();
    getUserData();
  }, [])

  return (
    <div className="home min-h-screen text-black flex items-center flex-col">
      <section className="w-full">
        <div className="flex flex-wrap items-center bg-white py-3 px-8 shadow-sm">
          <div className="flex items-center">
            <div className="headerdiv">
              <Select
                placeholder="User Name"
                options={userData}
                onChange={(e: any) => {
                  setSelectedUser(e.value);
                }}
              ></Select>
            </div>
            <input
              type="file"
              ref={fileInput}
              hidden
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
            />
            <button
              className="btn btn-primary ml-2"
              onClick={handleClick}
            >
              {uploadStatus ? "Uploading..." : "Upload Holding"}
            </button>
            <span className="text-md font-bold">&nbsp;{uploadedFileName}</span>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <span><b>Today:</b> {dateStr}</span>&nbsp;&nbsp;
            <span><b>Last Update:</b> {lastUpdate}</span>
          </div>
        </div>
        <div className="w-full rounded-lg shadow-lg p-4 mb-16 overflow-x-auto">
          <table className="w-full border border-grey">
            <thead>
              <tr className="text-md tracking-wide text-left text-gray-900 bg-gray-100 border-b border-gray-600">
                <th className="px-2 py-2 text-center">Symbol</th>
                <th className="px-2 py-2 text-center">Next Action</th>
                <th className="px-2 py-2 text-center">Current Price</th>
                <th className="px-2 py-2 text-center">Current Investment</th>
                <th className="px-2 py-2 text-center">Your gains</th>
                <th className="px-2 py-2 text-center">Average Cost</th>
                <th className="px-2 py-2 text-center">Appreciation%</th>
                <th className="px-2 py-2 text-center">Holdings</th>
                { session?.user.role == "admin" && <th className="px-2 py-2 text-center">LastUpdate</th>}
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
                    <td className="text-right px-4 py-3 text-ms font-bold border">
                      {row['CurrentInvestment']}
                    </td>
                    <td className="text-right px-4 py-3 text-ms font-bold border bg-green-300">
                      {row['UnrealizedPL']}
                    </td>
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
