const showInfoBtn = document.getElementById('showInfoBtn');
const studentInfo = document.getElementById('studentInfo');

showInfoBtn.addEventListener('click', function () {

  alert('Welcome to SIT Nagpur');

  const name = "Sumira Wandile";
  const rollNo = "24070521275";
  const course = "B.Tech - Computer Science and Engineering";
  const semester = "5th Semester";
  const email = "sumira.wandile.batch2024@sitnagpur.edu.siu.in";

  studentInfo.innerHTML =
    "<table class='record-table'>" +
      "<tr><th>Name</th><td>" + name + "</td></tr>" +
      "<tr><th>Roll No</th><td>" + rollNo + "</td></tr>" +
      "<tr><th>Course</th><td>" + course + "</td></tr>" +
      "<tr><th>Semester</th><td>" + semester + "</td></tr>" +
      "<tr><th>Email</th><td>" + email + "</td></tr>" +
    "</table>";
});