import { NextApiRequest, NextApiResponse } from 'next';
import { checkUserExists } from '../../utils/fetch';

const check = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = req.query;
  const data = await checkUserExists(String(user));
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.json(data);
};

export default check;
