const readline = require("readline-sync");

const selectValue = () => {
  let selectedValue = readline.question("Please enter 1,2 or 3: ");
  console.log(selectedValue);
  const invalidInput =
    selectedValue !== "1" && selectedValue !== "2" && selectedValue !== "3";
  if (invalidInput) {
    while (
      selectedValue !== "1" &&
      selectedValue !== "2" &&
      selectedValue !== "3"
    ) {
      console.log("Invalid option");

      selectedValue = readline.question("Please enter 1,2 or 3: ");
    }
  }
  return selectedValue;
};

module.exports = {
  selectValue,
};
