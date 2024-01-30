import '../styles/RegistrationForm.css';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
    const apiKey = 'Dre2ALObTyldvWG3Gr0WWNSQP5W1xqkF';
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [aadhaarPhoto, setAadhaarPhoto] = useState('');
    const [transaction_id, setTransactionID] = useState('');
    const [otp, setOtp] = useState('');
    const [aadhaarData, setAadhaarData] = useState(null);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [accountAddress, setAccountAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [aadhaarName, setAadhaarName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function sendOtp(e) {
        e.preventDefault();
        setError('');
        setLoading(true); // Set loading to true

        const options = {
            method: 'POST',
            url: 'https://api.gridlines.io/aadhaar-api/boson/generate-otp',
            headers: {
                'X-Auth-Type': 'API-Key',
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-API-Key': apiKey
            },
            data: { aadhaar_number: aadhaarNumber, consent: 'Y' }
        };

        try {
            const { data } = await axios.request(options);
            console.log(data.data.transaction_id);
            setTransactionID(data.data.transaction_id);
            setAadhaarData(null);
            setAadhaarName('');
            setStep(2);
        } catch (error) {
            console.error(error);
            setError('Failed to send OTP. Please try again.');
            alert('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false); // Reset loading to false, whether success or failure
        }
    }

    async function submitOtp(e) {
        e.preventDefault();
        setError('');
        setLoading(true); // Set loading to true

        const options = {
            method: 'POST',
            url: 'https://api.gridlines.io/aadhaar-api/boson/submit-otp',
            headers: {
                'X-Auth-Type': 'API-Key',
                'X-Transaction-ID': transaction_id,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-API-Key': apiKey
            },
            data: { otp: otp, include_xml: true, share_code: '1234' }
        };
        try {
            const { data } = await axios.request(options);
            setAadhaarData(data.data.aadhaar_data);
            setAadhaarName(data.data.aadhaar_data.name);
            setAadhaarPhoto(data.data.aadhaar_data.photo_base64);
            console.log(data.data.aadhaar_data);

            setStep(3);
        } catch (error) {
            console.error(error);
            setError('Incorrect OTP. Please try again.');
            alert('Incorrect OTP. Please try again.');
        } finally {
            setLoading(false); // Reset loading to false, whether success or failure
        }
    }

    async function userRegister(e) {
        e.preventDefault();
        setError('');
        setLoading(true); // Set loading to true

        try {
            if (password !== confirmPassword) {
                setError('Passwords do not match. Please enter matching passwords.');
                alert('Passwords do not match. Please enter matching passwords.');
                setPassword('');
                setConfirmPassword('');
                return;
            }
            else {
                console.log(aadhaarName, aadhaarNumber, accountAddress, password)
                const response = await axios.post('http://localhost:5000/api/register', {
                    aadhaarNumber: aadhaarNumber,
                    aadhaarName: aadhaarName,
                    accountAddress: accountAddress,
                    password: password,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    navigate('/login');
                } else {

                    if (response.status === 409) {
                        alert('User with this Aadhar number is already registered.');
                        setError('User with this Aadhar number is already registered.');
                    } else {
                        setError('Registration failed. Please try again.');
                    }
                }
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 409) {
                alert('User with this Aadhar number is already registered.');
                setError('User with this Aadhar number is already registered.');
            } else {
                setError('Registration failed. Please try again.');
            }
            window.location.href = '/';
        } finally {
            setLoading(false);
            
        }
    }

    return (
        <div className='wrapper'>
            {loading && (
                <div className="loader"></div>
            )}
            {step === 1 && (
                <>
                    <h2>Aadhar Form</h2>
                    395593095919
                    <form>
                        <input
                            type="number"
                            value={aadhaarNumber}
                            placeholder='Enter Aadhaar Number'
                            onChange={(e) => setAadhaarNumber(e.target.value)} />

                        <button onClick={sendOtp} disabled={loading}>SUBMIT</button>
                        {error && <p className="error">{error}</p>}
                    </form>
                </>
            )}
            {step === 2 && (
                <>
                    <h2>OTP</h2>
                    <form>
                        <input
                            type="number"
                            value={otp}
                            placeholder='Enter OTP'
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button onClick={submitOtp} disabled={loading}>Submit OTP</button>
                        {error && <p className="error">{error}</p>}
                    </form>
                </>
            )}
            {step === 3 && (
                <>{aadhaarData ? (
                    <>
                        {aadhaarPhoto && (
                            <img src={`data:image/jpeg;base64,${aadhaarPhoto}`} alt="Aadhar Photo" />
                        )}
                        <h4>Aadhaar Name: {aadhaarData.name || 'N/A'}</h4>
                        <h4>Locality: {aadhaarData.locality || 'N/A'}</h4>
                        <h4>DOB: {aadhaarData.date_of_birth || 'N/A'}</h4>
                    </>
                ) : (
                    <>
                        <h4>Aadhaar Name: N/A</h4>
                        <h4>Locality: N/A</h4>
                        <h4>DOB: N/A</h4>
                    </>
                )}
                    <h2>Registration Form</h2>
                    <input type="text" value={accountAddress} onChange={(e) => setAccountAddress(e.target.value)} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button onClick={userRegister} disabled={loading}>Register</button>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                </>
            )}

        </div>
    );
}

export default RegistrationForm;
