import { NextApiRequest, NextApiResponse } from 'next';
import { fetchData } from '../../utils/fetch';

const contributions = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, year } = req.query;
  const data = await fetchData(String(user), Number(year));
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.json(data);
};

export default contributions;
