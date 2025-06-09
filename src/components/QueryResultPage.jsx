import React from 'react';
import { useSearchParams } from 'react-router-dom';
import DisplayResult from './DisplayResult';

function QueryResultPage() {
  const [params] = useSearchParams();
  const start = params.get("start_date");
  const end = params.get("end_date");

  return <DisplayResult startDate={start} endDate={end} />;
}

export default QueryResultPage;