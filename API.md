// forgot-password
http://localhost:8080/api/auth/forgot-password
{
  "email": "sagar26io050@satiengg.in"
}


// Reset Password
http://localhost:8080/api/auth/reset-password/:token
{
  "password": "sagar123"
}


// checkin/checkout by tapping rfid
http://localhost:8080/api/checkin/tap
{
  "rfidCard": "RFID-STU-006"
}