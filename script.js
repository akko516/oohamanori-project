/**
 * 大浜海苔 — OHAMA NORI
 * script.js
 */

(function () {
  'use strict';

  /* ======================================================
     1. LOADER
  ====================================================== */
  window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(function () {
      loader.classList.add('hidden');
    }, 1800);
  });

  /* ======================================================
     2. HEADER — scroll class
  ====================================================== */
  const header = document.getElementById('header');
  function handleHeaderScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ======================================================
     3. HAMBURGER / MOBILE NAV
  ====================================================== */
  const hamburger = document.getElementById('hamburger');
  const spNav     = document.getElementById('spNav');
  const spClose   = document.getElementById('spNavClose');
  const spLinks   = document.querySelectorAll('.sp-nav-link');

  function openNav() {
    spNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    spNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openNav);
  if (spClose)   spClose.addEventListener('click', closeNav);
  spLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  /* ======================================================
     4. SCROLL REVEAL  (IntersectionObserver)
  ====================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        // stagger siblings
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ======================================================
     5. PRODUCT TABS
  ====================================================== */
  const tabBtns   = document.querySelectorAll('.ptab');
  const tabPanels = document.querySelectorAll('.product-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.dataset.tab;

      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabPanels.forEach(function (p) { p.classList.remove('active'); });

      btn.classList.add('active');
      const panel = document.getElementById('panel-' + target);
      if (panel) {
        panel.classList.add('active');
        // re-observe new cards
        panel.querySelectorAll('.product-card').forEach(function (card) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          setTimeout(function () {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        });
      }
    });
  });

  /* ======================================================
     6. PAGE TOP BUTTON
  ====================================================== */
  const pageTopBtn = document.getElementById('pageTop');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      pageTopBtn.classList.add('visible');
    } else {
      pageTopBtn.classList.remove('visible');
    }
  }, { passive: true });
  if (pageTopBtn) {
    pageTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ======================================================
     7. SMOOTH SCROLL (anchor links)
  ====================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ======================================================
     8. CONTACT FORM
  ====================================================== */
  const form    = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(function (field) {
        field.style.borderColor = '';
        if (field.type === 'checkbox') {
          if (!field.checked) {
            valid = false;
            field.parentElement.style.color = '#c0392b';
          }
        } else {
          if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = '#c0392b';
          }
        }
      });

      if (!valid) {
        formMsg.style.color = '#c0392b';
        formMsg.textContent = '必須項目を入力してください。';
        return;
      }

      // Simulate submit
      const submitBtn = form.querySelector('.btn-submit');
      submitBtn.textContent = '送信中...';
      submitBtn.disabled = true;

      setTimeout(function () {
        formMsg.style.color = '#2F5D50';
        formMsg.textContent = 'お問い合わせを承りました。2〜3営業日以内にご連絡いたします。';
        form.reset();
        submitBtn.textContent = '送信する';
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  /* ======================================================
     9. ACTIVE NAV HIGHLIGHT (scroll spy)
  ====================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-pc a[href^="#"]');

  const spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.remove('active-nav');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active-nav');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (s) { spyObserver.observe(s); });

  /* ======================================================
     10. CART
  ====================================================== */
  var cart = JSON.parse(localStorage.getItem('ohamaNoriCart') || '[]');

  function saveCart() {
    localStorage.setItem('ohamaNoriCart', JSON.stringify(cart));
  }

  function totalCount() {
    return cart.reduce(function (s, i) { return s + i.qty; }, 0);
  }

  function totalPrice() {
    return cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  }

  function renderCart() {
    var list       = document.getElementById('cartList');
    var emptyMsg   = document.getElementById('cartEmptyMsg');
    var foot       = document.getElementById('cartFoot');
    var totalEl    = document.getElementById('cartTotalPrice');
    var badge      = document.getElementById('cartBadge');
    var spBadge    = document.getElementById('spCartBadge');
    var count      = totalCount();

    // badges (header + mobile nav)
    badge.textContent = count;
    badge.classList.toggle('has-items', count > 0);
    if (spBadge) {
      spBadge.textContent = count > 0 ? count : '';
      spBadge.style.display = count > 0 ? 'flex' : 'none';
    }

    if (cart.length === 0) {
      emptyMsg.classList.add('visible');
      list.innerHTML = '';
      foot.classList.remove('visible');
      return;
    }
    emptyMsg.classList.remove('visible');
    foot.classList.add('visible');
    totalEl.textContent = '¥' + totalPrice().toLocaleString();

    list.innerHTML = cart.map(function (item) {
      return '<li class="cart-item">' +
        '<span class="cart-item-name">' + item.name + '</span>' +
        '<span class="cart-item-price">¥' + (item.price * item.qty).toLocaleString() + '</span>' +
        '<div class="cart-item-qty">' +
          '<button class="cart-qty-btn" data-action="dec" data-id="' + item.id + '">－</button>' +
          '<span>' + item.qty + '点</span>' +
          '<button class="cart-qty-btn" data-action="inc" data-id="' + item.id + '">＋</button>' +
        '</div>' +
        '<button class="cart-item-remove" data-action="remove" data-id="' + item.id + '">削除</button>' +
      '</li>';
    }).join('');
  }

  function openCart() {
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    document.getElementById('cartDrawer').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
    document.getElementById('cartDrawer').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // カートトグル
  var cartToggle = document.getElementById('cartToggle');
  if (cartToggle) cartToggle.addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);

  // モバイルナビのカートボタン
  var spNavCart = document.getElementById('spNavCart');
  if (spNavCart) {
    spNavCart.addEventListener('click', function () {
      closeNav();
      setTimeout(openCart, 300);
    });
  }

  // カートに追加
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-add-cart');
    if (!btn) return;
    var id    = btn.dataset.id;
    var name  = btn.dataset.name;
    var price = parseInt(btn.dataset.price, 10);

    var existing = cart.find(function (i) { return i.id === id; });
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: id, name: name, price: price, qty: 1 });
    }
    saveCart();
    renderCart();

    btn.textContent = '追加しました ✓';
    btn.classList.add('added');
    setTimeout(function () {
      btn.textContent = 'カートに追加';
      btn.classList.remove('added');
    }, 1500);

    openCart();
  });

  // 数量変更・削除
  document.getElementById('cartList').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.dataset.action;
    var id     = btn.dataset.id;
    var idx    = cart.findIndex(function (i) { return i.id === id; });
    if (idx === -1) return;

    if (action === 'inc') {
      cart[idx].qty += 1;
    } else if (action === 'dec') {
      cart[idx].qty -= 1;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
    } else if (action === 'remove') {
      cart.splice(idx, 1);
    }
    saveCart();
    renderCart();
  });

  // 注文フォームへ進む（カート内容をフォームに自動入力）
  document.getElementById('cartOrderBtn').addEventListener('click', function () {
    var lines = cart.map(function (i) {
      return '・' + i.name + ' × ' + i.qty + '点（¥' + (i.price * i.qty).toLocaleString() + '）';
    });
    var msg = '【ご注文内容】\n' + lines.join('\n') +
              '\n合計：¥' + totalPrice().toLocaleString() + '\n\n' +
              '※ お名前・住所・電話番号を下記にご記入ください。';

    var typeSelect = document.querySelector('select[name="type"]');
    var textarea   = document.querySelector('textarea[name="message"]');
    if (typeSelect) typeSelect.value = '家庭用・贈答用商品の購入';
    if (textarea)  textarea.value   = msg;

    closeCart();
    var contact = document.getElementById('contact');
    if (contact) {
      var offset = header ? header.offsetHeight : 0;
      var top = contact.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });

  renderCart();

  /* ======================================================
     11. PARALLAX — hero floating text
  ====================================================== */
  const heroFloating = document.querySelector('.hero-floating-text');
  if (heroFloating) {
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      heroFloating.style.transform = 'translateY(calc(-50% + ' + (y * 0.25) + 'px))';
    }, { passive: true });
  }

  /* ======================================================
     11. CURSOR GLOW (desktop only)
  ====================================================== */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = [
      'position:fixed', 'pointer-events:none', 'z-index:9000',
      'width:320px', 'height:320px', 'border-radius:50%',
      'background:radial-gradient(circle, rgba(200,169,106,0.06) 0%, transparent 70%)',
      'transform:translate(-50%,-50%)', 'transition:left 0.3s ease,top 0.3s ease',
      'left:-999px', 'top:-999px'
    ].join(';');
    document.body.appendChild(glow);

    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

})();
