(function () {
  var idMeta = document.querySelector('meta[name="google-analytics-id"]');
  var measurementId = idMeta ? idMeta.getAttribute("content") : "";
  var storageKey = "pandh_analytics_consent";
  var loaded = false;

  if (!measurementId) {
    return;
  }

  function getChoice() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function setChoice(value) {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch (error) {
      return;
    }
  }

  function loadAnalytics() {
    if (loaded || window.gtag) {
      return;
    }

    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function removeBanner() {
    var banner = document.querySelector(".cookie-banner");
    if (banner) {
      banner.remove();
    }
  }

  function createButton(text, className, onClick) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
  }

  function showBanner() {
    if (document.querySelector(".cookie-banner")) {
      return;
    }

    var banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.setAttribute("aria-label", "Analytics cookies");

    var text = document.createElement("p");
    text.appendChild(document.createTextNode("We use optional Google Analytics cookies to understand which pages help visitors. "));

    var link = document.createElement("a");
    link.href = "terms.html";
    link.textContent = "Read our terms";
    text.appendChild(link);
    text.appendChild(document.createTextNode("."));

    var actions = document.createElement("div");
    actions.className = "cookie-actions";
    actions.appendChild(createButton("Decline", "cookie-btn cookie-btn-alt", function () {
      setChoice("declined");
      removeBanner();
    }));
    actions.appendChild(createButton("Accept analytics", "cookie-btn", function () {
      setChoice("accepted");
      removeBanner();
      loadAnalytics();
    }));

    banner.appendChild(text);
    banner.appendChild(actions);
    document.body.appendChild(banner);
  }

  if (getChoice() === "accepted") {
    loadAnalytics();
    return;
  }

  if (getChoice() === "declined") {
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showBanner);
  } else {
    showBanner();
  }
}());
