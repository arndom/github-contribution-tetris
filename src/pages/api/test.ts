import { NextApiRequest, NextApiResponse } from 'next';
import { fetchData } from '../../utils/fetch';

const test = async (req: NextApiRequest, res: NextApiResponse) => {
  // const { username, year } = req.query;
  const data = await fetchData('arndom', 2022);
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.json(data);
};

export default test;
