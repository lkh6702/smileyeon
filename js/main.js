/* 미소연의원 · 공통 스크립트 */
(function () {
  'use strict';

  /* ---------- 모바일 메뉴 ---------- */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.gnb a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 오늘 진료 상태 (한국 시간 기준) ----------
     진료시간을 바꾸려면 HOURS만 수정하세요. (0=일 ~ 6=토, null=휴진) */
  var HOURS = {
    0: null,
    1: [9, 18], 2: [9, 18], 3: null, 4: [9, 18], 5: [9, 18],
    6: [9, 13]
  };
  var LUNCH = [13, 14];

  function nowKST() {
    var d = new Date();
    var utc = d.getTime() + d.getTimezoneOffset() * 60000;
    return new Date(utc + 9 * 3600000);
  }

  var now = nowKST();
  var day = now.getDay();
  var h = now.getHours() + now.getMinutes() / 60;
  var today = HOURS[day];
  var state, label;
  if (!today) { state = 'closed'; label = '오늘 휴진'; }
  else if (h >= today[0] && h < today[1]) {
    if (day !== 6 && h >= LUNCH[0] && h < LUNCH[1]) { state = 'lunch'; label = '점심시간'; }
    else { state = 'open'; label = '진료 중'; }
  } else { state = 'closed'; label = '진료 종료'; }

  document.querySelectorAll('[data-status]').forEach(function (el) {
    el.className = 'status ' + state;
    el.innerHTML = '<i></i>' + label;
  });
  document.querySelectorAll('[data-day]').forEach(function (row) {
    var days = row.getAttribute('data-day').split(',');
    if (days.indexOf(String(day)) > -1) row.classList.add('today');
  });

  /* ---------- 사진 크게 보기 ---------- */
  var box = document.querySelector('.lightbox');
  if (box) {
    var boxImg = box.querySelector('img');
    var boxCap = box.querySelector('p');
    var close = function () { box.classList.remove('open'); };
    document.querySelectorAll('.gallery figure').forEach(function (fig) {
      fig.setAttribute('tabindex', '0');
      var open = function () {
        var img = fig.querySelector('img');
        boxImg.src = img.src;
        boxImg.alt = img.alt;
        boxCap.textContent = fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : '';
        box.classList.add('open');
      };
      fig.addEventListener('click', open);
      fig.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    });
    box.addEventListener('click', function (e) { if (e.target === box || e.target.tagName === 'BUTTON') close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- 커뮤니티 탭 ---------- */
  var tabs = document.querySelectorAll('.tabs [role="tab"]');
  function selectTab(id) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      selectTab(t.getAttribute('aria-controls'));
      history.replaceState(null, '', '#' + t.getAttribute('aria-controls'));
    });
  });
  if (tabs.length && location.hash && document.getElementById(location.hash.slice(1))) {
    selectTab(location.hash.slice(1));
  }

  /* ---------- 스크롤 등장 효과 ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
