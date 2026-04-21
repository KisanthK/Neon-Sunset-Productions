/**
 * K Bros Landscaping — Interlock Repair Landing Page
 * Comparison Slider: Fixes image shifting and ensures section stability.
 */

(function () {
  'use strict';

  function initComparisonSlider() {
    var wrapper = document.querySelector('.comparison-wrapper');
    var clip = document.getElementById('comparison-clip');
    var handle = document.getElementById('comparison-handle');

    if (!wrapper || !clip || !handle) return;

    var beforeImg = clip.querySelector('img');

    /**
     * LOCK IMAGE LOGIC:
     * Forces the "Before" image to always match the container size
     * so it doesn't move or 'wiggle' when the slider moves.
     */
    function syncImageSize() {
      var width = wrapper.offsetWidth;
      var height = wrapper.offsetHeight;
      beforeImg.style.width = width + 'px';
      beforeImg.style.height = height + 'px';
      beforeImg.style.maxWidth = 'none';
    }

    window.addEventListener('resize', syncImageSize);

    if (beforeImg.complete) {
      syncImageSize();
    } else {
      beforeImg.addEventListener('load', syncImageSize);
    }

    function setPercent(p) {
      var percent = Math.max(0, Math.min(100, p));
      clip.style.width = percent + '%';
      handle.style.left = percent + '%';
    }

    function getPercentFromEvent(e) {
      var rect = wrapper.getBoundingClientRect();
      var x = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
      return ((x - rect.left) / rect.width) * 100;
    }

    function onMove(e) {
      window.requestAnimationFrame(function () {
        setPercent(getPercentFromEvent(e));
      });
    }

    function onEnd() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      wrapper.classList.remove('active');
    }

    handle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      wrapper.classList.add('active');
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
    });

    handle.addEventListener('touchstart', function (e) {
      wrapper.classList.add('active');
      document.addEventListener('touchmove', onMove, { passive: true });
      document.addEventListener('touchend', onEnd);
    }, { passive: true });

    // Allow clicking anywhere on the wrapper to jump the slider
    wrapper.addEventListener('click', function (e) {
      if (e.target === handle || handle.contains(e.target)) return;
      setPercent(getPercentFromEvent(e));
    });

    // Start at 50%
    setPercent(50);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComparisonSlider);
  } else {
    initComparisonSlider();
  }

})();
