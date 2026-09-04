(function () {
  const dataEl = document.getElementById("quiz-data");
  const appEl = document.getElementById("quizApp");
  if (!dataEl || !appEl) return; // list mode page, kuch karne ki zaroorat nahi

  const quiz = JSON.parse(dataEl.textContent);
  const { testId, title, category, questions, passPercentage } = quiz;

  injectFallbackStyles();

  let currentIndex = 0;
  const answers = {}; // { [questionId]: selectedOptionIndex }
  let finished = false;
  let advancing = false; // ek waqt mein sirf ek hi click process ho

  // Self-contained styles, sab !important ke saath taake site ke global
  // style.css (jaise generic "button" tag styling) inhe kabhi na todein.
  function injectFallbackStyles() {
    if (document.getElementById("quiz-fallback-styles")) return;
    const style = document.createElement("style");
    style.id = "quiz-fallback-styles";
    style.textContent = `
      .quiz-progress { font-size: 0.9rem; color: #666; margin-bottom: 12px; }
      .quiz-category-tag { display: inline-block; background: #eef2ff; color: #3730a3; font-size: 0.8rem; padding: 2px 10px; border-radius: 999px; margin-bottom: 10px; }
      .question-block { margin-bottom: 20px; }

      .options-list { list-style: none !important; padding: 0 !important; margin: 15px 0 0 !important; }
      .options-list li { list-style: none !important; margin: 0 0 10px 0 !important; padding: 0 !important; }

      .option-item {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        text-align: left !important;
        padding: 12px 15px !important;
        font-size: 15px !important;
        line-height: 1.4 !important;
        border: 1px solid #ddd !important;
        border-radius: 8px !important;
        background: #fff !important;
        color: #222 !important;
        cursor: pointer !important;
      }
      .option-item:hover { background: #f5f5f5 !important; }
      .option-item.selected { background: #dbeafe !important; border-color: #2563eb !important; }
      .option-item.disabled { cursor: not-allowed !important; opacity: 0.85; }

      .quiz-actions { display: flex; justify-content: space-between; gap: 12px; margin-top: 20px; }
      .skip-btn, .exit-btn {
        padding: 10px 20px !important; border-radius: 8px !important; border: none !important;
        cursor: pointer !important; font-size: 1rem !important;
      }
      .skip-btn { background: #f1f1f1 !important; color: #333 !important; }
      .skip-btn:disabled { opacity: 0.5 !important; cursor: not-allowed !important; }
      .exit-btn { background: transparent !important; color: #991b1b !important; text-decoration: underline; }

      .result-box { text-align: center; padding: 40px 20px; border-radius: 12px; margin-top: 20px; }
      .result-percentage { font-size: 2.5rem; font-weight: bold; margin: 10px 0; }
      .result-pass { background: #ecfdf5; color: #065f46; }
      .result-fail { background: #fef2f2; color: #991b1b; }
      .result-box .btn { display: inline-block; margin-top: 16px; padding: 10px 20px; background: #2563eb; color: #fff; border-radius: 8px; text-decoration: none; }
    `;
    document.head.appendChild(style);
  }

  function render() {
    if (finished) return;
    advancing = false;

    const q = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;

    const optionsHtml = q.options
      .map((opt, idx) => `
        <li>
          <div class="option-item" data-index="${idx}" role="button" tabindex="0">
            ${escapeHtml(opt)}
          </div>
        </li>
      `)
      .join("");

    appEl.innerHTML = `
      <h2>${escapeHtml(title)}</h2>
      ${category ? `<div class="quiz-category-tag">${escapeHtml(category)}</div>` : ""}
      <div class="quiz-progress">Question ${currentIndex + 1} of ${questions.length}</div>
      <div class="question-block">
        <p><strong>Q${currentIndex + 1}:</strong> ${escapeHtml(q.questionText)}</p>
        <ul class="options-list">
          ${optionsHtml}
        </ul>
      </div>
      <div class="quiz-actions">
        <button type="button" id="skipBtn" class="skip-btn">Skip</button>
        <button type="button" id="exitBtn" class="exit-btn">Exit Quiz</button>
      </div>
    `;

    // Option pe click karte hi answer record ho ke agla sawal khud aa jayega
    appEl.querySelectorAll(".option-item").forEach((el) => {
      el.addEventListener("click", () => {
        if (advancing) return;
        selectOption(q.id, parseInt(el.dataset.index), el);
      });
    });

    document.getElementById("skipBtn").addEventListener("click", () => {
      if (advancing) return;
      advancing = true;
      goToNext(isLast);
    });

    document.getElementById("exitBtn").addEventListener("click", () => {
      const ok = confirm("Exit the quiz now? Your answered questions will be scored as-is.");
      if (ok) submitQuiz();
    });
  }

  function selectOption(questionId, selectedIndex, clickedEl) {
    advancing = true;
    answers[questionId] = selectedIndex;

    // Selected option highlight karo, aur sab options ko disable kar do
    appEl.querySelectorAll(".option-item").forEach((el) => el.classList.add("disabled"));
    clickedEl.classList.add("selected");
    document.getElementById("skipBtn").disabled = true;

    const isLast = currentIndex === questions.length - 1;

    // Thodi der highlight dikhne ke baad khud next question pe chale jao
    setTimeout(() => goToNext(isLast), 450);
  }

  function goToNext(wasLast) {
    if (wasLast) {
      submitQuiz();
      return;
    }
    currentIndex++;
    render();
  }

  async function submitQuiz() {
    finished = true;
    appEl.innerHTML = `<div class="quiz-progress">Submitting...</div>`;

    const questionIds = questions.map((q) => q.id);

    try {
      const res = await fetch(`/api/test/${testId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, questionIds }),
      });
      const data = await res.json();

      if (!data.success) {
        appEl.innerHTML = `<div class="result-box">Error: ${escapeHtml(data.message || "Could not submit quiz")}</div>`;
        return;
      }

      renderResult(data.percentage, data.pass);
    } catch (err) {
      appEl.innerHTML = `<div class="result-box">Error: ${escapeHtml(err.message)}</div>`;
    }
  }

  function renderResult(percentage, pass) {
    appEl.innerHTML = `
      <div class="result-box ${pass ? "result-pass" : "result-fail"}">
        <h2>${pass ? "Passed" : "Failed"}</h2>
        <p class="result-percentage">${percentage}%</p>
        <p>Passing mark: ${passPercentage}%</p>
        <a class="btn" href="/test">Back to Quizzes</a>
      </div>
    `;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  render();
})();