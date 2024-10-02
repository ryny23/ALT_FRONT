// ZenscrapeComponent.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ZenscrapeComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const headers = {
      apikey: '38304d90-80a0-11ef-9130-436e93adce24',
    };

    const options = {
      url: 'https://app.zenscrape.com/api/v1/get?&url=https://www.prc.cm/',
      headers: headers,
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(options.url, { headers });
        setData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Data from Zenscrape</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ZenscrapeComponent;
