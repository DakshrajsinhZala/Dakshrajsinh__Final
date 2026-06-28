const password = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const entropy = document.getElementById("entropy");
const crackTime = document.getElementById("crackTime");
const scoreText = document.getElementById("score");
const feedback = document.getElementById("feedback");
const charCount = document.getElementById("charCount");
const analysisList = document.getElementById("analysisList");

const themeBtn = document.getElementById("themeBtn");
const showBtn = document.getElementById("showBtn");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");

const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const historyList = document.getElementById("history");

let history = [];

/* ---------------- PASSWORD CHECKER ---------------- */

password.addEventListener("input", checkPassword);

function checkPassword() {
  const pass = password.value;

  if (pass.length === 0) {
    resetStrength();
    return;
  }

  const result = zxcvbn(pass);

  const names = [
    "Very Weak",
    "Weak",
    "Medium",
    "Strong",
    "Very Strong"
  ];

  const colors = [
    "#ff0000",
    "#ff6600",
    "#ffc107",
    "#66cc00",
    "#00e676"
  ];

  strengthText.innerText =
    "Strength: " + names[result.score];

  strengthBar.style.width =
    ((result.score + 1) * 20) + "%";

  strengthBar.style.background =
    colors[result.score];

  scoreText.innerText =
    result.score + " / 4";

  entropy.innerText =
    Math.round(result.guesses_log10 * 3.32) +
    " bits";

  crackTime.innerText =
    result.crack_times_display
      .offline_fast_hashing_1e10_per_second;

  charCount.innerText = pass.length;

  feedback.innerHTML = "";

  if (result.feedback.warning) {
    feedback.innerHTML +=
      `<p>⚠ ${result.feedback.warning}</p>`;
  }

  result.feedback.suggestions.forEach(s => {
    feedback.innerHTML += `<p>✅ ${s}</p>`;
  });

  updateAnalysis(pass);
  updateChart(result.score);
}

/* ---------------- RESET ---------------- */

function resetStrength() {
  strengthBar.style.width = "0%";
  strengthText.innerText = "Strength: -";
  entropy.innerText = "0 bits";
  crackTime.innerText = "-";
  scoreText.innerText = "0 / 4";
  charCount.innerText = "0";
  feedback.innerHTML = "";
}

/* ---------------- ANALYSIS ---------------- */

function updateAnalysis(pass) {
  analysisList.innerHTML = "";

  const tests = [
    {
      text: "Contains Uppercase",
      pass: /[A-Z]/.test(pass)
    },
    {
      text: "Contains Lowercase",
      pass: /[a-z]/.test(pass)
    },
    {
      text: "Contains Numbers",
      pass: /[0-9]/.test(pass)
    },
    {
      text: "Contains Symbols",
      pass: /[^A-Za-z0-9]/.test(pass)
    },
    {
      text: "Length ≥ 12",
      pass: pass.length >= 12
    },
    {
      text: "No Repeated Characters",
      pass: !/(.)\1\1/.test(pass)
    }
  ];

  tests.forEach(t => {
    const li = document.createElement("li");

    if (t.pass) {
      li.innerHTML = "✅ " + t.text;
    } else {
      li.innerHTML = "❌ " + t.text;
    }

    analysisList.appendChild(li);
  });
}

/* ---------------- SHOW PASSWORD ---------------- */

showBtn.addEventListener("click", () => {
  password.type =
    password.type === "password"
      ? "text"
      : "password";
});

/* ---------------- THEME ---------------- */

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark")
      ? "dark"
      : "light"
  );
});

window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
});

/* ---------------- LENGTH SLIDER ---------------- */

lengthSlider.addEventListener("input", () => {
  lengthValue.innerText =
    lengthSlider.value;
});

/* ---------------- GENERATOR ---------------- */

generateBtn.addEventListener(
  "click",
  generatePassword
);

function generatePassword() {
  const upper =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const lower =
    "abcdefghijklmnopqrstuvwxyz";

  const numbers =
    "0123456789";

  const symbols =
    "!@#$%^&*()_+-={}[]<>?";

  let chars = "";

  if (
    document.getElementById("upper").checked
  ) {
    chars += upper;
  }

  if (
    document.getElementById("lower").checked
  ) {
    chars += lower;
  }

  if (
    document.getElementById("number").checked
  ) {
    chars += numbers;
  }

  if (
    document.getElementById("symbol").checked
  ) {
    chars += symbols;
  }

  if (chars.length === 0) {
    alert("Select at least one option.");
    return;
  }

  let generated = "";

  for (
    let i = 0;
    i < lengthSlider.value;
    i++
  ) {
    generated +=
      chars[
        Math.floor(
          Math.random() * chars.length
        )
      ];
  }

  password.value = generated;
  checkPassword();

  addHistory(generated);
}

/* ---------------- COPY ---------------- */

copyBtn.addEventListener("click", () => {
  if (password.value === "") {
    alert("No password.");
    return;
  }

  navigator.clipboard.writeText(
    password.value
  );

  alert("Password copied!");
});

/* ---------------- HISTORY ---------------- */

function addHistory(pass) {
  history.unshift(pass);

  if (history.length > 10) {
    history.pop();
  }

  historyList.innerHTML = "";

  history.forEach(item => {
    const li =
      document.createElement("li");

    li.innerText = item;

    historyList.appendChild(li);
  });
}

/* ---------------- CLEAR HISTORY ---------------- */

clearBtn.addEventListener("click", () => {
  history = [];
  historyList.innerHTML =
    "<li>No passwords generated yet.</li>";
});

/* ---------------- EXPORT REPORT ---------------- */

exportBtn.addEventListener("click", () => {
  const report = `
Password Guardian Report

Password:
${password.value}

Strength:
${strengthText.innerText}

Entropy:
${entropy.innerText}

Crack Time:
${crackTime.innerText}

Generated:
${new Date().toLocaleString()}
`;

  const blob = new Blob(
    [report],
    { type: "text/plain" }
  );

  const a =
    document.createElement("a");

  a.href =
    URL.createObjectURL(blob);

  a.download =
    "password-report.txt";

  a.click();
});

/* ---------------- CHART ---------------- */

let chart;

function updateChart(score) {
  const ctx =
    document
      .getElementById("securityChart")
      .getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [
        "Security",
        "Remaining"
      ],
      datasets: [
        {
          data: [
            score + 1,
            5 - (score + 1)
          ]
        }
      ]
    },
    options: {
      responsive: true
    }
  });
}
