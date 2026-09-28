(function () {
  const site = window.NINJACHAIR_SITE || {};

  function assetBase() {
    return document.body.getAttribute("data-asset-base") || "";
  }

  function mailAddress() {
    // stitch the address only in js
    return (site.mailUser || "hi") + String.fromCharCode(64) + (site.mailHost || "ninjachair.com");
  }

  function mailDisplay() {
    return site.mailDisplay || (site.mailUser || "hi") + " AT " + (site.mailHost || "ninjachair.com");
  }

  function applySiteConfig() {
    document.querySelectorAll("[data-site]").forEach((el) => {
      const key = el.getAttribute("data-site");
      if (key && site[key] != null) {
        el.textContent = String(site[key]);
      }
    });
    document.querySelectorAll("[data-mailto]").forEach((el) => {
      const shown = mailDisplay();
      el.setAttribute("href", "#");
      el.setAttribute("role", "link");
      if (el.hasAttribute("data-mailto-label")) {
        el.textContent = shown;
      }
      el.addEventListener("click", (ev) => {
        ev.preventDefault();
        window.location.href = "mailto:" + mailAddress();
      });
    });
    if (site.siteName) {
      const title = document.querySelector("title");
      if (title && title.hasAttribute("data-site-title")) {
        title.textContent = site.siteName;
      }
    }
  }

  function openLightbox(title, src) {
    const box = document.getElementById("lightbox");
    if (!box) return;
    const img = box.querySelector("img");
    const caption = box.querySelector("[data-lightbox-title]");
    if (img) {
      img.src = src;
      img.alt = title;
    }
    if (caption) caption.textContent = title;
    box.classList.add("is-open");
    box.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    const box = document.getElementById("lightbox");
    if (!box) return;
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden", "true");
  }

  function wireLightbox() {
    const box = document.getElementById("lightbox");
    if (!box) return;
    box.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
    box.addEventListener("click", (ev) => {
      if (ev.target === box) closeLightbox();
    });
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") closeLightbox();
    });
  }

  async function renderStories() {
    const root = document.getElementById("gallery");
    const err = document.getElementById("gallery-error");
    if (!root) return;

    const base = assetBase();
    try {
      const res = await fetch(base + "data/stories.json");
      if (!res.ok) throw new Error("could not load stories");
      const rows = await res.json();
      root.replaceChildren();
      rows.forEach((row) => {
        const link = document.createElement("a");
        link.className = "tile tile-story";
        link.href = base + row.href;
        link.setAttribute("aria-label", "Read " + row.title);

        const fig = document.createElement("figure");
        const img = document.createElement("img");
        img.src = base + row.cover;
        img.alt = row.title;
        img.loading = "lazy";
        img.decoding = "async";

        const cap = document.createElement("figcaption");
        const title = document.createElement("span");
        title.className = "tile-title";
        title.textContent = row.title;
        const blurb = document.createElement("span");
        blurb.className = "tile-blurb";
        blurb.textContent = row.blurb || "";
        cap.append(title, blurb);

        fig.append(img, cap);
        link.append(fig);
        root.append(link);
      });
    } catch (e) {
      if (err) {
        err.hidden = false;
        err.textContent = "Gallery could not load. Try again later.";
      }
    }
  }

  async function renderStoryReader() {
    const root = document.getElementById("story-pages");
    const heading = document.getElementById("story-title");
    const blurbEl = document.getElementById("story-blurb");
    const err = document.getElementById("story-error");
    if (!root) return;

    const storyId = document.body.getAttribute("data-story-id");
    const base = assetBase();
    try {
      const res = await fetch(base + "data/stories.json");
      if (!res.ok) throw new Error("could not load stories");
      const rows = await res.json();
      const story = rows.find((row) => row.id === storyId);
      if (!story) throw new Error("story not found");

      if (heading) heading.textContent = story.title;
      if (blurbEl) blurbEl.textContent = story.blurb || "";
      document.title = story.title + " — NinjaChair";

      root.replaceChildren();
      const total = story.pages.length;
      story.pages.forEach((page, index) => {
        const fig = document.createElement("figure");
        fig.className = "story-page";

        const img = document.createElement("img");
        img.src = base + page;
        img.alt = story.title + ", page " + (index + 1);
        img.loading = index === 0 ? "eager" : "lazy";
        img.decoding = "async";

        const cap = document.createElement("figcaption");
        cap.textContent = index + 1 + " / " + total;

        fig.append(img, cap);
        root.append(fig);
      });
    } catch (e) {
      if (err) {
        err.hidden = false;
        err.textContent = "This story could not load. Try again later.";
      }
    }
  }

  function stampMotion() {
    document.querySelectorAll(".seal, .about-seal").forEach((el) => {
      el.classList.add("stamp-in");
    });
  }

  applySiteConfig();
  wireLightbox();
  stampMotion();
  renderStories();
  renderStoryReader();
})();
