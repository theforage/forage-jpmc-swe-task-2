import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  intervalId?: NodeJS.Timeout, // Optional property to store the interval ID
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    return (<Graph data={this.state.data} />);
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      this.setState((prevState) => {
        // Filter out duplicates
        const newData = serverResponds.filter(newItem =>
          !prevState.data.some(prevItem => prevItem.timestamp === newItem.timestamp)
        );
        return { data: [...prevState.data, ...newData] };
      });
    });
  }

  /**
   * Start streaming data continuously
   */
  startStreamingData() {
    const intervalId = setInterval(() => {
      this.getDataFromServer();
    }, 1000); // Fetch data every second

    this.setState({ intervalId });
  }

  /**
   * Clear the interval when the component unmounts to avoid memory leaks
   */
  componentWillUnmount() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
    }
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            onClick={() => { this.startStreamingData() }}>
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
