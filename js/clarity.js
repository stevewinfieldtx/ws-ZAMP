/* Microsoft Clarity — heatmaps, session recordings, and behavior analytics.
   Set your Project ID below (Clarity dashboard → Settings → "Get tracking code"
   — it's the 10-character string at the end of the snippet). Until it's set,
   this stays dormant and makes no network calls. */
(function () {
  var CLARITY_PROJECT_ID = "x2t4x8y7wm";
  if (!CLARITY_PROJECT_ID || CLARITY_PROJECT_ID === "REPLACE_WITH_CLARITY_PROJECT_ID") return;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
})();
