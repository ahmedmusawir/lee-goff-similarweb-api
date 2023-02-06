import './App.scss';
import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import info from './data/similarWebData';

function App() {
  const [domainName, setDomainName] = useState('');
  const [data, setData] = useState([]);
  const [lastDateListed, setLastDateListed] = useState('');
  const [lastVisitNumberListed, setLastVisitNumberListed] = useState('');

  const getApiData = (e) => {
    // console.log('DATA:', info[0].EstimatedMonthlyVisits);
    const obj = info[0].EstimatedMonthlyVisits;
    // console.log('MONTHLY VISITS:', obj);
    const keys = Object.keys(obj);
    console.log('KEYs:', keys);
    const lastDate = keys.pop();
    const lastVisitDate = moment(lastDate).format('MMMM D, YYYY');
    console.log('LAST DATE', lastVisitDate);
    setLastDateListed(lastVisitDate);
    const lastItemInApiData = obj[keys.pop()];
    const lastVisitNumber = lastItemInApiData
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    console.log('LAST VISITS', lastVisitNumber);
    setLastVisitNumberListed(lastVisitNumber);
  };
  // const getApiData = (e) => {
  //   const options = {
  //     method: 'GET',
  //     url: 'https://similar-web.p.rapidapi.com/get-analysis',
  //     params: { domain: domainName },
  //     headers: {
  //       'X-RapidAPI-Key': '7fe701ab34mshb5fbb7b29ae9accp1485a6jsna5fab91f7aed',
  //       'X-RapidAPI-Host': 'similar-web.p.rapidapi.com',
  //     },
  //   };

  //   axios
  //     .request(options)
  //     .then(function (response) {
  //       const apiData = response.data.EstimatedMonthlyVisits;
  //       setData(apiData);
  //       console.log('API Data:', apiData);
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // };

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
            {/* {data &&
              Object.entries(data).forEach(([key, value]) => {
                console.log(`${key}: ${value}`); // 2022-10-01: 2469136403 etc.
                <li>{`${key}: ${value}`}</li>;
              })} */}
            {data && console.log('Data in Return', data)}
            {/* {data && data.map((item) => <h5>{item.EstimatedMonthlyVisits}</h5>)} */}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
