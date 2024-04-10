import { NextApiRequest, NextApiResponse } from 'next';
import { useSession, getSession } from "next-auth/react";
import busboy, {Busboy, BusboyConfig} from 'busboy';
import fs from 'fs';
import ExcelJS from 'exceljs';
import path from 'path';
import InitHolding from "@/models/initHoldingModel";
import Holding from "@/models/holdingModel";
import LogBook from "@/models/logbookModel";
import User from "@/models/userModel";
import { buffer } from 'stream/consumers';
import connectDb from '@/utils/connectDb';
import {mapHoldingToNewHolding} from '@/utils';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parsing to handle multipart uploads
  },
};

// get reconsile holding data
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await connectDb();
    const session = await getSession({req});
    if(session?.user) {
      var curUser = await User.findOne({email : session?.user.email});
      let buf: any = await buffer(req);
      buf = buf.toString('utf8');
      if (buf) {
        const rawBody = JSON.parse(buf.toString('utf8'));
          let holdings = rawBody.holdings;
          await Promise.all(holdings.map(async (holding: any, index: any) => {
            var holdingFound = await Holding.findOne({
              Symbol: holding.Symbol,
              userId: curUser._id
            });
            if (holdingFound) {
              holdingFound.QuantityAvailable = holding.QuantityAvailable;
              holdingFound.AveragePrice = holding.AveragePrice;
              await holdingFound.save();
            }
            else {
              var newHolding = mapHoldingToNewHolding(curUser._id, holding, holding.AveragePrice);
              await newHolding.save();
            }
          }));
      }
      res.status(200).json({ status: 'ok'});
    } else {
      res.status(403).json({ error: 'User is not logged in'});
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}