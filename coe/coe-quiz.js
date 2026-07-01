// NSSF Uganda Center of Excellence — client-side quiz scoring
// No backend required: scores are computed in-browser from data-correct attributes.
document.addEventListener('DOMContentLoaded', function () {
  // Quiz questions stay hidden until "Take Test" is clicked.
  var startButtons = document.querySelectorAll('.coe-quiz-start');
  startButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.closest('.coe-quiz-wrap');
      if (!wrap) return;
      var questions = wrap.querySelector('.coe-quiz-questions');
      if (questions) {
        questions.hidden = false;
        questions.style.display = '';
      }
      btn.style.display = 'none';
      if (questions) {
        questions.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  var forms = document.querySelectorAll('.coe-quiz-form');
  forms.forEach(function (form) {
    var submitBtn = form.querySelector('.coe-quiz-submit');
    var resultEl = form.querySelector('.coe-quiz-result');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', function () {
      var questions = form.querySelectorAll('.coe-quiz-q');
      var total = questions.length;
      var correctCount = 0;
      var unanswered = 0;

      questions.forEach(function (q) {
        var correctVal = q.getAttribute('data-correct');
        var selected = q.querySelector('input[type="radio"]:checked');
        var feedback = q.querySelector('.coe-quiz-feedback');
        q.classList.remove('correct', 'incorrect');

        if (!selected) {
          unanswered++;
          if (feedback) { feedback.textContent = 'Not answered.'; }
          q.classList.add('incorrect');
          if (feedback) feedback.style.display = 'block';
          return;
        }

        if (selected.value === correctVal) {
          correctCount++;
          q.classList.add('correct');
          if (feedback) feedback.textContent = 'Correct.';
        } else {
          q.classList.add('incorrect');
          if (feedback) feedback.textContent = 'Not quite — review this section and try again.';
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
        msg += ' Good effort — review the sections above and retake if you like.';
      } else {
        msg += ' Recommend re-reading the material above before retaking.';
      }
      resultEl.textContent = msg;
    });
  });
});
