import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'

if (module.hot) {
  module.hot.accept()
}

class App extends React.Component {
  render() {
    return <h1>Stats</h1>
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))