import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  isStreaming: boolean, // Add this to track streaming status
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  private intervalId: NodeJS.Timeout | null = null; // Store the interval ID

  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      isStreaming: false, // Initialize streaming status
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    return (<Graph data={this.state.data}/>)
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      // Update the state by creating a new array of data that consists of
      // Previous data in the state and the new data from server
      this.setState(prevState => ({
        data: [...prevState.data, ...serverResponds]
      }));
    });
  }

  /**
   * Start streaming data
   */
  startStreaming() {
    if (this.state.isStreaming) return; // Prevent starting multiple intervals

    this.setState({ isStreaming: true });
    this.intervalId = setInterval(() => {
      this.getDataFromServer();
    }, 100);
  }

  /**
   * Stop streaming data
   */
  stopStreaming() {
    if (!this.state.isStreaming) return;

    this.setState({ isStreaming: false });
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  componentWillUnmount() {
    // Clean up the interval when the component is unmounted
    if (this.intervalId) {
      clearInterval(this.intervalId);
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
          <button 
            className="btn btn-primary Stream-button"
            onClick={() => this.startStreaming()}
          >
            Start Streaming Data
          </button>
          <button 
            className="btn btn-secondary Stream-button"
            onClick={() => this.stopStreaming()}
          >
            Stop Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
