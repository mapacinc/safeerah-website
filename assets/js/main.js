document.documentElement.classList.add('js');
(function () {
  var S = window.SITE;
  var $ = function (selector, root) {
    return [].slice.call((root || document).querySelectorAll(selector));
  };
  function isHttpsUrl(value) {
    try {
      return new URL(value).protocol === 'https:';
    } catch (error) {
      return false;
    }
  }

  $('[data-site]').forEach(function (element) {
    var value = S[element.dataset.site];
    if (value) element.textContent = value;
  });

  var taxCopy = {
    unconfirmed: [
      'Tax status has not been confirmed. Add verified information before launch.',
      'Tax status not confirmed'
    ]
  }[S.taxStatus] || [];
  $('[data-tax]').forEach(function (element) { element.textContent = taxCopy[0] || ''; });
  $('[data-tax-short]').forEach(function (element) { element.textContent = taxCopy[1] || ''; });

  var year = document.getElementById('yr');
  if (year) year.textContent = new Date().getFullYear();

  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
  }

  var themeButtons = $('[data-theme-toggle]');
  if (themeButtons.length) {
    var theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    function setTheme(value) {
      theme = value;
      document.documentElement.dataset.theme = value;
      themeButtons.forEach(function (button) {
        button.querySelector('[data-theme-icon]').textContent = value === 'dark' ? '☀' : '☾';
        button.querySelector('[data-theme-label]').textContent = value === 'dark' ? 'Light' : 'Dark';
        button.setAttribute('aria-label', 'Switch to ' + (value === 'dark' ? 'light' : 'dark') + ' mode');
        button.setAttribute('aria-pressed', value === 'dark' ? 'true' : 'false');
      });
      try {
        localStorage.setItem('safeerah-theme', value);
      } catch (error) {
        // Theme switching still works when browser storage is unavailable.
      }
    }
    setTheme(theme);
    themeButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      });
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    $('.rv').forEach(function (element) { observer.observe(element); });
  } else {
    $('.rv').forEach(function (element) { element.classList.add('in'); });
  }

  var give = document.getElementById('give');
  if (give) {
    var fund = new URLSearchParams(location.search).get('fund');
    var state = {
      amount: S.amounts[1],
      frequency: 'monthly',
      fund: S.funds[fund] ? fund : 'general'
    };
    var checkoutUrl = S.donate.url;
    var embedUrl = S.donate.embedUrl;

    if (embedUrl && !isHttpsUrl(embedUrl)) {
      give.innerHTML = '<p class="availability" role="status">Donation form is unavailable. Verify its HTTPS address before enabling it.</p>';
    } else if (embedUrl && document.body.classList.contains('donate')) {
      var iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.title = 'Donation form';
      iframe.loading = 'lazy';
      iframe.style.cssText = 'width:100%;min-height:720px;border:0';
      give.replaceChildren(iframe);
    } else if (!checkoutUrl && !embedUrl) {
      give.innerHTML = '<p class="availability" role="status">Online giving is not available yet. Verified donation details will be added here before launch.</p>';
    } else if (!checkoutUrl && embedUrl) {
      give.innerHTML = '<p class="availability">Open the donation form on our <a href="donate.html">donation page</a>.</p>';
    } else if (!isHttpsUrl(checkoutUrl)) {
      give.innerHTML = '<p class="availability" role="status">Donation checkout is unavailable. Verify its HTTPS address before enabling it.</p>';
    } else {
      var controls = '<div class="seg" role="group" aria-label="Frequency"><button type="button" data-f="monthly" class="on">Monthly</button><button type="button" data-f="once">One time</button></div>' +
        '<div class="amts">' + S.amounts.map(function (amount) {
          return '<button type="button" data-a="' + amount + '"' + (amount === state.amount ? ' class="on"' : '') + '>$' + amount + '</button>';
        }).join('') + '<label class="oth">$<input type="number" min="1" inputmode="numeric" placeholder="Other" aria-label="Other amount"></label></div>' +
        '<label class="sel">Designate my gift<select>' + Object.keys(S.funds).map(function (key) {
          return '<option value="' + key + '"' + (key === state.fund ? ' selected' : '') + '>' + S.funds[key] + '</option>';
        }).join('') + '</select></label><button type="button" class="btn btn-gold wide" id="go">Continue to checkout</button><p class="msg" role="status"></p>';
      give.innerHTML = controls;

      var message = give.querySelector('.msg');
      var otherAmount = give.querySelector('.oth input');
      give.addEventListener('click', function (event) {
        var target = event.target;
        if (target.dataset.f) {
          state.frequency = target.dataset.f;
          $('[data-f]', give).forEach(function (button) { button.classList.toggle('on', button === target); });
        }
        if (target.dataset.a) {
          state.amount = Number(target.dataset.a);
          otherAmount.value = '';
          $('[data-a]', give).forEach(function (button) { button.classList.toggle('on', button === target); });
        }
      });
      otherAmount.addEventListener('input', function () {
        state.amount = Number(otherAmount.value) || 0;
        $('[data-a]', give).forEach(function (button) { button.classList.remove('on'); });
      });
      give.querySelector('select').addEventListener('change', function (event) {
        state.fund = event.target.value;
      });
      document.getElementById('go').addEventListener('click', function () {
        if (!state.amount || state.amount < 1) {
          message.textContent = 'Please choose a valid amount.';
          return;
        }
        var url = new URL(checkoutUrl);
        url.searchParams.set('amount', state.amount);
        url.searchParams.set('frequency', state.frequency);
        url.searchParams.set('designation', state.fund);
        location.href = url.toString();
      });
    }
  }

  $('form[data-form]').forEach(function (form) {
    var message = $('.msg', form)[0];
    var validEndpoint = isHttpsUrl(S.formEndpoint);
    if ((S.formEndpoint && !validEndpoint) || (!validEndpoint && !S.email)) {
      form.querySelectorAll('input,select,textarea,button').forEach(function (control) {
        control.disabled = true;
      });
      message.textContent = S.formEndpoint && !validEndpoint
        ? 'This form is unavailable. Verify its HTTPS destination before enabling it.'
        : 'This form is not connected yet. Verified contact details will be added before launch.';
      return;
    }
    form.querySelectorAll('input,select,textarea,button').forEach(function (control) {
      control.disabled = false;
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(form);
      if (validEndpoint) {
        fetch(S.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (response) {
            if (!response.ok) throw new Error('Form submission failed.');
            form.reset();
            message.textContent = 'Thank you! We received your message.';
          })
          .catch(function () {
            message.textContent = S.email ? 'Something went wrong. Please email ' + S.email + '.' : 'Something went wrong. Please try again later.';
          });
      } else {
        var lines = [];
        data.forEach(function (value, key) { lines.push(key + ': ' + value); });
        location.href = 'mailto:' + S.email + '?subject=' +
          encodeURIComponent('Website: ' + form.dataset.form) + '&body=' + encodeURIComponent(lines.join('\n'));
      }
    });
  });
})();
