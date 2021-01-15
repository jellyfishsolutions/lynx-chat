import React from 'react'
import './App.css'
import MyLoader from './components/my-loader'
import { Provider } from 'react-redux'
import store from './redux/store'

function App() {

  return (
    <Provider store={store}>
      <div className="App">
        <MyLoader />
      </div>
    </Provider>
  );
}

export default App;
