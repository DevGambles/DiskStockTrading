import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "next-auth/react";
import LogBook from "@/models/logbookModel";
import User from "@/models/userModel";
import connectDb from '@/utils/connectDb'
import { format } from 'date-fns';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parsing to handle multipart uploads
  },
};

// get mis page info
export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  if (req.method === 'GET') {
    const session = await getSession({ req });
    if(session?.user) {
      await connectDb();
      var curUser = await User.findOne({email : session?.user.email});
      var data = await LogBook.find({userId: curUser._id}).sort({Time: -1});
      let dailyReports: any[] = [];
      let monthlyReports: any[] = [];
      let stockReports: any[] = [];
      let totalGains = 0;
      let totalProfits = 0;
      let totalLosses = 0;
      let profitCount = 0;
      let lossCount = 0;
      data.forEach(row => {
        totalGains += row.Profit;
        if(row.Profit > 0) {
          profitCount ++;
          totalProfits += row.Profit;
        }else {
          lossCount ++;
          totalLosses += Math.abs(row.Profit);
        }
        const logDate = new Date(row.Time).toISOString().split("T")[0];
        const logMonth = logDate.split("-").slice(0, 2).join("-");
        const dailyReportIndex = dailyReports.findIndex(report => report.date == logDate);
        if(dailyReportIndex >= 0) {
          dailyReports[dailyReportIndex].gains += row.Profit;
        }else {
          dailyReports.push({
            date: logDate,
            gains: row.Profit
          });
        }
        
        // calculate monthly report
        const monthlyReportIndex = monthlyReports.findIndex(report => report.month == logMonth);
        if(monthlyReportIndex >= 0) {
          monthlyReports[monthlyReportIndex].gains += row.Profit;
        }else {
          monthlyReports.push({
            month: logMonth,
            gains: row.Profit
          });
        }
  
        // calculate stock base report
        const stockReportIndex = stockReports.findIndex(report => report.stock == row.Instrument);
        if(stockReportIndex >= 0) {
          if(row.Profit > 0) {
            stockReports[stockReportIndex].gains += row.Profit;
            stockReports[stockReportIndex].profits += row.Profit;
          }else {
            stockReports[stockReportIndex].gains += row.Profit;
            stockReports[stockReportIndex].losses += Math.abs(row.Profit);
          }
        }else {
          if(row.Profit > 0) {
            stockReports.push({
              stock: row.Instrument,
              gains: row.Profit,
              profits: row.Profit,
              losses: 0
            });
          }else {
            stockReports.push({
              stock: row.Instrument,
              gains: row.Profit,
              profits: 0,
              losses: Math.abs(row.Profit)
            });
          }
        }
      });
      let analyticReport = {
        tradeCount: data.length,
        realizedGains: Math.round(totalGains / 100000),
        realizedROI: 11.4,
        unrealizedGains: 9.56,
        totalGains: Math.round(totalGains / 100000) + 9.56,
        totalInvestment: 824.35,
        capitalInvested: 183,
        transactionCount: data.length,
      };
      const totalReport = {
        gains: totalGains,
        profits: totalProfits,
        losses: totalLosses * -1
      };
      let mainReport = [{
        avgHoldingDays: 271,
        tradeCount: profitCount,
        percent: Math.round(profitCount*1.0 / data.length * 100),
        amount: 11
      }, {
        avgHoldingDays: 269,
        tradeCount: lossCount,
        percent: Math.round(lossCount*1.0 / data.length * 100),
        amount: -3.46
      }];
      res.status(200).json({ 
        dailyReports, monthlyReports,
        stockReports: stockReports.sort((x, y) => y.gains - x.gains),
        analyticReport, mainReport, totalReport
      });
    }else {
      res.status(403).json({ error: 'User is not logged in'});
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}