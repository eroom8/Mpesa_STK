import { useState } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';

function App() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');

  const payHandler = async (e) => {
    e.preventDefault(); // Prevent the form submission

    const formData = {
      phone: phone.substring(1),
      amount,
    };

    try {
      const res = await toast.promise(
        axios.post('https://react-mpesa.onrender.com/', formData),
        {
          pending: 'Payment is processing 🤚',
          success: 'complete stk  🤑',
          error: 'Payment failed 😟',
        }
      );

      if (res && res.data.CustomerMessage) {
        toast.success(res.data.CustomerMessage);
      } else if (res && res.data.ResponseDescription) {
        toast.success(res.data.ResponseDescription);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPhone('');
      setAmount('');
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-300">
        <form className="bg-green-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 sm:w-96 w-full">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl text-green-800 font-bold text-center flex " >
              MPESA-Pay
            </h2>
            <img
              className="rounded-full w-20 h-15 ml-2"
              src="./mpesa-icon.png"
              alt="M-PESA Icon"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="tel"
              placeholder="0712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="number"
              placeholder="Amount (KSH)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={payHandler}
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-center" draggable="true" closeButton="<p>close<p>" />
    </>
  );
}

export default App;
