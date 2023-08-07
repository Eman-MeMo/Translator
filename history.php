<head>
    <link rel="stylesheet" href="style.css">
</head>

<?php

$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "translator";
$conn = "";

//try to connenct to database
try {
    $conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);
} catch (mysqli_sql_exception $e) {
    echo "<script>console.log('Couldn\'t connect to the database.')</script>";
}

//get the data from data from database and store them at table
if ($conn) {
    $query = "SELECT * FROM history";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) > 0) {
        echo "<table>";
        echo "<tr><th>Original Text</th><th>Original Language</th><th>Translated Text</th><th>Translated Language</th></tr>";
        while ($row = mysqli_fetch_assoc($result)) {
            echo "<tr>";
            echo "<td>" . $row['original_text'] . "</td>";
            echo "<td>" . $row['original_language'] . "</td>";
            echo "<td>" . $row['translated_text'] . "</td>";
            echo "<td>" . $row['translated_language'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>No records found in the database.</p>";
    }
}
?>