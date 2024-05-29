// Add an event listener to the form submission
document
  .getElementById('spellCheckForm') // Select the form by its ID
  .addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the text input value
    const textInput = document.getElementById('textInput').value;
    console.log(textInput);

    // Make a POST request to the /spellcheck endpoint
    fetch('/spellcheck', {
      method: 'POST', // Use the POST method
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify({ text: textInput }), // Send the text input as a JSON payload
    })
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => {
        // Destructure the response data
        const { original_text, corrections } = data;

        // Display the original text
        document.getElementById(
          'originalText'
        ).innerText = `Original Text: ${original_text}`;

        // Get the corrections container element
        const correctionsDiv = document.getElementById('corrections');
        correctionsDiv.innerHTML = ''; // Clear any previous corrections

        // Check if corrections is defined and not empty
        if (corrections && corrections.length > 0) {
          // Iterate over the corrections and display them
          corrections.forEach((correction) => {
            const correctionP = document.createElement('p'); // Create a new paragraph element
            correctionP.innerText = `Correction: ${correction.text} -> ${correction.best_candidate}`; // Set the text content
            correctionsDiv.appendChild(correctionP); // Append the paragraph to the corrections container
          });
        } else {
          // If no corrections are available, display a message
          const noCorrectionsMessage = document.createElement('p');
          noCorrectionsMessage.innerText = 'No corrections available.';
          correctionsDiv.appendChild(noCorrectionsMessage);
        }
      })
      .catch((error) => {
        // Log any errors to the console
        console.log('Error: ' + error);
        // Display error message to the user
        document.getElementById('error').innerText =
          'An error occurred. Please try again later.';
      });
  });
