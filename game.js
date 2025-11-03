let questions = [];
let currentQuestion = 0;
let timer;
let timeLeft = 15;
let scoreRed = 0;
let scoreBlue = 0;
let ropePosition = 50;

// --- Upload CSV ---
document.getElementById("csvUpload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (evt) {
    const text = evt.target.result;
    questions = parseCSV(text);
    alert(`✅ ${questions.length} soal berhasil dimuat!`);
  };
  reader.readAsText(file);
});

// --- Parse CSV sederhana ---
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim());
    return obj;
  });
}

// --- Mulai permainan ---
document.getElementById("startGame").addEventListener("click", function () {
  if (questions.length === 0) {
    alert("⚠️ Upload file soal terlebih dahulu!");
    return;
  }
  document.querySelector(".upload-area").classList.add("hidden");
  document.getElementById("gameArea").classList.remove("hidden");
  currentQuestion = 0;
  scoreRed = 0;
  scoreBlue = 0;
  ropePosition = 50;
  showQuestion();
});

// --- Menampilkan pertanyaan ---
function showQuestion() {
  if (currentQuestion >= questions.length) {
    endGame();
    return;
  }

  const q = questions[currentQuestion];
  document.getElementById("questionText").textContent = q["Pertanyaan"];
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  const choices = ["A", "B", "C", "D"];
  choices.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = `${c}. ${q[c]}`;
    btn.onclick = () => checkAnswer(c, q["Jawaban"]);
    optionsDiv.appendChild(btn);
  });

  timeLeft = 15;
  document.getElementById("timer").textContent = timeLeft;
  clearInterval(timer);
  timer = setInterval(countdown, 1000);
}

function countdown() {
  timeLeft--;
  document.getElementById("timer").textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    currentQuestion++;
    showQuestion();
  }
}

// --- Cek jawaban ---
function checkAnswer(selected, correct) {
  clearInterval(timer);
  if (selected === correct) {
    // acak siapa yang menjawab benar
    const winner = Math.random() > 0.5 ? "red" : "blue";
    moveRope(winner);
  }
  currentQuestion++;
  setTimeout(showQuestion, 800);
}

// --- Gerakkan tali ---
function moveRope(team) {
  const rope = document.getElementById("rope");
  if (team === "red") {
    ropePosition -= 5;
    scoreRed++;
  } else {
    ropePosition += 5;
    scoreBlue++;
  }
  rope.style.left = `${ropePosition}%`;
  document.getElementById("scoreRed").textContent = scoreRed;
  document.getElementById("scoreBlue").textContent = scoreBlue;

  if (ropePosition <= 30 || ropePosition >= 70) {
    endGame();
  }
}

// --- Tombol dukungan tim ---
function pressTeam(team) {
  moveRope(team);
}

// --- Akhiri permainan ---
function endGame() {
  clearInterval(timer);
  document.getElementById("gameArea").classList.add("hidden");
  const result = document.getElementById("result");
  const winnerText = document.getElementById("winnerText");
  if (scoreRed > scoreBlue) {
    winnerText.textContent = "🏅 Tim Merah Menang!";
  } else if (scoreBlue > scoreRed) {
    winnerText.textContent = "🏅 Tim Biru Menang!";
  } else {
    winnerText.textContent = "🤝 Seri!";
  }
  result.classList.remove("hidden");
}

// --- Restart ---
function restartGame() {
  document.getElementById("result").classList.add("hidden");
  document.querySelector(".upload-area").classList.remove("hidden");
}
// rebuild
