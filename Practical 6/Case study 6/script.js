// ========================================
// EMAIL VALIDATION
// ========================================

function validateEmail() {

    // Get email entered by user
    let email = document.getElementById("emailInput").value;

    // Remove extra spaces
    email = email.trim();

    // Regular expression for email validation
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let result = document.getElementById("emailResult");


    // Test email using Regex
    if (emailPattern.test(email)) {

        result.textContent = "✓ Valid Email Address";
        result.style.color = "green";

    } else {

        result.textContent = "✗ Invalid Email Address";
        result.style.color = "red";
    }
}



// ========================================
// TEXT ANALYSIS
// ========================================

function analyzeText() {

    // Get text from textarea
    let text = document.getElementById("textInput").value;


    // ------------------------------------
    // WORD COUNT
    // ------------------------------------

    let trimmedText = text.trim();

    let words;

    if (trimmedText === "") {
        words = [];
    } else {
        words = trimmedText.split(/\s+/);
    }

    document.getElementById("wordCount").textContent = words.length;


    // ------------------------------------
    // CHARACTER COUNT
    // ------------------------------------

    document.getElementById("charCount").textContent = text.length;


    // ------------------------------------
    // VOWEL COUNT
    // ------------------------------------

    let vowels = text.match(/[aeiou]/gi);

    let vowelCount = vowels ? vowels.length : 0;

    document.getElementById("vowelCount").textContent = vowelCount;


    // ------------------------------------
    // SENTENCE COUNT
    // ------------------------------------

    let sentences = text.match(/[.!?]+/g);

    let sentenceCount = sentences ? sentences.length : 0;

    document.getElementById("sentenceCount").textContent = sentenceCount;


    // ------------------------------------
    // EMAIL EXTRACTION
    // ------------------------------------

    let emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    let extractedEmails = text.match(emailPattern);

    document.getElementById("emails").textContent =
        extractedEmails
            ? extractedEmails.join(", ")
            : "No emails found";


    // ------------------------------------
    // PHONE NUMBER EXTRACTION
    // ------------------------------------

    let phonePattern = /\b\d{10}\b/g;

    let extractedPhones = text.match(phonePattern);

    document.getElementById("phones").textContent =
        extractedPhones
            ? extractedPhones.join(", ")
            : "No phone numbers found";


    // ------------------------------------
    // HASHTAG EXTRACTION
    // ------------------------------------

    let hashtagPattern = /#[a-zA-Z0-9_]+/g;

    let extractedHashtags = text.match(hashtagPattern);

    document.getElementById("hashtags").textContent =
        extractedHashtags
            ? extractedHashtags.join(", ")
            : "No hashtags found";


    // ------------------------------------
    // URL EXTRACTION
    // ------------------------------------

    let urlPattern = /https?:\/\/[^\s]+/g;

    let extractedURLs = text.match(urlPattern);

    document.getElementById("urls").textContent =
        extractedURLs
            ? extractedURLs.join(", ")
            : "No URLs found";


    // ------------------------------------
    // LONGEST WORD
    // ------------------------------------

    let longestWord = "-";

    for (let word of words) {

        // Remove punctuation
        let cleanWord = word.replace(/[.,!?;:]/g, "");

        if (cleanWord.length > longestWord.length) {
            longestWord = cleanWord;
        }
    }

    document.getElementById("longestWord").textContent = longestWord;


    // ------------------------------------
    // UPPERCASE
    // ------------------------------------

    document.getElementById("upperText").textContent =
        text.toUpperCase();


    // ------------------------------------
    // LOWERCASE
    // ------------------------------------

    document.getElementById("lowerText").textContent =
        text.toLowerCase();
}



// ========================================
// CLEAR FUNCTION
// ========================================

function clearText() {

    // Clear textarea
    document.getElementById("textInput").value = "";

    // Reset statistics
    document.getElementById("wordCount").textContent = "0";
    document.getElementById("charCount").textContent = "0";
    document.getElementById("vowelCount").textContent = "0";
    document.getElementById("sentenceCount").textContent = "0";


    // Reset extracted data
    document.getElementById("emails").textContent =
        "No emails found";

    document.getElementById("phones").textContent =
        "No phone numbers found";

    document.getElementById("hashtags").textContent =
        "No hashtags found";

    document.getElementById("urls").textContent =
        "No URLs found";


    // Reset additional analysis
    document.getElementById("longestWord").textContent = "-";

    document.getElementById("upperText").textContent = "-";

    document.getElementById("lowerText").textContent = "-";
}