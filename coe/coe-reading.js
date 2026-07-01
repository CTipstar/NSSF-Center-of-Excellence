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
//  - Video subtopics also get a blinking "unmute" hint in the subtopic's
//    title row (same row as "N. Watch: ...", right-aligned), with a
//    bouncing arrow pointing down at the video/player below. We cannot see
//    inside the player -- it's a cross-origin iframe -- so this is a
//    nudge, not a real control: it appears on the reader's first click
//    into the video (a reasonable proxy for "pressed play") and then
//    disappears on its own after 4 seconds. Clicking or hovering the hint
//    itself just explains that it isn't a working button and points at
//    the real one.
function setupVideoUnmuteHint(section) {
  var embed = section.querySelector('.coe-video-embed');
  var iframe = embed ? embed.querySelector('iframe') : null;
  if (!iframe) { return null; }

  var titleEl = section.querySelector('.coe-section-title');
  if (titleEl) { titleEl.classList.add('coe-section-title-with-hint'); }

  var hint = document.createElement('div');
  hint.className = 'coe-video-unmute-hint';
  hint.hidden = true;
  // Icon is the Bootstrap Icons "volume-mute-fill" glyph (MIT licensed) --
  // a speaker with an X, the most widely recognized cross-platform symbol
  // for a muted/no-audio state (Font Awesome, Material Design, and
  // Bootstrap Icons all converge on "speaker + X" over a plain speaker).
  // Using it as inline SVG (fill: currentColor) instead of an emoji keeps
  // it rendering identically across OSes/browsers rather than however each
  // platform's emoji font happens to draw a speaker.
  hint.innerHTML =
    '<div class="coe-video-unmute-icon" tabindex="0" role="button" aria-label="Video is muted">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">' +
    '<path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/>' +
    '</svg></div>' +
    '<div class="coe-video-unmute-arrow" aria-hidden="true">&#9662;</div>' +
    '<div class="coe-video-unmute-tooltip">This video starts muted. This icon can’t turn on the sound for you — use the player’s own unmute button below to do that.</div>';
  (titleEl || embed).appendChild(hint);

  var icon = hint.querySelector('.coe-video-unmute-icon');
  var hasPlayed = false;
  var hideTimer = null;

  function onIframeFocused() {
    if (hasPlayed) { return; }
    hasPlayed = true;
    hint.hidden = false;
    hideTimer = window.setTimeout(function () {
      hint.hidden = true;
    }, 9000);
  }

  window.addEventListener('blur', function () {
    if (document.activeElement === iframe) { onIframeFocused(); }
  });

  icon.addEventListener('click', function (e) {
    e.preventDefault();
    hint.classList.add('coe-tooltip-active');
    window.setTimeout(function () { hint.classList.remove('coe-tooltip-active'); }, 4000);
  });

  return function resetHint() {
    hasPlayed = false;
    if (hideTimer) { window.clearTimeout(hideTimer); hideTimer = null; }
    hint.hidden = true;
    hint.classList.remove('coe-tooltip-active');
  };
}

// Category sidebar: on wide viewports (md+, >=992px, where the sidebar
// actually sits beside the reading column rather than stacking below it)
// its height is capped to match the reading column's own height, which
// changes as the reader pages through subtopics. Without this, a long
// category list left the page stretched out with a large empty gap below
// short pages of content (e.g. a video subtopic). The "CENTER OF
// EXCELLENCE" heading stays put; only the link list itself scrolls, via
// .coe-sidebar-capped in coe.css. A ResizeObserver on the content column
// keeps this in sync automatically as pagination, images, or window size
// change its height -- no need to hook into show() directly.
function initSidebarHeightSync() {
  var sidebar = document.querySelector('.sidebar.coe-sidebar');
  var article = document.querySelector('.coe-article');
  if (!sidebar || !article || !article.parentElement) { return; }
  var contentCol = article.parentElement;
  var mq = window.matchMedia('(min-width: 992px)');

  function sync() {
    if (!mq.matches) {
      sidebar.classList.remove('coe-sidebar-capped');
      sidebar.style.height = '';
      return;
    }
    sidebar.classList.add('coe-sidebar-capped');
    sidebar.style.height = Math.ceil(contentCol.getBoundingClientRect().height) + 'px';
  }

  if (window.ResizeObserver) {
    new ResizeObserver(sync).observe(contentCol);
  } else {
    window.addEventListener('resize', sync);
  }
  window.addEventListener('load', sync);
  if (mq.addEventListener) {
    mq.addEventListener('change', sync);
  } else if (mq.addListener) {
    mq.addListener(sync); // Safari <14 fallback
  }
  sync();
}

document.addEventListener('DOMContentLoaded', function () {
  initSidebarHeightSync();

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

    // Set up the unmute hint for this lesson's video section (if it has
    // one), and remember how to reset it.
    var resetUnmuteHint = null;
    sections.forEach(function (s) {
      if (s.querySelector('.coe-video-embed')) { resetUnmuteHint = setupVideoUnmuteHint(s); }
    });

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
      if (resetUnmuteHint) { resetUnmuteHint(); }
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
