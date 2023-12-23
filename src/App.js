import './App.css';
import { Form, Link } from 'react-router-dom'
import Home from './components/Home';
import { useEffect, useState } from 'react';
import InvoiceForms from './components/InvoiceForms'

function App() {
  const [open, setOpen] = useState(true);

  const toggelOpen = () => {
    if (open) {
      setOpen(!open);
    } else {
      setOpen(true);
    }
  }

  useEffect(() => {
  }, [open])

  return (
    <>
      <div >
        <div className="App-header">
          <div className='row'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p className='mt-2' style={{ color: 'white' }}>Home</p>
              <p className='btn btn-submit-light-small ms-5 mt-2'>Login</p>
              <p className='ms-5 mt-2' style={{ color: 'white' }}>Contact</p>
            </div>
          </div>

          <div className='mt-2 px-5 py-5 row justify-content-center'>
            <Home></Home>
            <Link
              className='btn btn-submit-light-large text-center mt-5 mb-4'
              onClick={toggelOpen}
            >Create Invoice</Link>
          </div>
        </div>

        <div className='App' style={{ maxHeight: open ? 'fit-content' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
          {open &&
            <div className='mt-2 px-5 py-5 ms-5 me-5'>
              <div className='container'>
                <InvoiceForms></InvoiceForms>
              </div>
            </div>
          }
        </div>
      </div>

      <div>
        <div className="App">
          <div className='mt-2 px-5 py-5 row justify-content-center'>
            <h1 style={{ fontWeight: 600 }}>Streamline Invoice Creation</h1>
            <h5 className=' mt-5 px-5 me-5 ms-5'>Create an account to seamlessly include your company information in every invoice, saving you time
            </h5>
            <h5 className='mb-4 px-5 me-5 ms-5'>Additionally,
              you can track your sent invoices and earnings
            </h5>
            <Link to="#!" className='btn btn-submit-dark-large text-center mt-4 mb-4' >Join</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
