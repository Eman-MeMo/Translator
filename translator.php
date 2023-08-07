<?php
include("index.html");

$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "translator";
$conn = "";

// Retrieve the translated data from the AJAX request
$translatedData = json_decode(file_get_contents("php://input"), true);

//try to connenct to database
try {
    $conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);
} catch (mysqli_sql_exception $e) {
    echo "<script> console.log('Couldn't connect to the database.')</script>";
}

if ($conn) {
    echo "<script> console.log('You are connected to the database.')</script>";
}

// Check if the 'originalText' value is empty
if (empty($translatedData['originalText'])) {
    echo "<script> console.log('Original text is empty. Translation data not stored.')</script>";
    exit;
}

// Prepare and execute the SQL query to insert the data
$stmt = $conn->prepare("INSERT INTO history (original_text, translated_text, original_language, translated_language) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $translatedData['originalText'], $translatedData['translatedText'], $translatedData['fromLanguage'], $translatedData['toLanguage']);

if ($stmt->execute()) {
    echo "<script> console.log('Translation data stored successfully!')</script>";
} else {
    echo "<script> console.log('Error storing translation data.')</script>";
}

$stmt->close();
$conn->close();
