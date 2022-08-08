import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Uploader from './components/Uploader';
import CardsDisplay from './components/CardsDisplay';
import Sidebar from './components/Sidebar';

class App extends Component
{
  constructor()
  {
    super();

    this.state = {isValid:false};
    
    this.headerRef = React.createRef();
  }

  uploaderSelectionChanged(fileContents)
  {
    var isValid = fileContents && fileContents.html && fileContents.css && fileContents.csv;

    this.setState({files:fileContents, isValid:isValid});
  }

  selectionChanged(card)
  {
    this.setState({selected:card});
  }

  render() 
  {
    return (
      <div className="App">
        <div className="App-main">
          <header ref={this.headerRef} className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Card Designer</h1>
          </header>
          <Uploader selectionChanged={this.uploaderSelectionChanged.bind(this)}/>
            {this.state.isValid ? <CardsDisplay files={this.state.files} selectionChanged={this.selectionChanged.bind(this)}/> :
            <p className="App-intro">
              To get started, select the HTML, CSS, and CSV files you wish to work with.
            </p>}
          </div>
        <Sidebar files={this.state.isValid ? this.state.files : undefined} selected={this.state.selected}/>
      </div>
    );
  }
}

export default App;
