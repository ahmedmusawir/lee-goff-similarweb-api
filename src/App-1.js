import './App.scss';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [domainName, setDomainName] = useState('');
  const [data, setData] = useState([]);

  const getApiData = (e) => {
    const options = {
      method: 'GET',
      url: 'https://similar-web.p.rapidapi.com/get-analysis',
      params: { domain: domainName },
      headers: {
        'X-RapidAPI-Key': '7fe701ab34mshb5fbb7b29ae9accp1485a6jsna5fab91f7aed',
        'X-RapidAPI-Host': 'similar-web.p.rapidapi.com',
      },
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data.EstimatedMonthlyVisits);
        const apiData = response.data.EstimatedMonthlyVisits;
        setData(apiData);
        console.log('API Data:', apiData);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Lee Goff Lead Calculator</h1>
      </header>
      <main className='App-container'>
        <section className='form-box'>
          <input type='text' onChange={(e) => setDomainName(e.target.value)} />
          <button onClick={getApiData}>Get Data</button>
        </section>
        <section className='display-box'>
          <div className='display-box-content'>
            API Data comes here...
            {/* {data && data.map((item) => <li>{item}</li>)} */}
            {data &&
              Object.entries(data).forEach(([key, value]) => {
                console.log(`${key}: ${value}`); // 2022-10-01: 2469136403 etc.
              })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
