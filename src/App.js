import './App.scss';
import { useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Audio } from 'react-loader-spinner';
import localData from './data/similarWebData';

function App() {
  const [domainName, setDomainName] = useState('');
  const [data, setData] = useState([]);
  const [lastDateListed, setLastDateListed] = useState('');
  const [lastVisitNumberListed, setLastVisitNumberListed] = useState('');
  const [leadNumber_1, setLeadNumber_1] = useState('');
  const [leadNumber_2, setLeadNumber_2] = useState('');
  const [manualVisitorNumber, setManualVisitorNumber] = useState(null);
  const [manualLeadNumber_1, setManualLeadNumber_1] = useState(null);
  const [manualLeadNumber_2, setManualLeadNumber_2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const textInput = useRef();

  const calculatePercentage = (num, percentage) => {
    return Math.ceil((num * percentage) / 100);
  };

  const resetData = () => {
    textInput.current.value = '';
    setLeadNumber_1('');
    setManualLeadNumber_1('');
    setError('');
    setDomainName('');
  };

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

    //COLLECTING LEAD NUMBER ONE
    const calculatedLeads_1 = calculatePercentage(lastItemInApiData, 20);
    const formattedLeads_1 = calculatedLeads_1
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setLeadNumber_1(formattedLeads_1);

    //COLLECTING LEAD NUMBER ONE
    const calculatedLeads_2 = calculatePercentage(lastItemInApiData, 30);
    const formattedLeads_2 = calculatedLeads_2
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setLeadNumber_2(formattedLeads_2);

    //CLEARING MANUAL VISIOR NUMBER
    setManualVisitorNumber('');
    //CLEARING MANUAL LEAD NUMBER
    setManualLeadNumber_1(null);
  };

  const getApiData = (e) => {
    const apiData = localData[0].EstimatedMonthlyVisits;
    getFormattedData(apiData);
  };

  const generateLeadNumber = (userInputNumber) => {
    //FORMATTING USER INPUT NUMBER
    const expectedManualVisitors = userInputNumber
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    //SETTING UP FIRST CACLULATED LEAD NUMBER
    const manuallyGeneratedLeads_1 = calculatePercentage(userInputNumber, 20);
    const formattedManualLeads_1 = manuallyGeneratedLeads_1
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setManualLeadNumber_1(formattedManualLeads_1);

    //SETTING UP SECOND CACLULATED LEAD NUMBER
    const manuallyGeneratedLeads_2 = calculatePercentage(userInputNumber, 30);
    const formattedManualLeads_2 = manuallyGeneratedLeads_2
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setManualLeadNumber_2(formattedManualLeads_2);

    setManualVisitorNumber(expectedManualVisitors);
    setLeadNumber_1('');
  };

  // const getApiData = (e) => {
  //   setIsLoading(true);
  //   setLeadNumber_1('');
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
  //       getFormattedData(apiData);
  //       setIsLoading(false);
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // };

  const validateData = (e) => {
    if (domainName) {
      if (isNaN(domainName)) {
        // console.log('Input is text');
        getApiData();
      } else {
        // console.log('Input is a number');
        generateLeadNumber(domainName);
      }
    } else {
      setError('Input is requied!');
    }
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Lee Goff Lead Calculator</h1>
      </header>
      <main className='App-container'>
        <h4 style={{ textAlign: 'center' }}>
          Input Domain Name or Expected Visitor Number
        </h4>
        <section className='form-box'>
          <input
            type='text'
            onChange={(e) => setDomainName(e.target.value)}
            placeholder='youdomain.com'
            ref={textInput}
          />
          <button style={{ marginRight: '.5rem' }} onClick={validateData}>
            Get Data
          </button>
          <button onClick={resetData}>Reset</button>
        </section>
        {error && (
          <div
            style={{ color: 'red', textAlign: 'center', marginTop: '1.5rem' }}
          >
            {error}
          </div>
        )}
        <section className='display-box'>
          <div className='display-box-content'>
            <h2 style={{ color: 'dodgerblue', textAlign: 'center' }}>
              Calculated Result <br />
            </h2>
            {isLoading && (
              <Audio
                height='80'
                width='80'
                radius='9'
                color='dodgerblue'
                ariaLabel='loading'
              />
            )}
            {lastDateListed &&
              lastVisitNumberListed &&
              leadNumber_1 &&
              leadNumber_2 && (
                <div>
                  <h4 style={{ color: 'darkred', textDecoration: 'underline' }}>
                    SimilarWeb Data:
                  </h4>
                  <h5>{lastDateListed}</h5>
                  <h3>
                    {lastVisitNumberListed}
                    <br />
                    <small>(Expected Visitors)</small>
                  </h3>
                  <div className='generated-leads'>
                    <h4>Lead Generated</h4>
                    From: {leadNumber_1} <br />
                    <br />
                    To: {leadNumber_2}
                  </div>
                </div>
              )}
            {manualVisitorNumber &&
              manualLeadNumber_1 &&
              manualLeadNumber_2 && (
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
                    From: {manualLeadNumber_1} <br />
                    <br />
                    To: {manualLeadNumber_2}
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
