import * as readLine from "readline";
import readXlsxFile from "read-excel-file/node";
import ARIMA from "arima";

const main = () => {
  // Set up the readline object to prompt the user
  const rl = readLine.createInterface(process.stdin, process.stdout);

  // Ask the user for the path of the file to be read
  rl.question(
    "What is the path of the file containing the previous release information?\n",
    (filePath) => {
      // Stop asking the user for input
      rl.close();

      // Read the content of the file
      readXlsxFile(filePath)
        .then((rows) => {
          // A variable to hold the data in the filled cells
          let data = [];

          // rows is an array of rows, where each row is an array of cells
          // Add the filled-in cells of the first sheet in the file to the data array
          rows.forEach((row) => {
            data.push(row[0]);
          });

          // Return the reversed array of integers containing the number of functional requirements per month
          // The data needs to be reversed so that we predict what comes after the most recent data
          return data.reverse();
        })
        .then((data) => {
          // Create the Autoregressive Integrated Moving Average model and train it with the provided historical data
          const arima = new ARIMA({ verbose: false }).train(data);

          // Get the next 3 predictions using ARIMA
          const [predictions] = arima.predict(3);

          // Print the predictions to the console
          predictions.forEach((prediction, index) =>
            console.log(`Prediction #${index + 1}: `, Math.round(prediction))
          );
        });
    }
  );
};

// Call the method
main();
