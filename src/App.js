import './App.css';
import { Outlet } from 'react-router-dom'
import { AppBar } from './components/AppBar';


function App() {

  return (
    <>
      <div >
        <div>
          <AppBar></AppBar>
          <div className='justify-content-center'>
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
