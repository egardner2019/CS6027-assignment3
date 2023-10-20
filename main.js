import * as readLine from "readline";
import readXlsxFile from "read-excel-file/node";

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
          // Print the predictions for the next 3 releases to the console
        });
    }
  );
};

main();
