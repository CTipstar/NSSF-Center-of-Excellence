// NSSF Uganda Center of Excellence — reading content pagination
// Behavior:
//  - The hero image, tier badge, and lede paragraph form their own
//    standalone intro page, shown alone before the first subtopic — not
//    alongside it.
//  - After the intro, the numbered subtopic sections (including the
//    closing case-study section) are shown one at a time, mirroring the
//    quiz's one-question-at-a-time pattern, with a progress bar and
//    Previous/Next controls. The progress bar only appears once the
//    reader has moved past the intro page into the subtopics themselves.
//  - "References & Further Learning" only appears once the reader has
//    paged through to the final subtopic.
//  - This runs independently of coe-quiz.js: when "Take Test" hides the
//    whole .coe-course-content block, whatever page was showing stays
//    as-is underneath; when the reader returns via "Revise Course", they
//    land back on that same page.
//  - "Take Test" stays visible the whole time but is disabled (greyed out)
//    until the reader has paged through to the final subtopic, at which
//    point it unlocks and stays unlocked even if they page back to review
//    something.
document.addEventListener('DOMContentLoaded', function () {
  var contents = document.querySelectorAll('.coe-course-content');

  contents.forEach(function (content) {
    var sections = Array.prototype.slice.call(content.children).filter(function (el) {
      return el.classList && el.classList.contains('coe-section');
    });
    var total = sections.length;

    var article = content.closest('article') || content.parentElement;
    var startBtn = article ? article.querySelector('.coe-quiz-start') : null;

    if (total < 2) {
      return;
    }

    if (startBtn) {
      startBtn.disabled = true;
      startBtn.classList.add('coe-quiz-start-locked');
    }

    var resourcesWrap = null;
    Array.prototype.forEach.call(content.children, function (el) {
      if (el.classList && el.classList.contains('coe-resources-wrap')) { resourcesWrap = el; }
    });

    // Everything before the first subtopic (tier badge, hero image, lede
    // paragraph) — captured now, before progressWrap is inserted below,
    // so this only picks up the real intro elements. This is page 0.
    var introEls = [];
    for (var i = 0; i < content.children.length; i++) {
      var child = content.children[i];
      if (child === sections[0]) { break; }
      introEls.push(child);
    }

    var progressWrap = document.createElement('div');
    progressWrap.className = 'coe-quiz-progress-wrap coe-reading-progress-wrap';
    progressWrap.innerHTML =
      '<div class="coe-quiz-progress-label">Section ' +
      '<span class="coe-reading-progress-current">1</span> of ' +
      '<span class="coe-reading-progress-total">' + total + '</span></div>' +
      '<div class="coe-quiz-progress-bar"><div class="coe-quiz-progress-fill coe-reading-progress-fill"></div></div>';

    var navWrap = document.createElement('div');
    navWrap.className = 'coe-quiz-nav coe-reading-nav';
    navWrap.innerHTML =
      '<button type="button" class="coe-reading-prev btn-outline">Previous</button>' +
      '<button type="button" class="coe-reading-next btn-check">Next</button>';

    sections[0].parentNode.insertBefore(progressWrap, sections[0]);
    sections[total - 1].parentNode.insertBefore(navWrap, sections[total - 1].nextSibling);

    var progressCurrent = progressWrap.querySelector('.coe-reading-progress-current');
    var progressFill = progressWrap.querySelector('.coe-reading-progress-fill');
    var prevBtn = navWrap.querySelector('.coe-reading-prev');
    var nextBtn = navWrap.querySelector('.coe-reading-next');

    // Page 0 = intro alone. Pages 1..total = sections[0..total-1].
    var lastPage = total;
    var current = 0;

    function show(idx) {
      var onIntro = (idx === 0);

      introEls.forEach(function (el) {
        el.style.display = onIntro ? '' : 'none';
      });
      sections.forEach(function (s, i) {
        s.style.display = (idx === i + 1) ? '' : 'none';
      });

      progressWrap.style.display = onIntro ? 'none' : '';
      if (!onIntro) {
        progressCurrent.textContent = String(idx);
        progressFill.style.width = Math.round((idx / total) * 100) + '%';
      }

      prevBtn.style.display = onIntro ? 'none' : '';
      nextBtn.style.display = (idx === lastPage) ? 'none' : '';
      if (resourcesWrap) { resourcesWrap.hidden = (idx !== lastPage); }
      if (startBtn && idx === lastPage) {
        startBtn.disabled = false;
        startBtn.classList.remove('coe-quiz-start-locked');
      }
      current = idx;
    }

    nextBtn.addEventListener('click', function () {
      if (current < lastPage) { show(current + 1); }
      content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    prevBtn.addEventListener('click', function () {
      if (current > 0) { show(current - 1); }
      content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    show(0);
  });
});
