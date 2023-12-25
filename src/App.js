import './App.css';
import { Outlet } from 'react-router-dom'
import { AppBar } from './components/AppBar';
import Footer from './components/Footer';


function App() {

  return (
    <>
      <div >
        <div>
          <AppBar></AppBar>
          <div className='justify-content-center'>
            <Outlet></Outlet>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
