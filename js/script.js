(() => {
  "use strict";

  // Demo number: intentionally non-operational placeholder.
  const DEMO_WHATSAPP = "910000000000";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const header = $("#siteHeader");
  const menuToggle = $("#menuToggle");
  const nav = $("#primaryNav");
  const scrollTop = $("#scrollTop");

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
    scrollTop.classList.toggle("show", window.scrollY > 650);
  }, {passive:true});

  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  $$("#primaryNav a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }));

  // Smooth navigation for browsers where native smooth scrolling is unavailable.
  $$(".primary-nav a, .brand, .hero a, .text-link, .collection-card a").forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  // Active navigation state.
  const sections = $$("main section[id]");
  const navLinks = $$("#primaryNav a[href^='#']");
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
      }
    });
  }, {rootMargin:"-35% 0px -55% 0px", threshold:0});
  sections.forEach(section => sectionObserver.observe(section));

  // Reveal-on-scroll.
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  $$(".reveal").forEach(el => revealObserver.observe(el));

  // WhatsApp links. Clearly points to a demo placeholder number.
  $$(".js-whatsapp").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const message = link.dataset.message || "Hi, I found your furniture website and would like to know more about your products.";
      const url = `https://wa.me/${DEMO_WHATSAPP}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });

  scrollTop?.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

  // Testimonials.
  const testimonials = [
    "Beautiful design and excellent attention to detail.",
    "Very happy with the furniture quality and service.",
    "Great options for modern home interiors."
  ];
  let quoteIndex = 0;
  const quoteText = $("#quoteText"), quoteCount = $("#quoteCount");
  function renderQuote() {
    quoteText.textContent = testimonials[quoteIndex];
    quoteCount.textContent = `0${quoteIndex + 1} / 0${testimonials.length}`;
  }
  $("#prevQuote")?.addEventListener("click", () => { quoteIndex = (quoteIndex - 1 + testimonials.length) % testimonials.length; renderQuote(); });
  $("#nextQuote")?.addEventListener("click", () => { quoteIndex = (quoteIndex + 1) % testimonials.length; renderQuote(); });

  // Contact form: client-side demo only.
  const form = $("#contactForm"), status = $("#formStatus");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = "Please complete the required fields.";
      return;
    }
    status.textContent = "Demo submission successful — no enquiry was actually sent. In a live site, this would connect to the business inbox or CRM.";
    form.reset();
  });

  // Lightbox with keyboard support.
  const lightbox = $("#lightbox"), lbImage = $("#lightboxImage"), lbCaption = $("#lightboxCaption");
  const galleryItems = $$(".gallery-item");
  let galleryIndex = 0;
  function openLightbox(index) {
    galleryIndex = index;
    const item = galleryItems[galleryIndex];
    const img = $("img", item);
    lbImage.src = item.dataset.full;
    lbImage.alt = img.alt;
    lbCaption.textContent = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#lightboxClose")?.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImage.src = "";
  }
  function stepLightbox(dir) {
    openLightbox((galleryIndex + dir + galleryItems.length) % galleryItems.length);
  }
  galleryItems.forEach((item, i) => item.addEventListener("click", () => openLightbox(i)));
  $("#lightboxClose")?.addEventListener("click", closeLightbox);
  $("#lightboxPrev")?.addEventListener("click", () => stepLightbox(-1));
  $("#lightboxNext")?.addEventListener("click", () => stepLightbox(1));
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
})();
