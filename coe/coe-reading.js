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
//  - "Knowledge Check: [Topic]" and "References & Further Learning" both
//    only appear once the reader reaches the final subtopic, stacked in
//    that order (Knowledge Check above References) below it.
//  - .coe-quiz-wrap has to stay a sibling of .coe-course-content (not
//    nested inside it), because coe-quiz.js hides the whole course-content
//    block when a test starts -- nesting the quiz inside it would hide the
//    quiz questions too. So .coe-resources-wrap is relocated at setup time
//    to sit right after .coe-quiz-wrap, giving the visual order
//    Knowledge Check -> References without breaking that mechanic.
//  - References is explicitly re-hidden the moment "Take Test" is
//    clicked (mirroring how the reading content itself disappears during
//    the test) and restored on "Revise Course" / abandon, if the reader
//    is still on the final subtopic.
//  - "Take Test" stays visible the whole time but is disabled (greyed out)
//    until the reader has paged through to the final subtopic, at which
//    point it unlocks and stays unlocked even if they page back to review
//    something.
//  - Video subtopics: navigating away (Previous/Next) or starting the test
//    stops any playing video immediately, by reloading its iframe -- there
//    is no player API to hook into reliably, but a reload always halts
//    playback. It will not resume on its own; the reader has to press play
//    again themselves.
document.addEventListener('DOMContentLoaded', function () {
  var contents = document.querySelectorAll('.coe-course-content');

  contents.forEach(function (content) {
    var sections = Array.prototype.slice.call(content.children).filter(function (el) {
      return el.classList && el.classList.contains('coe-section');
    });
    var total = sections.length;

    var article = content.closest('article') || content.parentElement;
    var startBtn = article ? article.querySelector('.coe-quiz-start') : null;
    var quizWrap = article ? article.querySelector('.coe-quiz-wrap') : null;
    var reviseBtn = article ? article.querySelector('.coe-quiz-revise') : null;
    var abandonBtn = article ? article.querySelector('.coe-quiz-abandon') : null;

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

    // Move References out from inside course-content to sit right after
    // the quiz block, so it renders visually below "Knowledge Check"
    // instead of above it.
    if (resourcesWrap && quizWrap) {
      quizWrap.parentNode.insertBefore(resourcesWrap, quizWrap.nextSibling);
    }

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
    // Reaching page "total" (the final subtopic) also reveals Knowledge
    // Check and References beneath it.
    var lastPage = total;
    var current = 0;

    function stopVideoOnPage(idx) {
      if (idx < 1 || idx > total) { return; }
      var sectionEl = sections[idx - 1];
      var iframe = sectionEl.querySelector('.coe-video-embed iframe');
      if (iframe) {
        // Reassigning the same src forces the browser to reload the
        // iframe, which halts whatever was playing. The player does not
        // autoplay on load, so it simply sits idle until pressed play again.
        iframe.src = iframe.src;
      }
    }

    function show(idx) {
      var onIntro = (idx === 0);
      var onLastPage = (idx === lastPage);

      if (current !== idx) { stopVideoOnPage(current); }

      introEls.forEach(function (el) {
        el.style.display = onIntro ? '' : 'none';
      });
      sections.forEach(function (s, i) {
        s.style.display = (idx === i + 1) ? '' : 'none';
      });

      if (quizWrap) { quizWrap.hidden = !onLastPage; }
      if (resourcesWrap) { resourcesWrap.hidden = !onLastPage; }

      progressWrap.style.display = onIntro ? 'none' : '';
      if (!onIntro) {
        progressCurrent.textContent = String(idx);
        progressFill.style.width = Math.round((idx / total) * 100) + '%';
      }

      prevBtn.style.display = onIntro ? 'none' : '';
      nextBtn.style.display = onLastPage ? 'none' : '';
      if (startBtn && onLastPage) {
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

    // References hides the moment a test starts (same idea as the reading
    // content disappearing), and comes back once the reader returns via
    // Revise Course / abandon, as long as they're still on the final page.
    if (startBtn) {
      startBtn.addEventListener('click', function () {
        if (resourcesWrap) { resourcesWrap.hidden = true; }
        stopVideoOnPage(current);
      });
    }

    function restoreReferencesIfOnLastPage() {
      if (resourcesWrap) { resourcesWrap.hidden = (current !== lastPage); }
    }
    if (reviseBtn) { reviseBtn.addEventListener('click', restoreReferencesIfOnLastPage); }
    if (abandonBtn) { abandonBtn.addEventListener('click', restoreReferencesIfOnLastPage); }

    show(0);
  });
});
