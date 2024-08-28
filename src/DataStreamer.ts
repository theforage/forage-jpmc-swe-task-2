export interface Order {
  price: number; // Change from Number to number for consistency
  size: number;  // Change from Number to number for consistency
}

/**
 * The datafeed server returns an array of ServerRespond with 2 stocks.
 * We do not have to manipulate the ServerRespond for the purpose of this task.
 */
export interface ServerRespond {
  stock: string;
  top_bid: Order;
  top_ask: Order;
  timestamp: Date;
}

class DataStreamer {
  // The URL where datafeed server is listening
  static API_URL: string = 'http://localhost:8080/query?id=1';

  /**
   * Send request to the datafeed server and executes callback function on success
   * @param callback callback function that takes JSON object as its argument
   */
  static getData(callback: (data: ServerRespond[]) => void): void {
    const request = new XMLHttpRequest();
    request.open('GET', DataStreamer.API_URL, true); // Use asynchronous request

    request.onload = () => {
      if (request.status === 200) {
        try {
          const data = JSON.parse(request.responseText);
          callback(data);
        } catch (e) {
          console.error('Error parsing response data:', e);
          alert('Failed to parse server response.');
        }
      } else {
        console.error('Request failed with status:', request.status);
        alert('Request failed with status ' + request.status);
      }
    };

    request.onerror = () => {
      console.error('Network error occurred');
      alert('Network error occurred. Please try again later.');
    };

    request.send();
  }
}

export default DataStreamer;
