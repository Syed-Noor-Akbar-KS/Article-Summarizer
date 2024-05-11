document.addEventListener("DOMContentLoaded", function () {
  const textInput = document.getElementById("textInput");
  const fileInput = document.getElementById("fileInput");
  const summarizeBtn = document.getElementById("summarizeBtn");
  const summaryDiv = document.getElementById("summary");
  const copybtn = document.getElementById("copy");

  // sk-proj-820x9pH7pAwfmmanFNJJT3BlbkFJ5QSDIqjx2sYGfZao6lG4
  // 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

  summarizeBtn.addEventListener("click", function () {
    if (textInput.value == "" && fileInput.files.length == 0) {
      alert("Please add txt or upload file ");
    } else if (textInput.value != " " && fileInput.files.length == 0) {
      let content = textInput.value;
      summarizeContent(content);
    } else {
      let content = textInput.value;
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const extension = file.name.split(".").pop().toLowerCase();

        // Check file extension and use appropriate reader
        if (extension === "txt") {
          // Use readAsText to read the .txt file as text
          const reader = new FileReader();
          reader.onload = function (event) {
            content = event.target.result;
            summarizeContent(content);
          };
          reader.readAsText(file);
        } else if (extension === "docx") {
          var reader = new FileReader();
          reader.onload = function (e) {
            var arrayBuffer = e.target.result;
            mammoth
              .extractRawText({ arrayBuffer: arrayBuffer })
              .then(function (result) {
                summarizeContent(result.value);
              })
              .catch(function (err) {
                textInput.value = "Error: " + err.message;
              });
          };
          reader.readAsArrayBuffer(file);
        } else {
          alert(
            "Unsupported file type. Please select a .txt, .docx, or .pdf file."
          );
        }
      } else {
        summarizeContent(content);
      }
    }
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const extension = file.name.split(".").pop().toLowerCase();

      // Check file extension and use appropriate reader
      if (extension === "txt") {
        // Use readAsText to read the .txt file as text
        const reader = new FileReader();
        reader.onload = function (event) {
          content = event.target.result;
          textInput.value = content;
        };
        reader.readAsText(file);
      } else if (extension === "docx") {
        var reader = new FileReader();
        reader.onload = function (e) {
          var arrayBuffer = e.target.result;
          mammoth
            .extractRawText({ arrayBuffer: arrayBuffer })
            .then(function (result) {
              textInput.value = result.value;
            })
            .catch(function (err) {
              console.log("Error: " + err.message);
            });
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert(
          "Unsupported file type. Please select a .txt, .docx, or .pdf file."
        );
      }
    }
  });

  async function summarizeContent(content) {
    const apiKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODI5YTgzZjktNTM1Yy00Nzc4LWE3ZDQtMGI4NGUxZTA4NzA4IiwidHlwZSI6ImFwaV90b2tlbiJ9.WKP5nhVy9CVheL17kOLZcGI4RyNPF0_CKSjw9ps1KSM"; // Replace 'YOUR_API_KEY' with your actual API key
    const apiUrl = `https://api.edenai.run/v2/text/summarize`;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        output_sentences: 2,
        text: content,
        providers: ["microsoft"],
        language: "en",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Process the response

        summaryDiv.value = data.microsoft.result;
        console.log(data.microsoft.result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  copybtn.addEventListener("click", function () {
    // Get the textarea element
    var textarea = document.getElementById("summary");

    // Select the text inside the textarea
    textarea.select();

    // Copy the selected text
    document.execCommand("copy");

    // Deselect the text
    textarea.selectionEnd = 0;
  });
});
