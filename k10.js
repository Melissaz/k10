var username = '';

document.addEventListener("DOMContentLoaded", function() {
    const questions = [
        "did you feel tired out for no good reason?",
        "did you feel nervous?",
        "Did you feel so nervous that nothing could calm you down?",
        "Did you feel hopeless?",
        "Did you feel restless or fidgety?",
        "Did you feel so restless that you could not sit still?",
        "Did you feel depressed?",
        "Did you feel that everything was an effort?",
        "Did you feel so sad that nothing could cheer you up?",
        "Did you feel worthless?"
    ];

    const form = document.getElementById("assessmentForm");
    questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question-block"); // If you're using specific classes for question blocks

        const questionLabel = document.createElement("label");
        questionLabel.innerText = `${index + 1}. ${question}`;
        questionLabel.htmlFor = `question${index}`;
        questionLabel.classList.add("question-label");
        
        const select = document.createElement("select");
        select.id = `question${index}`;
        select.name = `question${index}`;
        select.classList.add("select-option");

        const optionsRange = [1, 2, 3, 4, 5]; // Assuming scores range from 1 to 5
        const optionsText = [
            "None of the time",
            "A little of the time",
            "Some of the time",
            "Most of the time",
            "All of the time"
        ];
        optionsRange.forEach(score => {
            const option = document.createElement("option");
            option.value = score;
            option.text = optionsText[score - 1]; 
            select.appendChild(option);
        });

        questionDiv.appendChild(questionLabel);
        questionDiv.appendChild(select);
        form.appendChild(questionDiv);
    });

});

function submitForm() {
    const form = document.getElementById("assessmentForm");
    let totalScore = 0;
    for (let i = 0; i < form.elements.length; i++) {
        const element = form.elements[i];
        if (element.tagName === "SELECT") {
            totalScore += parseInt(element.value, 10); // Ensure base 10 for parseInt
        }
    }

    const scoreResult = document.getElementById("scoreResult");
    scoreResult.innerText = `Total Score: ${totalScore}`;
    scoreResult.classList.add("score-display"); // Ensure this class matches your CSS for displaying the score

    //exportToExcel(totalScore);
    sendEmail(totalScore);
}

function exportToExcel(totalScore) {
    const date = new Date().toLocaleDateString(); // Get the current date in the format you want
    const data = [
        ["Username", "Date and Time", "Total Score"],
        [username, date, totalScore]
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    data.forEach(function(rowArray) {
        let row = rowArray.join(","); // Convert the array to a string and separate the items with a comma
        csvContent += row + "\r\n"; // Add a carriage return to make this CSV file a two-row entry
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Kessler_Assessment_Score.csv"); // Name the file as you wish
    document.body.appendChild(link); // Required for Firefox

    link.click(); // This will download the file
    document.body.removeChild(link); // Clean up
}

// Send email via EmailJS
function sendEmail(totalScore) {
  // Prepare email data
  const emailParams = {
    to_name: "Webb", // Specify recipient name
    from_name: username.toString(), // Specify sender name
    total_score: totalScore.toString(),
    assessment_name: "Kessler Psychological Distress Scale Assessment"
  };

  // Send email via EmailJS
  emailjs.send("service_bvyrf7c", "template_3yomgbq", emailParams).then(
    function (response) {
      console.log("SUCCESS!", response.status, response.text);
      showMessageModal("Form submitted successfully.");
    },
    function (error) {
      console.log("FAILED...", error);
      showMessageModal("There was an error submitting form. Please try again");
    }
  );
}

function unlockContent() {
    //set username
    username = document.getElementById("usernameField").value;

    var password = document.getElementById("passwordField").value;

    if (password.toLowerCase() == "k10") {
        closeModal();
        document.getElementById("hiddenFormArea").classList.remove("hidden");
    } else {
        var errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = "Incorrect password!";
        errorMessage.style.display = "block";
    }
}

function closeModal() {
    var modal = document.getElementById("loginModal");
    modal.classList.add("modal-closing");

    setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("modal-closing");
    }, 500); // Ensure this matches the CSS animation duration
}


function showMessageModal(message) {
    var messageModal = document.getElementById('messageModal');
    var formSubmittedMessage = document.getElementById('formSubmittedMessage');

    formSubmittedMessage.textContent = message;
    messageModal.classList.remove('hidden');
    document.body.classList.add('no-scroll'); // Disable background scrolling
}
