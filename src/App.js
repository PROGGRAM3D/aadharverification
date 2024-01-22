import logo from './logo.svg';
import './App.css';
import React,{useState} from 'react';
import axios from 'axios'

function App() {
  
    const [aadharNumber, setAadharNumber] = useState('');
    const [Transaction_id, setTransactionID] = useState('');
    const [OtpCall, setOtpCall] = useState('');
    const [aadharData,setAadharData] = useState();
  
    async function SendOtp (e) {
      e.preventDefault();
      console.log("hello test is done");
      const options = {
        method: 'POST',
        url: 'https://api.gridlines.io/aadhaar-api/boson/generate-otp',
        headers: {
          'X-Auth-Type': 'API-Key',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-API-Key': 'KCtsuzyqvyEpvuk7kAxQPEikuSwjmZg1'
        },
        data: {aadhaar_number: aadharNumber, consent: 'Y'} //395593095919
      };
      
      try {
        const { data } = await axios.request(options);
        console.log(data);
        console.log(data.data.transaction_id);
        setTransactionID(data.data.transaction_id);
        setAadharData(null);
      } catch (error) {
        console.error(error);
      }
    }

    async function GetData(){
      const options = {
        method: 'POST',
        url: 'https://api.gridlines.io/aadhaar-api/boson/submit-otp',
        headers: {
          'X-Auth-Type': 'API-Key',
          'X-Transaction-ID': Transaction_id,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-API-Key': 'KCtsuzyqvyEpvuk7kAxQPEikuSwjmZg1'
        },
        data: {otp: OtpCall, include_xml: true, share_code: '1234'}
      };
      
      try {
        const { data } = await axios.request(options);
        console.log(data);
        setAadharData(data.data.aadhaar_data);
      } catch (error) {
        console.error(error);
      }
    }

  return (
    <div className='wrapper'>
      <h2>Aadhar Form</h2>
      <form>
        <input
        type = "number"
        value = {aadharNumber}
        placeholder='Enter Aadhaar Number'
        onChange = {(e) => setAadharNumber(e.target.value)} />
        
        <button onClick={SendOtp}>SUBMIT</button>
      </form>

      <input 
      type="number"
      value = {OtpCall}
      placeholder='Enter OTP'
      onChange={(e) => setOtpCall(e.target.value)}
      >
      </input>
      <button onClick={GetData}>Submit OTP</button>

      {/* <img
  objectFit='cover'
  maxW={{ base: '100%', sm: '200px' }}
  src={aadharData && aadharData.photo_base64 ? `data:image/png;base64,${aadharData.photo_base64}` : ''}
/> */}
    {aadharData ? (
  <>
    <h4>Aadhaar Name: {aadharData.name || 'N/A'}</h4>
    <h4>Locality: {aadharData.locality || 'N/A'}</h4>
    <h4>DOB: {aadharData.date_of_birth || 'N/A'}</h4>
  </>
) : (
  <>
    <h4>Aadhaar Name: N/A</h4>
    <h4>Locality: N/A</h4>
    <h4>DOB: N/A</h4>
  </>
)}


    </div>
  );

}

export default App;
