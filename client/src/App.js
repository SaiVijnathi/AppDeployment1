import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Leaves from './components/Leaves';
import EditProfile from './components/EditProfile';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/tasks' element={<Tasks/>}></Route>
        <Route path='/leaves' element={<Leaves/>}></Route>
        <Route path='/editProfile' element={<EditProfile/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
