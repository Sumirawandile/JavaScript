// data.js : the timetable (edit the rows below to match your own classes)
// Each row: [day, start, end, subject, type, room]   day: 1 = Monday ... 6 = Saturday

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const rows = [
  [1, "09:00", "10:00", "Data Compression",     "Lecture", "Room 301"],
  [1, "10:00", "11:00", "Compiler Construction", "Lecture", "Room 301"],
  [1, "11:15", "12:15", "Computer Networks",     "Lecture", "Room 302"],
  [1, "14:00", "16:00", "JavaScript Lab",        "Lab",     "Lab 2"],

  [2, "09:00", "10:00", "Data Mining",           "Lecture", "Room 303"],
  [2, "10:00", "11:00", "Image Processing",      "Lecture", "Room 303"],
  [2, "11:15", "12:15", "Data Compression",      "Lecture", "Room 301"],
  [2, "14:00", "16:00", "Data Mining Lab",       "Lab",     "Lab 1"],

  [3, "09:00", "10:00", "Computer Networks",     "Lecture", "Room 302"],
  [3, "10:00", "11:00", "JavaScript",            "Lecture", "Room 304"],
  [3, "11:15", "12:15", "Compiler Construction", "Lecture", "Room 301"],
  [3, "14:00", "16:00", "Image Processing Lab",  "Lab",     "Lab 3"],

  [4, "09:00", "10:00", "Data Mining",           "Lecture", "Room 303"],
  [4, "10:00", "11:00", "Data Compression",      "Lecture", "Room 301"],
  [4, "11:15", "12:15", "Image Processing",      "Lecture", "Room 303"],
  [4, "14:00", "16:00", "Computer Networks Lab", "Lab",     "Lab 1"],

  [5, "09:00", "10:00", "Compiler Construction", "Lecture", "Room 301"],
  [5, "10:00", "11:00", "Computer Networks",     "Lecture", "Room 302"],
  [5, "11:15", "12:15", "JavaScript",            "Lecture", "Room 304"],
  [5, "14:00", "16:00", "Compiler Lab",          "Lab",     "Lab 2"],

  [6, "09:00", "10:00", "Data Mining",           "Lecture", "Room 303"],
  [6, "10:00", "11:00", "Image Processing",      "Lecture", "Room 303"],
  [6, "11:15", "12:15", "Data Compression",      "Lecture", "Room 301"],
];

// Turn each row into an object so the rest of the app can use names instead of positions
export const schedule = rows.map(([day, start, end, subject, type, room], id) =>
  ({ id, day, start, end, subject, type, room }));