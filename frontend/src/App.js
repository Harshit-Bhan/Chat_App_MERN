import './App.css';
import { Route, Switch } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/chats" component={ChatPage} />
      </Switch>
    </div>
  );
}

export default App;
