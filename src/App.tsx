import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,   /* this shows graph*/
}


class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,  // graph will be hidden until users click.
    };
  }

  /**
   * Render Graph react component with state.data parsed as property data
   */
  renderGraph() {
    if (this.state.showGraph) {        // added render graph to ensure graph doesn't render until clicked.
      return (<Graph data={this.state.data}/>);
    }
    return null; // return null if showGraph is false
  }

  getDataFromServer() {   // get data is updated so now it fetches data from Server. 
    let x = 0; // Initialize x to 0
    const interval = setInterval(() => { 
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({ 
          data: serverResponds,
          showGraph: true,
        });
      });
      x++;
      if (x > 1000) {
        clearInterval(interval);
      }
    }, 100); 
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is clicked, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
