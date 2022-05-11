import * as Json2CSV from 'json2csv';
import Query from '../../comments/queryModel';
import getSearchTermQuery from '../../comments/suggestedComments/searchTermQueries';

export const getLastQueries = async ({ page, perPage }) => {
  const aggregate = getSearchTermQuery();
  const pipeline = aggregate.pipeline();

  const totalCount = await Query.aggregate([
    ...pipeline,
    { $count: 'totalCount' },
  ]);

  pipeline.push({ $skip: (page - 1) * perPage });
  pipeline.push({ $limit: perPage });

  const queries = await aggregate.exec();

  return {
    totalCount: totalCount[0] ? totalCount[0].totalCount : 0,
    queries,
  };
};

export const exportSearchQueries = async () => {
  const searchQueries = await getSearchTermQuery();

  const mappedData = searchQueries.map((item) => ({
    'Search Term': item._id.searchTerm,
    'Matched Count': item._id.matchedCount,
    'Frequency': item.searchTermFrequencyCount,
  }));

  const { Parser } = Json2CSV;
  const fields = ['Search Term', 'Matched Count', 'Frequency'];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);

  return csv;
};
