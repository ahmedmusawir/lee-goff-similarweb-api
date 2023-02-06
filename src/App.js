import './App.scss';
import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Audio } from 'react-loader-spinner';
// import info from './data/similarWebData';

function App() {
  const [domainName, setDomainName] = useState('');
  const percentage = 6;
  const [data, setData] = useState([]);
  const [lastDateListed, setLastDateListed] = useState('');
  const [lastVisitNumberListed, setLastVisitNumberListed] = useState('');
  const [leadNumber, setLeadNumber] = useState('');
  const [manualVisitorNumber, setManualVisitorNumber] = useState(null);
  const [manualLeadNumber, setManualLeadNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

    //CLEARING MANUAL VISIOR NUMBER
    setManualVisitorNumber('');
    //CLEARING MANUAL LEAD NUMBER
    setManualLeadNumber(null);
  };
  const getApiData = (e) => {
    setIsLoading(true);
    setLeadNumber('');
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
        setIsLoading(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const generateLeadNumber = (e) => {
    const expectedManualVisitors = manualVisitorNumber
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const manuallyGeneratedLeads = (manualVisitorNumber * percentage) / 100;
    const formattedManualLeads = manuallyGeneratedLeads
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setManualLeadNumber(formattedManualLeads);
    setManualVisitorNumber(expectedManualVisitors);
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Lee Goff Lead Calculator</h1>
      </header>
      <main className='App-container'>
        <h4 style={{ textAlign: 'center' }}>
          Generate Lead number by Domain Name...
        </h4>
        <section className='form-box'>
          <input
            type='text'
            onChange={(e) => setDomainName(e.target.value)}
            placeholder='youdomain.com'
          />
          <button onClick={getApiData}>Get Data</button>
        </section>
        <section className='display-box'>
          <div className='display-box-content'>
            <h3 style={{ color: 'darkred', textDecoration: 'underline' }}>
              SimilarWeb Data: <br />
              {domainName}
            </h3>
            {isLoading && (
              <Audio
                height='80'
                width='80'
                radius='9'
                color='dodgerblue'
                ariaLabel='loading'
              />
            )}
            {lastDateListed && lastVisitNumberListed && leadNumber && (
              <div>
                <h5>{lastDateListed}</h5>
                <h4>
                  {lastVisitNumberListed}
                  <br />
                  <small>(Expected Visitors)</small>
                </h4>
                <div className='generated-leads'>
                  <h4>Lead Generated</h4>
                  {leadNumber}
                </div>
              </div>
            )}
            {manualVisitorNumber && manualLeadNumber && (
              <div>
                <h3
                  style={{
                    color: 'darkred',
                    textDecoration: 'underline',
                    marginTop: '4rem',
                  }}
                >
                  Manually Generated Data:
                </h3>
                <h4>
                  {manualVisitorNumber}
                  <br />
                  <small>(Expected Visitors)</small>
                </h4>
                <div className='generated-leads'>
                  <h4>Lead Generated</h4>
                  {manualLeadNumber}
                </div>
              </div>
            )}
          </div>
        </section>
        <h4 style={{ textAlign: 'center' }}>
          Generate Lead number manually...
        </h4>
        <section className='form-box'>
          <input
            type='text'
            onChange={(e) => setManualVisitorNumber(e.target.value)}
            placeholder='Expected Visitor Number'
            value={manualVisitorNumber}
          />
          <button onClick={generateLeadNumber}>Generate Lead</button>
        </section>
      </main>
    </div>
  );
}

export default App;
