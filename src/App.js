import './App.scss';
import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
// import info from './data/similarWebData';

function App() {
  const [domainName, setDomainName] = useState('');
  const percentage = 6;
  const [data, setData] = useState([]);
  const [lastDateListed, setLastDateListed] = useState('');
  const [lastVisitNumberListed, setLastVisitNumberListed] = useState('');
  const [leadNumber, setLeadNumber] = useState('');

  const getFormattedData = (obj) => {
    // console.log('DATA:', info[0].EstimatedMonthlyVisits);

    //COLLECTING DATE
    const keys = Object.keys(obj);
    const lastDate = keys.pop();
    const lastVisitDate = moment(lastDate).format('MMMM D, YYYY');
    // console.log('LAST DATE', lastVisitDate);
    setLastDateListed(lastVisitDate);

    //COLLECTING VISITOR NUMBER
    const lastItemInApiData = obj[keys.pop()];
    const lastVisitNumber = lastItemInApiData
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // console.log('LAST VISITS', lastVisitNumber);
    setLastVisitNumberListed(lastVisitNumber);

    //COLLECTING LEAD NUMBER
    const calculatedLeads = (lastItemInApiData * percentage) / 100;
    const formattedLeads = calculatedLeads
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setLeadNumber(formattedLeads);
  };
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
        const apiData = response.data.EstimatedMonthlyVisits;
        getFormattedData(apiData);
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
            <h3 style={{ color: 'darkred', textDecoration: 'underline' }}>
              SimilarWeb Data
            </h3>
            {lastDateListed && lastVisitNumberListed && leadNumber && (
              <div>
                <h5>{lastDateListed}</h5>
                <h4>{lastVisitNumberListed}</h4>
                <p>(Expected Visitors)</p>
                <div className='generated-leads'>
                  <h4>Lead Generated</h4>
                  {leadNumber}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
