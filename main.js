import * as readLine from "readline";
import readXlsxFile from "read-excel-file/node";
import timeseries from "timeseries-analysis";

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

          // Return the array of integers containing the number of functional requirements per month
          return data;
        })
        .then((data) => {
          // Perform the calculations to predict the number of funcitonal requirements for the next 3 releases
          for (let prediction = 1; prediction < 4; prediction++) {
            // Create the sequence from the array of data
            let sequence = new timeseries.main(
              timeseries.adapter.fromArray(data)
            );

            // Calculate the coefficients
            let coefficients = sequence.ARMaxEntropy();

            // Initially set the forecast to 0
            let forecast = 0;

            // Loop through the coefficients
            for (let i = 0; i < coefficients.length; i++) {
              // The following math is explained in the ReadMe file of the timeseries-analysis npm package
              // https://www.npmjs.com/package/timeseries-analysis?activeTab=readme#calculating-the-forecasted-value
              // Update the forecast based on the sequence of data and calculated coefficients
              forecast -=
                sequence.data[coefficients.length - i][1] * coefficients[i];
            }

            // Round the prediction since requirements must be represented by whole numbers
            forecast = Math.round(forecast);

            // Print the prediction to the console
            console.log(`Prediction #${prediction}: `, forecast);

            // Add the predicted value to the data array so that it can be used to predict the next value as needed
            data.push(forecast);
          }
        });
    }
  );
};

// Call the method
main();
