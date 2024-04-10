import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "next-auth/react";
import User, { UserType } from "@/models/userModel";
import connectDb from '@/utils/connectDb'

export const config = {
  api: {
    bodyParser: false, // Disable the default body parsing to handle multipart uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await getSession({req});
    let user: UserType | null = null;
    if (req.query.id == 'me')
      user = await User.findOne({email : session?.user.email});
    else 
      user = await User.findById(req.query.id);
    res.status(200).json({ data: user });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}