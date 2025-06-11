//---------------------------------------------
// ส่วนที่ 1: หน้า index.html
//---------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const startForm = document.getElementById("startForm");
  if (startForm) {
    startForm.addEventListener("submit", function (event) {
      event.preventDefault(); // กัน reload หน้า

      // 👉 เก็บค่าจากฟอร์มลง sessionStorage
      const name = document.getElementById("name").value;
      const company = document.getElementById("company").value;
      const group = document.getElementById("group").value;
      const date = document.getElementById("date").value;

      sessionStorage.setItem("name", name);
      sessionStorage.setItem("company", company);
      sessionStorage.setItem("group", group);
      sessionStorage.setItem("date", date);
      sessionStorage.setItem("attempt", "1"); // Reset attempt ตอนเริ่ม

      window.location.href = "questions.html"; // ไปหน้าทำข้อสอบ
    });
  }
});

//---------------------------------------------
// ส่วนที่ 2: หน้า questions.html
//---------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const quizForm = document.getElementById("quizForm");
  if (!quizForm) return;

  // 🔑 คำตอบที่ถูกต้อง
  const correctAnswers = {
    q1: "B",
    q2: "A",
    q3: "C",
    q4: "B",
    q5: "B",
    q6: "A",
    q7: "C",
    q8: "B",
    q9: "A",
    q10: "C",
  };

  // 🔑 ดึง attempt จาก sessionStorage
  let attempt = parseInt(sessionStorage.getItem("attempt")) || 1;

  quizForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // 🔒 ตรวจสอบว่าตอบครบทุกข้อหรือยัง
    let allAnswered = true;
    for (let question in correctAnswers) {
      const selected = quizForm.querySelector(
        `input[name="${question}"]:checked`
      );
      if (!selected) {
        allAnswered = false;
        break;
      }
    }
    // 🔧 แก้ไขส่วนนี้: เปลี่ยนจาก alert() → Swal.fire()
    if (!allAnswered) {
      // ✅ ใช้ SweetAlert2 (ต้องแน่ใจว่า import sweetalert2.min.js และ sweetalert2.min.css ไว้แล้ว)
      Swal.fire({
        icon: "warning",
        title: "กรุณาทำข้อสอบให้ครบ 🙂",
        confirmButtonText: "ตกลง",
      });
      return; // ถ้ายังตอบไม่ครบ หยุดที่นี่เลย
    }

    let correctCount = 0;

    // 🔎 ตรวจคำตอบ
    for (let question in correctAnswers) {
      const selected = quizForm.querySelector(
        `input[name="${question}"]:checked`
      );
      if (selected && selected.value === correctAnswers[question]) {
        correctCount++;
      }
    }

    // 🔎 แปลงคะแนนเป็นเต็ม 100
    let score = correctCount * 10;

    let isPass = false;

    if (attempt === 1) {
      isPass = score >= 70;
    } else if (attempt === 2 || attempt === 3) {
      if (score >= 70) {
        isPass = true;
        score = 70; // ให้คะแนนสูงสุด 70% ครั้งที่ 2-3
      } else {
        isPass = false;
      }
    }

    // 🔎 แสดงผล
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
      <p>คุณได้คะแนน: ${score} คะแนน</p>
      <p>
        ${
          isPass
            ? "คุณสอบผ่านแล้ว ✅"
            : attempt < 3
            ? `คุณยังไม่ผ่าน ลองสอบครั้งที่ ${attempt + 1} ได้เลย!`
            : `คุณสอบครบ 3 ครั้งแล้ว ลองทบทวนเนื้อหาก่อนสอบใหม่นะครับ`
        }
      </p>
    `;

    // 🔎 ถ้ายังไม่ผ่านและยังไม่ครบ 3 ครั้ง → เพิ่ม attempt
    if (!isPass && attempt < 3) {
      attempt++;
      sessionStorage.setItem("attempt", attempt);
    }

    // 🔎 Reset ฟอร์ม
    quizForm.reset();
  });
});
