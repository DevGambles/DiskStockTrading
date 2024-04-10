import * as R from "ramda";
import styled from "styled-components";
import { NextPageContext } from "next";
import { useSession, signOut, getSession } from "next-auth/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { ToastContainer, toast } from 'react-toastify';
import DataTable from "react-data-table-component";
import Select from "react-select";
import { never, string, unknown } from "zod";
import moment from "moment";

interface Report {
  analyticReport?: {
      tradeCount?: any;
      // Add other properties as needed
      realizedGains?: any;
      realizedROI?: any;
      unrealizedGains?: any;
      totalGains?: any;
      totalInvestment?: any;
      capitalInvested?: any;
      transactionCount?: any;
  };
  totalReport?: any;
  dailyReports?: any;
  monthlyReports?: any;
  stockReports?: any;
  mainReport?: any;
}

export default function LogBook() {

  const [reportInfo, setReportInfo] = useState<Report>({});
  const [reportTab, setReportTab] = useState("date");

  // initialize page
  const fetchOrderData = async () => {
    if (Object.keys(reportInfo).length == 0) {
      const res = await fetch("/api/mis", {
        method: "GET",
      });

      const response = await res.json();
      if(response) {
        setReportInfo(response);
      }
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  return (
    <div className="home min-h-screen text-black flex items-center flex-col">
      <section className="w-full">
        <div className="w-full py-8 px-8 mb-16 overflow-hidden rounded-lg shadow-lg">
          <div className="w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 border border-gray-200 shadow flex gap-3">
              <div className="w-14 h-14 flex justify-center items-center border rounded-full" style={{borderColor: "#F0F5FF"}}>
                <div className="w-12 h-12 flex justify-center items-center rounded-full" style={{backgroundColor: "#F0F5FF"}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Bold / Business, Statistic / Chart 2">
                    <g id="Vector">
                    <path d="M17.2929 2.29289C17 2.58579 17 3.05719 17 4V17C17 17.9428 17 18.4142 17.2929 18.7071C17.5858 19 18.0572 19 19 19C19.9428 19 20.4142 19 20.7071 18.7071C21 18.4142 21 17.9428 21 17V4C21 3.05719 21 2.58579 20.7071 2.29289C20.4142 2 19.9428 2 19 2C18.0572 2 17.5858 2 17.2929 2.29289Z" fill="#005CEC"/>
                    <path d="M10 7C10 6.05719 10 5.58579 10.2929 5.29289C10.5858 5 11.0572 5 12 5C12.9428 5 13.4142 5 13.7071 5.29289C14 5.58579 14 6.05719 14 7V17C14 17.9428 14 18.4142 13.7071 18.7071C13.4142 19 12.9428 19 12 19C11.0572 19 10.5858 19 10.2929 18.7071C10 18.4142 10 17.9428 10 17V7Z" fill="#005CEC"/>
                    <path d="M3.29289 9.29289C3 9.58579 3 10.0572 3 11V17C3 17.9428 3 18.4142 3.29289 18.7071C3.58579 19 4.05719 19 5 19C5.94281 19 6.41421 19 6.70711 18.7071C7 18.4142 7 17.9428 7 17V11C7 10.0572 7 9.58579 6.70711 9.29289C6.41421 9 5.94281 9 5 9C4.05719 9 3.58579 9 3.29289 9.29289Z" fill="#005CEC"/>
                    <path d="M3 21.25C2.58579 21.25 2.25 21.5858 2.25 22C2.25 22.4142 2.58579 22.75 3 22.75H21C21.4142 22.75 21.75 22.4142 21.75 22C21.75 21.5858 21.4142 21.25 21 21.25H3Z" fill="#005CEC"/>
                    </g>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold mb-2">{reportInfo?.analyticReport?.tradeCount}</span>
                <p className="mb-0 uppercase text-sm">Total No of Trades</p>
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-200 shadow flex gap-3">
              <div className="w-14 h-14 flex justify-center items-center border rounded-full" style={{borderColor: "#F8F5FF"}}>
                <div className="w-12 h-12 flex justify-center items-center rounded-full" style={{backgroundColor: "#F8F5FF"}}>                  
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Bold / Money / Card Send">
                    <g id="Vector">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.4697 13.4697C18.7626 13.1768 19.2374 13.1768 19.5303 13.4697L21.5303 15.4697C21.8232 15.7626 21.8232 16.2374 21.5303 16.5303C21.2374 16.8232 20.7626 16.8232 20.4697 16.5303L19.75 15.8107V20C19.75 20.4142 19.4142 20.75 19 20.75C18.5858 20.75 18.25 20.4142 18.25 20V15.8107L17.5303 16.5303C17.2374 16.8232 16.7626 16.8232 16.4697 16.5303C16.1768 16.2374 16.1768 15.7626 16.4697 15.4697L18.4697 13.4697Z" fill="#8B54F7"/>
                    <path d="M10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C21.672 6.01511 21.9082 7.22882 21.9743 9.25H2.02572C2.09185 7.22882 2.32803 6.01511 3.17157 5.17157C4.34315 4 6.22876 4 10 4Z" fill="#8B54F7"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 20H14C15.0559 20 15.964 20 16.75 19.9743V18.2362C16.2601 18.1817 15.7847 17.9666 15.409 17.591C14.5303 16.7123 14.5303 15.2877 15.409 14.409L17.409 12.409C18.2877 11.5303 19.7123 11.5303 20.591 12.409L21.9937 13.8118C22 13.2613 22 12.6595 22 12C22 11.5581 22 11.142 21.9981 10.75H2.00189C2 11.142 2 11.5581 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20ZM5.25 16C5.25 15.5858 5.58579 15.25 6 15.25H10C10.4142 15.25 10.75 15.5858 10.75 16C10.75 16.4142 10.4142 16.75 10 16.75H6C5.58579 16.75 5.25 16.4142 5.25 16ZM12.5 15.25C12.0858 15.25 11.75 15.5858 11.75 16C11.75 16.4142 12.0858 16.75 12.5 16.75H14C14.4142 16.75 14.75 16.4142 14.75 16C14.75 15.5858 14.4142 15.25 14 15.25H12.5Z" fill="#8B54F7"/>
                    </g>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold mb-2">{reportInfo?.analyticReport?.realizedGains.toFixed(2)}</span>
                <p className="mb-0 uppercase text-sm">realized gains (in lakh)</p>
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-200 shadow flex gap-3">
              <div className="w-14 h-14 flex justify-center items-center border rounded-full" style={{borderColor: "#EDFDF8"}}>
                <div className="w-12 h-12 flex justify-center items-center rounded-full" style={{backgroundColor: "#F0F5FF"}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C21.672 6.01511 21.9082 7.22882 21.9743 9.25H2.02572C2.09185 7.22882 2.32803 6.01511 3.17157 5.17157C4.34315 4 6.22876 4 10 4Z" fill="#08875D"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M21.9995 12.8175L21.591 12.409C20.7123 11.5303 19.2877 11.5303 18.409 12.409L17.6076 13.2104C17.2878 12.3573 16.4648 11.75 15.5 11.75C14.2574 11.75 13.25 12.7574 13.25 14V15.7638C12.7601 15.8183 12.2847 16.0334 11.909 16.409C11.0303 17.2877 11.0303 18.7123 11.909 19.591L12.318 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12C2 11.5581 2 11.142 2.00189 10.75H21.9981C22 11.142 22 11.5581 22 12C22 12.283 22 12.5553 21.9995 12.8175ZM6 15.25C5.58579 15.25 5.25 15.5858 5.25 16C5.25 16.4142 5.58579 16.75 6 16.75H10C10.4142 16.75 10.75 16.4142 10.75 16C10.75 15.5858 10.4142 15.25 10 15.25H6Z" fill="#08875D"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M15.5 13.25C15.9142 13.25 16.25 13.5858 16.25 14V18.1893L16.9697 17.4697C17.2626 17.1768 17.7374 17.1768 18.0303 17.4697C18.3232 17.7626 18.3232 18.2374 18.0303 18.5303L16.0303 20.5303C15.7374 20.8232 15.2626 20.8232 14.9697 20.5303L12.9697 18.5303C12.6768 18.2374 12.6768 17.7626 12.9697 17.4697C13.2626 17.1768 13.7374 17.1768 14.0303 17.4697L14.75 18.1893V14C14.75 13.5858 15.0858 13.25 15.5 13.25ZM19.4697 13.4697C19.7626 13.1768 20.2374 13.1768 20.5303 13.4697L22.5303 15.4697C22.8232 15.7626 22.8232 16.2374 22.5303 16.5303C22.2374 16.8232 21.7626 16.8232 21.4697 16.5303L20.75 15.8107V20C20.75 20.4142 20.4142 20.75 20 20.75C19.5858 20.75 19.25 20.4142 19.25 20V15.8107L18.5303 16.5303C18.2374 16.8232 17.7626 16.8232 17.4697 16.5303C17.1768 16.2374 17.1768 15.7626 17.4697 15.4697L19.4697 13.4697Z" fill="#08875D"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold mb-2">{reportInfo?.analyticReport?.realizedROI}%</span>
                <p className="mb-0 uppercase text-sm">realized roi</p>
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-200 shadow flex gap-3">
              <div className="w-14 h-14 flex justify-center items-center border rounded-full" style={{borderColor: "#FFF8EB"}}>
                <div className="w-12 h-12 flex justify-center items-center rounded-full" style={{backgroundColor: "#FFF8EB"}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.4697 20.5303C18.7626 20.8232 19.2374 20.8232 19.5303 20.5303L21.5303 18.5303C21.8232 18.2374 21.8232 17.7626 21.5303 17.4697C21.2374 17.1768 20.7626 17.1768 20.4697 17.4697L19.75 18.1893V14C19.75 13.5858 19.4142 13.25 19 13.25C18.5858 13.25 18.25 13.5858 18.25 14V18.1893L17.5303 17.4697C17.2374 17.1768 16.7626 17.1768 16.4697 17.4697C16.1768 17.7626 16.1768 18.2374 16.4697 18.5303L18.4697 20.5303Z" fill="#B25E09"/>
                    <path d="M10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C21.672 6.01511 21.9082 7.22882 21.9743 9.25H2.02572C2.09185 7.22882 2.32803 6.01511 3.17157 5.17157C4.34315 4 6.22876 4 10 4Z" fill="#B25E09"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 20H14C14.6595 20 15.2613 20 15.8118 19.9937L15.409 19.591C14.5303 18.7123 14.5303 17.2877 15.409 16.409C15.7847 16.0334 16.2601 15.8183 16.75 15.7638V14C16.75 12.7574 17.7574 11.75 19 11.75C20.2426 11.75 21.25 12.7574 21.25 14V15.7638C21.4739 15.7887 21.6947 15.8471 21.9044 15.9391C22 14.9172 22 13.636 22 12C22 11.5581 22 11.142 21.9981 10.75H2.00189C2 11.142 2 11.5581 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20ZM6 15.25C5.58579 15.25 5.25 15.5858 5.25 16C5.25 16.4142 5.58579 16.75 6 16.75H10C10.4142 16.75 10.75 16.4142 10.75 16C10.75 15.5858 10.4142 15.25 10 15.25H6ZM12.5 15.25C12.0858 15.25 11.75 15.5858 11.75 16C11.75 16.4142 12.0858 16.75 12.5 16.75H14C14.4142 16.75 14.75 16.4142 14.75 16C14.75 15.5858 14.4142 15.25 14 15.25H12.5Z" fill="#B25E09"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold mb-2">{reportInfo?.analyticReport?.unrealizedGains.toFixed(2)}</span>
                <p className="mb-0 uppercase text-sm">unrealized gains</p>
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-200 shadow flex gap-3">
              <div className="w-14 h-14 flex justify-center items-center border rounded-full" style={{borderColor: "#EDFDF8"}}>
                <div className="w-12 h-12 flex justify-center items-center rounded-full" style={{backgroundColor: "#EDFDF8"}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.052 1.25H11.948C11.0495 1.24997 10.3003 1.24995 9.70552 1.32991C9.07773 1.41432 8.51093 1.59999 8.05546 2.05546C7.59999 2.51093 7.41432 3.07773 7.32991 3.70552C7.27259 4.13189 7.25637 5.15147 7.25179 6.02566C5.22954 6.09171 4.01536 6.32778 3.17157 7.17157C2 8.34315 2 10.2288 2 14C2 17.7712 2 19.6569 3.17157 20.8284C4.34314 22 6.22876 22 9.99998 22H14C17.7712 22 19.6569 22 20.8284 20.8284C22 19.6569 22 17.7712 22 14C22 10.2288 22 8.34315 20.8284 7.17157C19.9846 6.32778 18.7705 6.09171 16.7482 6.02566C16.7436 5.15147 16.7274 4.13189 16.6701 3.70552C16.5857 3.07773 16.4 2.51093 15.9445 2.05546C15.4891 1.59999 14.9223 1.41432 14.2945 1.32991C13.6997 1.24995 12.9505 1.24997 12.052 1.25ZM15.2479 6.00188C15.2434 5.15523 15.229 4.24407 15.1835 3.9054C15.1214 3.44393 15.0142 3.24644 14.8839 3.11612C14.7536 2.9858 14.5561 2.87858 14.0946 2.81654C13.6116 2.7516 12.964 2.75 12 2.75C11.036 2.75 10.3884 2.7516 9.90539 2.81654C9.44393 2.87858 9.24644 2.9858 9.11612 3.11612C8.9858 3.24644 8.87858 3.44393 8.81654 3.9054C8.771 4.24407 8.75661 5.15523 8.75208 6.00188C9.1435 6 9.55885 6 10 6H14C14.4412 6 14.8565 6 15.2479 6.00188ZM12 9.25C12.4142 9.25 12.75 9.58579 12.75 10V10.0102C13.8388 10.2845 14.75 11.143 14.75 12.3333C14.75 12.7475 14.4142 13.0833 14 13.0833C13.5858 13.0833 13.25 12.7475 13.25 12.3333C13.25 11.9493 12.8242 11.4167 12 11.4167C11.1758 11.4167 10.75 11.9493 10.75 12.3333C10.75 12.7174 11.1758 13.25 12 13.25C13.3849 13.25 14.75 14.2098 14.75 15.6667C14.75 16.857 13.8388 17.7155 12.75 17.9898V18C12.75 18.4142 12.4142 18.75 12 18.75C11.5858 18.75 11.25 18.4142 11.25 18V17.9898C10.1612 17.7155 9.25 16.857 9.25 15.6667C9.25 15.2525 9.58579 14.9167 10 14.9167C10.4142 14.9167 10.75 15.2525 10.75 15.6667C10.75 16.0507 11.1758 16.5833 12 16.5833C12.8242 16.5833 13.25 16.0507 13.25 15.6667C13.25 15.2826 12.8242 14.75 12 14.75C10.6151 14.75 9.25 13.7903 9.25 12.3333C9.25 11.143 10.1612 10.2845 11.25 10.0102V10C11.25 9.58579 11.5858 9.25 12 9.25Z" fill="#08875D"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold mb-2">{reportInfo?.analyticReport?.totalGains.toFixed(2)}</span>
                <p className="mb-0 uppercase text-sm">total gains</p>
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-200 shadow flex gap-3">
              <div className="w-14 h-14 flex justify-center items-center border rounded-full" style={{borderColor: "#FFF8EB"}}>
                <div className="w-12 h-12 flex justify-center items-center rounded-full" style={{backgroundColor: "#FFF8EB"}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.24502 2H16.755C17.9139 2 18.4933 2 18.9606 2.16261C19.8468 2.47096 20.5425 3.18719 20.842 4.09946C21 4.58055 21 5.17705 21 6.37006V20.3742C21 21.2324 20.015 21.6878 19.3919 21.1176C19.0258 20.7826 18.4742 20.7826 18.1081 21.1176L17.625 21.5597C16.9834 22.1468 16.0166 22.1468 15.375 21.5597C14.7334 20.9726 13.7666 20.9726 13.125 21.5597C12.4834 22.1468 11.5166 22.1468 10.875 21.5597C10.2334 20.9726 9.26659 20.9726 8.625 21.5597C7.98341 22.1468 7.01659 22.1468 6.375 21.5597L5.8919 21.1176C5.52583 20.7826 4.97417 20.7826 4.6081 21.1176C3.985 21.6878 3 21.2324 3 20.3742V6.37006C3 5.17705 3 4.58055 3.15795 4.09946C3.45748 3.18719 4.15322 2.47096 5.03939 2.16261C5.50671 2 6.08614 2 7.24502 2ZM7 6.75C6.58579 6.75 6.25 7.08579 6.25 7.5C6.25 7.91421 6.58579 8.25 7 8.25H7.5C7.91421 8.25 8.25 7.91421 8.25 7.5C8.25 7.08579 7.91421 6.75 7.5 6.75H7ZM10.5 6.75C10.0858 6.75 9.75 7.08579 9.75 7.5C9.75 7.91421 10.0858 8.25 10.5 8.25H17C17.4142 8.25 17.75 7.91421 17.75 7.5C17.75 7.08579 17.4142 6.75 17 6.75H10.5ZM7 10.25C6.58579 10.25 6.25 10.5858 6.25 11C6.25 11.4142 6.58579 11.75 7 11.75H7.5C7.91421 11.75 8.25 11.4142 8.25 11C8.25 10.5858 7.91421 10.25 7.5 10.25H7ZM10.5 10.25C10.0858 10.25 9.75 10.5858 9.75 11C9.75 11.4142 10.0858 11.75 10.5 11.75H17C17.4142 11.75 17.75 11.4142 17.75 11C17.75 10.5858 17.4142 10.25 17 10.25H10.5ZM7 13.75C6.58579 13.75 6.25 14.0858 6.25 14.5C6.25 14.9142 6.58579 15.25 7 15.25H7.5C7.91421 15.25 8.25 14.9142 8.25 14.5C8.25 14.0858 7.91421 13.75 7.5 13.75H7ZM10.5 13.75C10.0858 13.75 9.75 14.0858 9.75 14.5C9.75 14.9142 10.0858 15.25 10.5 15.25H17C17.4142 15.25 17.75 14.9142 17.75 14.5C17.75 14.0858 17.4142 13.75 17 13.75H10.5Z" fill="#B25E09"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold mb-2">{reportInfo?.analyticReport?.totalInvestment.toFixed(2)}</span>
                <p className="mb-0 uppercase text-sm">total investment</p>
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-200 shadow flex gap-3">
              <div className="w-14 h-14 flex justify-center items-center border rounded-full" style={{borderColor: "#F0F5FF"}}>
                <div className="w-12 h-12 flex justify-center items-center rounded-full" style={{backgroundColor: "#F0F5FF"}}>
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="vuesax/bold/moneys">
                    <g id="moneys">
                    <path id="Vector" d="M20.5807 7.33293C20.126 5.03861 18.4238 4.03418 16.0555 4.03418H6.77245C3.98119 4.03418 2.12036 5.4298 2.12036 8.68626V14.1313C2.12036 16.4785 3.0825 17.853 4.66843 18.4451C4.90104 18.5296 5.15479 18.6037 5.41911 18.646C5.84203 18.7411 6.29666 18.7834 6.77245 18.7834H16.066C18.8573 18.7834 20.7181 17.3878 20.7181 14.1313V8.68626C20.7181 8.18934 20.6758 7.74527 20.5807 7.33293ZM6.15922 13C6.15922 13.4335 5.79974 13.793 5.36625 13.793C4.93276 13.793 4.57328 13.4335 4.57328 13V9.82814C4.57328 9.39465 4.93276 9.03517 5.36625 9.03517C5.79974 9.03517 6.15922 9.39465 6.15922 9.82814V13ZM11.414 14.2053C9.87031 14.2053 8.62271 12.9577 8.62271 11.4141C8.62271 9.87043 9.87031 8.62283 11.414 8.62283C12.9576 8.62283 14.2052 9.87043 14.2052 11.4141C14.2052 12.9577 12.9576 14.2053 11.414 14.2053ZM18.2441 13C18.2441 13.4335 17.8846 13.793 17.4511 13.793C17.0176 13.793 16.6581 13.4335 16.6581 13V9.82814C16.6581 9.39465 17.0176 9.03517 17.4511 9.03517C17.8846 9.03517 18.2441 9.39465 18.2441 9.82814V13Z" fill="#005CEC"/>
                    <path id="Vector_2" d="M23.89 11.8582V17.3033C23.89 20.5598 22.0292 21.966 19.2274 21.966H9.94434C9.15137 21.966 8.44298 21.8497 7.82975 21.617C7.33282 21.4373 6.89934 21.173 6.55043 20.8347C6.36012 20.6549 6.50814 20.3694 6.77246 20.3694H16.0555C19.9675 20.3694 22.2935 18.0434 22.2935 14.142V8.68637C22.2935 8.43262 22.579 8.27403 22.7587 8.46434C23.4777 9.22559 23.89 10.3357 23.89 11.8582Z" fill="#005CEC"/>
                    </g>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold mb-2">{reportInfo?.analyticReport?.capitalInvested}</span>
                <p className="mb-0 uppercase text-sm">earmarked capital..</p>
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-200 shadow flex gap-3">
              <div className="w-14 h-14 flex justify-center items-center border rounded-full" style={{borderColor: "#F8F5FF"}}>
                <div className="w-12 h-12 flex justify-center items-center rounded-full" style={{backgroundColor: "#F8F5FF"}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M20.4105 9.86058C20.3559 9.8571 20.2964 9.85712 20.2348 9.85715L20.2194 9.85715H17.8015C15.8086 9.85715 14.1033 11.4382 14.1033 13.5C14.1033 15.5618 15.8086 17.1429 17.8015 17.1429H20.2194L20.2348 17.1429C20.2964 17.1429 20.3559 17.1429 20.4105 17.1394C21.22 17.0879 21.9359 16.4495 21.9961 15.5577C22.0001 15.4992 22 15.4362 22 15.3778L22 15.3619V11.6381L22 11.6222C22 11.5638 22.0001 11.5008 21.9961 11.4423C21.9359 10.5506 21.22 9.91209 20.4105 9.86058ZM17.5872 14.4714C18.1002 14.4714 18.5162 14.0365 18.5162 13.5C18.5162 12.9635 18.1002 12.5286 17.5872 12.5286C17.0741 12.5286 16.6581 12.9635 16.6581 13.5C16.6581 14.0365 17.0741 14.4714 17.5872 14.4714Z" fill="#8B54F7"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M20.2341 18.6C20.3778 18.5963 20.4866 18.7304 20.4476 18.8699C20.2541 19.562 19.947 20.1518 19.4542 20.6485C18.7329 21.3755 17.8183 21.6981 16.6882 21.8512C15.5902 22 14.1872 22 12.4158 22H10.3794C8.60803 22 7.20501 22 6.10697 21.8512C4.97692 21.6981 4.06227 21.3755 3.34096 20.6485C2.61964 19.9215 2.29953 18.9997 2.1476 17.8608C1.99997 16.7541 1.99999 15.3401 2 13.5548V13.4452C1.99998 11.6599 1.99997 10.2459 2.1476 9.13924C2.29953 8.00031 2.61964 7.07848 3.34096 6.35149C4.06227 5.62451 4.97692 5.30188 6.10697 5.14876C7.205 4.99997 8.60802 4.99999 10.3794 5L12.4158 5C14.1872 4.99998 15.5902 4.99997 16.6882 5.14876C17.8183 5.30188 18.7329 5.62451 19.4542 6.35149C19.947 6.84817 20.2541 7.43804 20.4476 8.13012C20.4866 8.26959 20.3778 8.40376 20.2341 8.4L17.8015 8.40001C15.0673 8.40001 12.6575 10.5769 12.6575 13.5C12.6575 16.4231 15.0673 18.6 17.8015 18.6L20.2341 18.6ZM5.61446 8.88572C5.21522 8.88572 4.89157 9.21191 4.89157 9.61429C4.89157 10.0167 5.21522 10.3429 5.61446 10.3429H9.46988C9.86912 10.3429 10.1928 10.0167 10.1928 9.61429C10.1928 9.21191 9.86912 8.88572 9.46988 8.88572H5.61446Z" fill="#8B54F7"/>
                    <path d="M7.77668 4.02439L9.73549 2.58126C10.7874 1.80625 12.2126 1.80625 13.2645 2.58126L15.2336 4.03197C14.4103 3.99995 13.4909 3.99998 12.4829 4H10.3123C9.39123 3.99998 8.5441 3.99996 7.77668 4.02439Z" fill="#8B54F7"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold mb-2">{reportInfo?.analyticReport?.transactionCount}</span>
                <p className="mb-0 uppercase text-sm">no of transactions</p>
              </div>
            </div>
          </div>

          <div className="w-full flex gap-4 mt-4">
            <div className="flex-1">
              <div className="w-full bg-white border border-gray-200 shadow flex flex-wrap mb-4 h-20">
                <div className="w-full md:w-2/5 flex items-center">
                  <div className="w-3/5 uppercase text-sm font-bold p-4">
                    Trades with Gain
                  </div>
                  <div className="w-2/5 inline-flex items-center border-l-2 px-4 py-2 justify-center text-base font-semibold" style={{borderColor: "#E9E9E9", color: "#238700"}}>
                    {reportInfo?.mainReport ? reportInfo?.mainReport[0]?.amount.toFixed(2) : 0}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M7.99609 0.670471C7.82228 0.67322 7.65642 0.743749 7.53385 0.867014L4.20182 4.19909C4.13546 4.2598 4.08207 4.33329 4.04485 4.41517C4.00764 4.49704 3.98738 4.58562 3.98529 4.67553C3.9832 4.76544 3.99931 4.85484 4.03268 4.93836C4.06604 5.02188 4.11595 5.09778 4.17942 5.1615C4.24288 5.22523 4.31858 5.27544 4.40196 5.30914C4.48534 5.34285 4.57468 5.35938 4.6646 5.35766C4.75452 5.35594 4.84316 5.33602 4.9252 5.29915C5.00723 5.26227 5.08095 5.20916 5.14193 5.14305L7.33203 2.95294L7.33737 14.6613C7.34124 14.8356 7.41318 15.0013 7.53778 15.1232C7.66238 15.2451 7.82975 15.3134 8.00404 15.3134C8.17833 15.3134 8.3457 15.2451 8.4703 15.1232C8.5949 15.0013 8.66684 14.8356 8.67071 14.6613L8.66537 2.93994L10.8646 5.14305C10.9907 5.26389 11.1591 5.33055 11.3337 5.32875C11.5084 5.32695 11.6754 5.25685 11.799 5.13344C11.9226 5.01002 11.9929 4.8431 11.9949 4.66846C11.997 4.49381 11.9306 4.32536 11.8099 4.19909L8.47787 0.867014C8.41484 0.803633 8.33971 0.7536 8.25694 0.719837C8.17418 0.686074 8.08547 0.669263 7.99609 0.670471Z" fill="#238700"/>
                    </svg>
                  </div>
                </div>
                <div className="w-1/3 md:w-1/5 flex flex-col justify-center pl-4 border-l-2 border-white" style={{background: "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgb(3 149 136 / 30%) 100%)"}}>
                  <p className="mb-2 uppercase text-xs font-bold">Avg Holding Days</p>
                  <span className="text-base font-bold" style={{color: "#088479"}}>{reportInfo?.mainReport ? reportInfo?.mainReport[0]?.avgHoldingDays : 0}</span>
                </div>
                <div className="w-1/3 md:w-1/5 flex flex-col justify-center pl-4 border-l-2 border-white" style={{background: "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgb(3 149 136 / 30%) 100%)"}}>
                  <p className="mb-2 uppercase text-xs font-bold">No of Trades</p>
                  <span className="text-base font-bold" style={{color: "#088479"}}>{reportInfo?.mainReport ? reportInfo?.mainReport[0]?.tradeCount : 0}</span>
                </div>
                <div className="w-1/3 md:w-1/5 flex flex-col justify-center pl-4 border-l-2 border-white" style={{background: "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgb(3 149 136 / 30%) 100%)"}}>
                  <p className="mb-2 uppercase text-xs font-bold">% of Total</p>
                  <span className="text-base font-bold" style={{color: "#088479"}}>{reportInfo?.mainReport ? reportInfo?.mainReport[0]?.percent : 0}</span>
                </div>
              </div>

              <div className="w-full bg-white border border-gray-200 shadow flex flex-wrap mb-4 h-20">
                <div className="w-full md:w-2/5 flex items-center">
                  <div className="w-3/5 uppercase text-sm font-bold p-4">
                    Trades with loss
                  </div>
                  <div className="w-2/5 inline-flex items-center border-l-2 px-4 py-2 justify-center text-base font-semibold" style={{borderColor: "#E9E9E9", color: "#8C0101"}}>
                    {reportInfo?.mainReport ? reportInfo?.mainReport[1]?.amount.toFixed(2) : 0}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M7.98364 15.3134C8.15745 15.3107 8.32332 15.2401 8.44588 15.1169L11.7779 11.7848C11.8443 11.7241 11.8977 11.6506 11.9349 11.5687C11.9721 11.4868 11.9924 11.3983 11.9944 11.3084C11.9965 11.2184 11.9804 11.1291 11.9471 11.0455C11.9137 10.962 11.8638 10.8861 11.8003 10.8224C11.7369 10.7587 11.6612 10.7085 11.5778 10.6747C11.4944 10.641 11.4051 10.6245 11.3151 10.6262C11.2252 10.6279 11.1366 10.6479 11.0545 10.6847C10.9725 10.7216 10.8988 10.7747 10.8378 10.8408L8.6477 13.031L8.64236 1.32258C8.6385 1.14833 8.56656 0.982543 8.44196 0.860675C8.31735 0.738806 8.14999 0.670514 7.9757 0.670514C7.8014 0.670514 7.63404 0.738806 7.50944 0.860674C7.38483 0.982543 7.3129 1.14833 7.30903 1.32258L7.31437 13.0439L5.11515 10.8408C4.98905 10.72 4.82064 10.6533 4.64599 10.6551C4.47135 10.6569 4.30435 10.727 4.18076 10.8504C4.05718 10.9739 3.98683 11.1408 3.98479 11.3154C3.98275 11.4901 4.04918 11.6585 4.16984 11.7848L7.50187 15.1169C7.5649 15.1803 7.64003 15.2303 7.72279 15.264C7.80556 15.2978 7.89427 15.3146 7.98364 15.3134Z" fill="#870000"/>
                    </svg>
                  </div>
                </div>
                <div className="w-1/3 md:w-1/5 flex flex-col justify-center pl-4 border-l-2 border-white" style={{background: "linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(198, 128, 134, 0.3) 100%)"}}>
                  <p className="mb-2 uppercase text-xs font-bold">Avg Holding Days</p>
                  <span className="text-base font-bold" style={{color: "#8C0101"}}>{reportInfo?.mainReport ? reportInfo?.mainReport[1]?.avgHoldingDays : 0}</span>
                </div>
                <div className="w-1/3 md:w-1/5 flex flex-col justify-center pl-4 border-l-2 border-white" style={{background: "linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(198, 128, 134, 0.3) 100%)"}}>
                  <p className="mb-2 uppercase text-xs font-bold">No of Trades</p>
                  <span className="text-base font-bold" style={{color: "#8C0101"}}>{reportInfo?.mainReport ? reportInfo?.mainReport[1]?.tradeCount : 0}</span>
                </div>
                <div className="w-1/3 md:w-1/5 flex flex-col justify-center pl-4 border-l-2 border-white" style={{background: "linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(198, 128, 134, 0.3) 100%)"}}>
                  <p className="mb-2 uppercase text-xs font-bold">% of Total</p>
                  <span className="text-base font-bold" style={{color: "#8C0101"}}>{reportInfo?.mainReport ? reportInfo?.mainReport[1]?.percent : 0}</span>
                </div>
              </div>

              <div className="w-full bg-white border border-gray-200 shadow flex flex-wrap">
                <table className="w-full">
                  <thead>
                    <tr className="text-md tracking-wide text-center text-gray-900">
                      <th className="px-4 py-3 text-left bg-white border uppercase border-gray-400" colSpan={4}>Stock-wise Break down of Gains</th>
                    </tr>
                    <tr className="text-md tracking-wide text-center text-gray-900">
                      <th className="px-4 py-2 text-center uppercase border border-gray-400" style={{backgroundColor: "#FDF3D0"}}>Total</th>
                      <th className="px-4 py-2 text-center uppercase border border-gray-400" style={{backgroundColor: "#FDF3D0"}}>{Math.round(reportInfo?.totalReport?.gains).toLocaleString()}</th>
                      <th className="px-4 py-2 text-center uppercase border border-gray-400" style={{backgroundColor: "#B3F1E7"}}>{Math.round(reportInfo?.totalReport?.profits).toLocaleString()}</th>
                      <th className="px-4 py-2 text-center uppercase border border-gray-400" style={{backgroundColor: "#F2C5C9"}}>{Math.round(reportInfo?.totalReport?.losses).toLocaleString()}</th>
                    </tr>
                    <tr className="text-md tracking-wide text-center text-gray-900 border">
                      <th className="px-4 py-2 text-center uppercase border-gray-400">symbol</th>
                      <th className="px-4 py-2 text-center uppercase border-gray-400">Net Gains</th>
                      <th className="px-4 py-2 text-center uppercase border-gray-400">Profits</th>
                      <th className="px-4 py-2 text-center uppercase border-gray-400">Losses</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {reportInfo.stockReports && reportInfo.stockReports.map((row: any, index: any) => {
                      return (<tr className="text-gray-700" key={index}>
                      <td className="text-center px-4 py-2 text-sm font-medium border" style={{color: "#3569FD"}}>{row.stock}</td>
                      <td className="text-center px-4 py-2 text-sm font-medium border">{Math.round(row.gains).toLocaleString()}</td>
                      <td className="text-center px-4 py-2 text-sm font-medium border" style={{backgroundColor: row.profits > 0 ? "#CDECE7" : "transparent"}}>{Math.round(row.profits).toLocaleString()}</td>
                      <td className="text-center px-4 py-2 text-sm font-medium border" style={{backgroundColor: row.losses > 0 ? "#F2C5C9" : "transparent"}}>{row.losses > 0 ? Math.round(row.losses * -1).toLocaleString() : 0}</td>
                    </tr>);
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <div className="bg-white border border-gray-200 shadow w-full">
                <div className="w-full p-4 pb-3">
                  <div className="inline-flex shadow-sm w-full p-2" style={{backgroundColor: "#F4F4F8"}} role="group">
                    <button onClick={() => setReportTab("date")} className={"flex-1 uppercase px-4 py-3 text-sm font-bold " + (reportTab == "date" ? "text-white" : "text-gray-900")} style={{backgroundColor: reportTab == "date" ? "#039588" : "transparent"}}>
                      Date-Wise
                    </button>
                    <button onClick={() => setReportTab("month")} className={"flex-1 uppercase px-4 py-3 text-sm font-bold " + (reportTab != "date" ? "text-white" : "text-gray-900")} style={{backgroundColor: reportTab != "date" ? "#039588" : "transparent"}}>
                      Month-Wise
                    </button>
                  </div>
                </div>
                {
                  reportTab != "date" ?
                  <div className="w-full">
                    <table className="w-full">
                      <thead>
                        <tr className="text-md tracking-wide text-center text-gray-900">
                          <th className="px-4 py-2 text-left uppercase bg-white" colSpan={2}>Month-wise Break down of Gains	</th>
                        </tr>
                        <tr className="text-md tracking-wide text-center text-gray-900">
                          <th className="w-1/2 px-4 py-2 text-center border border-gray-400 uppercase" style={{backgroundColor: "#FDF3D0"}}>Total</th>
                          <th className="w-1/2 px-4 py-2 text-center border border-gray-400" style={{backgroundColor: "#B3F1E7"}}>{Math.round(reportInfo?.totalReport?.gains).toLocaleString()}</th>
                        </tr>
                        <tr className="text-md tracking-wide text-center text-gray-900">
                          <th className="w-1/2 px-4 py-2 text-center border border-gray-400 uppercase">Month</th>
                          <th className="w-1/2 px-4 py-2 text-center border border-gray-400 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {reportInfo.monthlyReports && reportInfo.monthlyReports.map((row: any, index: any) => {
                          return (<tr className="text-gray-700" key={index}>
                          <td className="text-center px-4 py-2 text-ms font-bold border">{moment(row.month, "YYYY-MM").format('MMM YYYY')}</td>
                          <td className="text-center px-4 py-2 text-ms font-bold border" style={{backgroundColor: row.gains > 0 ? "#B3F1E7" : "#F2C5C9"}}>{Math.round(row.gains).toLocaleString()}</td>
                        </tr>);
                        })}
                      </tbody>
                    </table>
                  </div> :
                  <div className="w-full">
                    <table className="w-full">
                      <thead>
                        <tr className="text-md tracking-wide text-center text-gray-900">
                          <th className="px-4 py-2 text-left uppercase bg-white" colSpan={2}>Date-wise Breakdown of Gains</th>
                        </tr>
                        <tr className="text-md tracking-wide text-center text-gray-900">
                          <th className="w-1/2 px-4 py-2 text-center border border-gray-400 uppercase" style={{backgroundColor: "#FDF3D0"}}>Total</th>
                          <th className="w-1/2 px-4 py-2 text-center border border-gray-400" style={{backgroundColor: reportInfo?.totalReport?.gains > 0 ? "#B3F1E7" : "#F2C5C9"}}>{Math.round(reportInfo?.totalReport?.gains).toLocaleString()}</th>
                        </tr>
                        <tr className="text-md tracking-wide text-center text-gray-900">
                          <th className="w-1/2 px-4 py-2 text-center border border-gray-400 uppercase">Date</th>
                          <th className="w-1/2 px-4 py-2 text-center border border-gray-400 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {reportInfo.dailyReports && reportInfo.dailyReports.map((row: any, index: any) => {
                          return (<tr className="text-gray-700" key={index}>
                          <td className="text-center px-4 py-2 text-ms font-bold border">{moment(row.date).format('DD MMM YYYY')}</td>
                          <td className="text-center px-4 py-2 text-ms font-bold border" style={{backgroundColor: row.gains > 0 ? "#B3F1E7" : "#F2C5C9"}}>{Math.round(row.gains).toLocaleString()}</td>
                        </tr>);
                        })}
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
}
