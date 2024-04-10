import { NextApiRequest, NextApiResponse } from 'next';
import { useSession, getSession } from "next-auth/react";
import busboy, {Busboy, BusboyConfig} from 'busboy';
import ExcelJS from 'exceljs';
import Holding from "@/models/holdingModel";
import User from "@/models/userModel";
import connectDb from '@/utils/connectDb';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parsing to handle multipart uploads
  },
};

// verify holding data
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await connectDb();
    const session = await getSession({req});
    if(session?.user) {
      let busboyInstance: Busboy = busboy({ headers: req.headers });
    
      // Handle each part of the form data
      busboyInstance.on('field', () => {
        // Handle non-file fields if needed
      });
  
      busboyInstance.on('file', async (fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
        const session = await getSession({ req });
  
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
                    Symbol: 0,
                    ISIN: 1,
                    Sector: 2,
                    QuantityAvailable: 3,
                    QuantityDiscrepant: 4,
                    QuantityLongTerm: 5,
                    QuantityPledgedMargin: 6,
                    QuantityPledgedLoan: 7,
                    AveragePrice: 8,
                    PreviousClosingPrice: 9,
                    UnrealizedPL: 10,
                    UnrealizedPLPct: 11,
                  };
                  rows.push({
                    Symbol: rowData[columns.Symbol],
                    ISIN: rowData[columns.ISIN],
                    Sector: rowData[columns.Sector],
                    QuantityAvailable: rowData[columns.QuantityAvailable],
                    QuantityDiscrepant: rowData[columns.QuantityDiscrepant],
                    QuantityLongTerm: rowData[columns.QuantityLongTerm],
                    QuantityPledgedMargin: rowData[columns.QuantityPledgedMargin],
                    QuantityPledgedLoan: rowData[columns.QuantityPledgedLoan],
                    AveragePrice: rowData[columns.AveragePrice],
                    PreviousClosingPrice: rowData[columns.PreviousClosingPrice],
                    UnrealizedPL: rowData[columns.UnrealizedPL],
                    UnrealizedPLPct: rowData[columns.UnrealizedPLPct],
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
  
          let vData: any = [];
          if (isHoldingExcel) {
            await Promise.all(rows.map(async (row, index) => {
              var holdingFound = await Holding.findOne({
                Symbol: row.Symbol,
                userId: curUser._id
              });
              if (holdingFound) {
                row.DiskQuantity = holdingFound.QuantityAvailable;
              }
              vData.push(row);
            }));
            // Send the data in the API response
            res.status(200).json({ status: "ok", data: vData});
          }
          else
            res.status(500).json({ error: 'Excel read error' });  
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Excel read error' });
        }
      });
  
      // Pipe the request to busboy for parsing
      req.pipe(busboyInstance);
    } else {
      res.status(403).json({ error: 'User is not logged in'});
    }
  } else {
    res.status(405).json({ error: 'Method not allowed:' + req.method });
  }
}