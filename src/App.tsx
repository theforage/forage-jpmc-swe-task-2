import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean, // Add showGraph property
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  private interval: NodeJS.Timeout | null = null; // Add interval property

  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false, // Initialize showGraph to false
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    }
    return null;
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    if (this.interval) {
      clearInterval(this.interval); // Clear existing interval if any
    }

    this.interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server
        this.setState((prevState) => ({
          data: [...prevState.data, ...serverResponds]
        }));
      });
    }, 1000); // Fetch data every second
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval); // Clean up interval on unmount
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
            onClick={() => {
              this.setState({ showGraph: true }); // Show the graph
              this.getDataFromServer(); // Start streaming data
            }}>
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
