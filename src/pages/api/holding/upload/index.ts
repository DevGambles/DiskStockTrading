import { NextApiRequest, NextApiResponse } from 'next';
import { useSession, getSession } from "next-auth/react";
import busboy, {Busboy, BusboyConfig} from 'busboy';
import fs from 'fs';
import ExcelJS from 'exceljs';
import path from 'path';
import InitHolding from "@/models/initHoldingModel";
import Holding from "@/models/holdingModel";
import LogBook, { LogBookType } from "@/models/logbookModel";
import User from "@/models/userModel";
import connectDb from '@/utils/connectDb';
import { mapRowToLogbook, mapHoldingToNewHolding } from '@/utils';
export const config = {
  api: {
    bodyParser: false, // Disable the default body parsing to handle multipart uploads
  },
};

// upload holding data
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await connectDb();
    let busboyInstance: Busboy = busboy({ headers: req.headers });
    
    // Handle each part of the form data
    busboyInstance.on('field', () => {
      // Handle non-file fields if needed
    });

    busboyInstance.on('file', async (fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
      const session = await getSession({ req });
      if(session?.user) {
        var curUser = await User.findOne({email : session?.user.email});
        // For example, use exceljs to read the file
  
        try {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.read(file);
  
          // Access the worksheet and read the data
          const worksheet = workbook.worksheets[0];
          const rows: any[] = [];
  
          let isHoldingExcel = false;
          worksheet.eachRow(async (row, rowNumber) => {
            const rowData: any[] = [];
            row.eachCell((cell, colNumber) => {
              rowData.push(cell.value);
            });
            
            if (rowData.length > 10) {
              try {
                if (rowData[0] != "Symbol") {
                  const columns = {
                    symbol: 0,
                    isin: 1,
                    sector: 2,
                    quantityAvailable: 3,
                    quantityDiscrepant: 4,
                    quantityLongTerm: 5,
                    averagePrice: 8,
                    previousClosingPrice: 9,
                    unrealizedPL: 10,
                    unrealizedPLPct: 11,
                  };
                  rows.push({
                    Symbol: rowData[columns.symbol],
                    ISIN: rowData[columns.isin],
                    Sector: rowData[columns.sector],
                    QuantityAvailable: rowData[columns.quantityAvailable],
                    QuantityDiscrepant: rowData[columns.quantityDiscrepant],
                    QuantityLongTerm: rowData[columns.quantityLongTerm],
                    AveragePrice: rowData[columns.averagePrice],
                    PreviousClosingPrice: rowData[columns.previousClosingPrice],
                    UnrealizedPL: rowData[columns.unrealizedPL],
                    UnrealizedPLPct: rowData[columns.unrealizedPLPct],
                  });
                }
                else {
                  isHoldingExcel = true;
                }
              }
              catch (e) {
                console.log(e);
              }
            }
          });
  
          if (isHoldingExcel) {
            await InitHolding.deleteMany({userId: curUser._id});
            await Holding.deleteMany({userId: curUser._id});
            var data = await LogBook.find({userId: curUser._id}).sort({Time: 1});
            await LogBook.deleteMany({userId: curUser._id});
            await Promise.all(data.map(async (row, index) => {
              // get new Holding
              var qty = parseInt(row.Qty);
              qty = (row.Type == "BUY" ? qty : -qty);
              var holdingFound = await InitHolding.findOne({
                Symbol: row.Instrument,
                userId: curUser._id
              });
              var holding = mapHoldingToNewHolding(holdingFound.userId, holdingFound, parseInt(row.AvgPrice));

              holding.QuantityAvailable += qty;
              if (isNaN(holding.CurrentInvestment))
                holding.CurrentInvestment = 0;
              holding.CurrentInvestment += logbook.Amount;
              holding.AveragePrice = holding.CurrentInvestment / holding.QuantityAvailable;
              await holding.save();
              var logbook = await mapRowToLogbook(curUser._id, row, holding);
              await logbook.save();
            }));
            // Send the data in the API response
            res.status(200).json({ status: "ok" });
          }
          else
            res.status(500).json({ error: 'Excel read error' });  
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Excel read error' });
        }
      } else {
        res.status(403).json({ error: 'User is not logged in'});
      }
    });

    // Pipe the request to busboy for parsing
    req.pipe(busboyInstance);
  } else {
    res.status(405).json({ error: 'Method not allowed:' + req.method });
  }
}