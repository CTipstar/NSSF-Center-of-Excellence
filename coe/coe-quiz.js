// NSSF Uganda Center of Excellence — quiz interaction
// Behavior:
//  - Course content is visible, quiz questions are hidden, until "Take Test" is clicked.
//  - Clicking "Take Test" hides the course content and shows one question at a time,
//    with a progress bar and Previous/Next navigation.
//  - "Check My Answers" scores the quiz (in-browser, no backend) and shows the result
//    plus a "Revise Course" button.
//  - "Revise Course" hides the quiz entirely and brings the course content back,
//    resetting the quiz for a future attempt.
document.addEventListener('DOMContentLoaded', function () {
  var wraps = document.querySelectorAll('.coe-quiz-wrap');

  wraps.forEach(function (wrap) {
    var article = wrap.closest('article') || wrap.parentElement;
    var courseContent = article ? article.querySelector('.coe-course-content') : null;
    var startBtn = wrap.querySelector('.coe-quiz-start');
    var introEl = wrap.querySelector('.coe-quiz-intro');
    var questionsWrap = wrap.querySelector('.coe-quiz-questions');
    var form = wrap.querySelector('.coe-quiz-form');
    if (!startBtn || !questionsWrap || !form) return;

    var questions = Array.prototype.slice.call(form.querySelectorAll('.coe-quiz-q'));
    var total = questions.length;
    if (total === 0) return;

    var prevBtn = wrap.querySelector('.coe-quiz-prev');
    var nextBtn = wrap.querySelector('.coe-quiz-next');
    var submitBtn = wrap.querySelector('.coe-quiz-submit');
    var progressFill = wrap.querySelector('.coe-quiz-progress-fill');
    var progressCurrent = wrap.querySelector('.coe-quiz-progress-current');
    var progressTotal = wrap.querySelector('.coe-quiz-progress-total');
    var resultWrap = wrap.querySelector('.coe-quiz-result-wrap');
    var resultEl = wrap.querySelector('.coe-quiz-result');
    var reviseBtn = wrap.querySelector('.coe-quiz-revise');

    var current = 0;

    if (progressTotal) { progressTotal.textContent = String(total); }

    function showQuestion(idx) {
      questions.forEach(function (q, i) {
        q.style.display = (i === idx) ? '' : 'none';
      });
      if (progressCurrent) { progressCurrent.textContent = String(idx + 1); }
      if (progressFill) { progressFill.style.width = Math.round(((idx + 1) / total) * 100) + '%'; }
      if (prevBtn) { prevBtn.style.display = (idx === 0) ? 'none' : ''; }
      if (nextBtn) { nextBtn.style.display = (idx === total - 1) ? 'none' : ''; }
      if (submitBtn) { submitBtn.style.display = (idx === total - 1) ? '' : 'none'; }
    }

    function resetQuiz() {
      current = 0;
      questions.forEach(function (q) {
        q.classList.remove('correct', 'incorrect');
        var radios = q.querySelectorAll('input[type="radio"]');
        radios.forEach(function (r) { r.checked = false; });
        var feedback = q.querySelector('.coe-quiz-feedback');
        if (feedback) { feedback.textContent = ''; feedback.style.display = 'none'; }
      });
      showQuestion(0);
    }

    startBtn.addEventListener('click', function () {
      if (courseContent) { courseContent.hidden = true; }
      startBtn.style.display = 'none';
      if (introEl) { introEl.style.display = 'none'; }
      if (resultWrap) { resultWrap.hidden = true; }
      questionsWrap.hidden = false;
      resetQuiz();
      wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (current < total - 1) {
          current++;
          showQuestion(current);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (current > 0) {
          current--;
          showQuestion(current);
        }
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        var correctCount = 0;
        var unanswered = 0;

        questions.forEach(function (q) {
          var correctVal = q.getAttribute('data-correct');
          var selected = q.querySelector('input[type="radio"]:checked');
          var feedback = q.querySelector('.coe-quiz-feedback');
          q.classList.remove('correct', 'incorrect');

          if (!selected) {
            unanswered++;
            if (feedback) { feedback.textContent = 'Not answered.'; feedback.style.display = 'block'; }
            q.classList.add('incorrect');
            return;
          }

          if (selected.value === correctVal) {
            correctCount++;
            q.classList.add('correct');
            if (feedback) { feedback.textContent = 'Correct.'; feedback.style.display = 'block'; }
          } else {
            q.classList.add('incorrect');
            if (feedback) { feedback.textContent = 'Not quite — review the course content and try again.'; feedback.style.display = 'block'; }
          }
        });

        var pct = Math.round((correctCount / total) * 100);
        var msg = 'Score: ' + correctCount + ' / ' + total + ' (' + pct + '%)';
        if (unanswered > 0) {
          msg += ' — ' + unanswered + ' question(s) left unanswered.';
        }
        if (pct >= 80) {
          msg += ' Well done.';
        } else if (pct >= 60) {
          msg += ' Good effort — revise the course content and retake if you like.';
        } else {
          msg += ' Recommend revising the course content above before retaking.';
        }
        if (resultEl) { resultEl.textContent = msg; }

        questionsWrap.hidden = true;
        if (resultWrap) { resultWrap.hidden = false; }
        wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    if (reviseBtn) {
      reviseBtn.addEventListener('click', function () {
        if (resultWrap) { resultWrap.hidden = true; }
        questionsWrap.hidden = true;
        if (courseContent) { courseContent.hidden = false; }
        startBtn.style.display = '';
        if (introEl) { introEl.style.display = ''; }
        resetQuiz();
        var scrollTarget = courseContent || wrap;
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });
});
