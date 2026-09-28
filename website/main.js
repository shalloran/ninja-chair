(function () {
  const site = window.NINJACHAIR_SITE || {};

  function applySiteConfig() {
    document.querySelectorAll("[data-site]").forEach((el) => {
      const key = el.getAttribute("data-site");
      if (key && site[key] != null) {
        el.textContent = String(site[key]);
      }
    });
    document.querySelectorAll("[data-mailto]").forEach((el) => {
      const email = site.submitEmail || "hi@ninjachair.com";
      el.setAttribute("href", "mailto:" + email);
      if (el.hasAttribute("data-mailto-label")) {
        el.textContent = email;
      }
    });
    if (site.siteName) {
      const title = document.querySelector("title");
      if (title && title.hasAttribute("data-site-title")) {
        title.textContent = site.siteName;
      }
    }
  }

  function drawingsUrl() {
    // home page lives at / ; about at /about/
    const base = document.body.getAttribute("data-asset-base") || "";
    return base + "data/drawings.json";
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

  async function renderGallery() {
    const root = document.getElementById("gallery");
    const err = document.getElementById("gallery-error");
    if (!root) return;

    try {
      const res = await fetch(drawingsUrl());
      if (!res.ok) throw new Error("could not load drawings");
      const rows = await res.json();
      root.replaceChildren();
      rows.forEach((row) => {
        const fig = document.createElement("figure");
        fig.className = "tile";
        fig.tabIndex = 0;
        fig.setAttribute("role", "button");
        fig.setAttribute("aria-label", "Open " + row.title);

        const img = document.createElement("img");
        const base = document.body.getAttribute("data-asset-base") || "";
        img.src = base + row.image;
        img.alt = row.title;
        img.loading = "lazy";
        img.decoding = "async";

        const cap = document.createElement("figcaption");
        cap.textContent = row.title;

        fig.append(img, cap);
        const open = () => openLightbox(row.title, base + row.image);
        fig.addEventListener("click", open);
        fig.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            open();
          }
        });
        root.append(fig);
      });
    } catch (e) {
      if (err) {
        err.hidden = false;
        err.textContent = "Gallery could not load. Try again later.";
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
  renderGallery();
})();
