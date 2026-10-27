(function () {
  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const form = document.getElementById("inquiryForm");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menuScrim = document.getElementById("menuScrim");
  const menuClose = document.getElementById("menuClose");
  let menuClosingTimer = null;
  let menuScrollY = 0;

  function setMenu(open) {
    if (!mobileNav || !menuBtn) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (menuClosingTimer) {
      clearTimeout(menuClosingTimer);
      menuClosingTimer = null;
    }
    const d = (typeof i18nDicts !== "undefined" && i18nDicts[currentLang]) || {};
    if (open) {
      mobileNav.hidden = false;
      if (menuScrim) menuScrim.hidden = false;
      menuScrollY = window.scrollY || window.pageYOffset || 0;
      document.documentElement.classList.add("menu-open");
      document.body.classList.add("menu-open");
      document.body.style.top = "-" + menuScrollY + "px";
      if (reduce) {
        mobileNav.classList.add("open");
        if (menuScrim) menuScrim.classList.add("open");
      } else {
        void mobileNav.offsetWidth;
        requestAnimationFrame(() => {
          mobileNav.classList.add("open");
          if (menuScrim) menuScrim.classList.add("open");
        });
      }
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", d["aria.menuClose"] || "Close menu");
      const focusEl = menuClose || mobileNav.querySelector("a, button");
      if (focusEl) setTimeout(() => focusEl.focus(), reduce ? 0 : 50);
    } else {
      mobileNav.classList.remove("open");
      if (menuScrim) menuScrim.classList.remove("open");
      document.documentElement.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
      document.body.style.top = "";
      window.scrollTo(0, menuScrollY);
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", d["aria.menuOpen"] || "Open menu");
      const hide = () => {
        mobileNav.hidden = true;
        if (menuScrim) menuScrim.hidden = true;
        menuClosingTimer = null;
      };
      if (reduce) hide();
      else menuClosingTimer = setTimeout(hide, 340);
      menuBtn.focus();
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => setMenu(!mobileNav.classList.contains("open")));
  }
  if (menuClose) menuClose.addEventListener("click", () => setMenu(false));
  if (menuScrim) menuScrim.addEventListener("click", () => setMenu(false));
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
  }
  function menuFocusables() {
    if (!mobileNav) return [];
    return Array.from(
      mobileNav.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => {
      if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") return false;
      const style = window.getComputedStyle(el);
      return style.visibility !== "hidden" && style.display !== "none";
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!mobileNav || !mobileNav.classList.contains("open")) return;
    if (e.key === "Escape") {
      setMenu(false);
      return;
    }
    if (e.key !== "Tab") return;
    const list = menuFocusables();
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });


  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      i18nAlert("form.alert", "Thanks! This is a front-end demo — inquiry submit is demo-only and will be connected after they invest. Please call, email, or WhatsApp the lodge for now.");
    });
  }

  const els = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("in"));
  }


  /* --- i18n: TH/EN flag selector (embedded dicts for file:// + JSON files kept) --- */
  const LANG_KEY = "pattaya-demo-lang";
  const i18nDicts = {
    en: {"meta.title": "The BJ Holiday Lodge | North Pattaya Beach", "meta.description": "The BJ Holiday Lodge — contemporary Thai-style rooms ~100m from North Pattaya Beach. See it, Feel it.", "aria.home": "The BJ Holiday Lodge home", "aria.primaryNav": "Primary", "aria.menuOpen": "Open menu", "aria.menuClose": "Close menu", "aria.langSwitch": "Language", "aria.roomsPreview": "Room atmosphere photos", "nav.rooms": "Rooms", "nav.facilities": "Facilities", "nav.location": "Location", "nav.book": "Book", "nav.contact": "Contact", "nav.compare": "Compare old vs new", "nav.cta": "Inquiry", "nav.whatsapp": "Chat on WhatsApp", "hero.pill": "~100 m from the beach · Soi 3 North Pattaya", "hero.title": "The BJ <em>Holiday Lodge</em>", "hero.tagline": "See it, Feel it", "hero.lead": "Make yourself at home in the heart of Pattaya City. Fifty contemporary Thai-style rooms on North Pattaya Beach Road, Soi 3 — only about 100 meters from the sand.", "hero.ctaBook": "Send booking inquiry", "hero.ctaWhatsapp": "Chat on WhatsApp", "stat.roomsStrong": "50", "stat.roomsSpan": "Thai-style rooms", "stat.beachStrong": "~100 m", "stat.beachSpan": "to the beach", "stat.poolStrong": "Pool", "stat.poolSpan": "& restaurant", "float.strong": "Private balcony vibes", "float.span": "Enjoy the sea breeze and sunset from your room", "alt.hero": "The BJ Holiday Lodge pool and guest-room balconies", "alt.room1": "BJ Holiday Lodge Thai-style guest room", "alt.room2": "BJ Holiday Lodge double guest room", "alt.pool": "BJ Holiday Lodge swimming pool", "loc.band": "Located on <strong>North Pattaya Beach Road, Soi 3</strong> — in the heart of Pattaya City and only <strong>~100 meters from the beach</strong>.", "rooms.label": "Rooms", "rooms.title": "Contemporary Thai-style rooms", "rooms.lead": "50 comfortable rooms with the essentials for a relaxing holiday by the beach.", "feat.ac.h": "Remote A/C", "feat.ac.p": "Stay cool with remote-control air conditioning in every room.", "feat.tv.h": "Cable TV", "feat.tv.p": "Unwind with cable television after a day on the beach.", "feat.shower.h": "Hot & cold shower", "feat.shower.p": "Thai-style bathroom with hot & cold shower stall.", "feat.safe.h": "Safety box", "feat.safe.p": "Personal electrical safety box for your valuables.", "feat.balcony.h": "Private balcony", "feat.balcony.p": "Enjoy the sea breeze and sunset from your own balcony.", "feat.thai.h": "Thai-style comfort", "feat.thai.p": "Contemporary Thai design that feels welcoming and familiar.", "fac.label": "Facilities", "fac.title": "Conveniences for a carefree stay", "fac.lead": "Everything you need near North Pattaya Beach.", "fac.elevator": "Elevator", "fac.pool": "Swimming pool", "fac.bar": "Bar & restaurant", "fac.roomService": "Room service", "fac.laundry": "Laundry service", "fac.wifi": "Free WiFi", "fac.pc": "2 PCs (40฿/hour)", "fac.cams": "Security cameras", "fac.parking": "Underground parking", "inq.label": "Book", "inq.title": "Booking inquiry", "inq.lead": "Tell us your dates — WhatsApp for a quick reply, or send the form below.", "form.name": "Full name", "form.namePh": "Your name", "form.email": "Email", "form.emailPh": "you@email.com", "form.phone": "Phone / WhatsApp", "form.phonePh": "+66 …", "form.guests": "Guests", "form.g1": "1 guest", "form.g2": "2 guests", "form.g3": "3 guests", "form.g4": "4+ guests", "form.checkin": "Check-in", "form.checkout": "Check-out", "form.message": "Message / room preferences", "form.messagePh": "Room preferences or questions…", "form.submit": "Send inquiry", "form.note": "Demo only — inquiry submit is not connected yet. Live booking is wired after they invest. Call, email, or WhatsApp anytime.", "form.alert": "Thanks! This is a front-end demo — inquiry submit is demo-only and will be connected after they invest. Please call, email, or WhatsApp the lodge for now.", "contact.label": "Contact", "contact.title": "Come see it, feel it", "contact.lead": "We’re on Soi 3, North Pattaya Beach Road.", "contact.address": "Address", "contact.phoneFax": "Phone / Fax", "contact.fax": "Fax: 038-488574", "contact.emailWa": "Email & WhatsApp", "contact.tagline": "Make yourself at home and enjoy your holiday.", "contact.callLodge": "Call lodge", "contact.emailUs": "Email us", "contact.bookCta": "Booking inquiry", "contact.whatsappCta": "Chat on WhatsApp", "extras.launchTitle": "Launch checklist", "extras.launchIntro": "What’s included in the build package after they invest — not live changes yet.", "extras.li1Strong": "Google Business Profile cleanup", "extras.li1Rest": " — categories, photos, hours, and description polish as a post-invest / launch service (we do not claim their live GBP was already changed).", "extras.li2Strong": "Thai + English SEO basics", "extras.li2Rest": " — bilingual title & meta description, hreflang-ready markup, meaningful image alt text in EN + TH.", "extras.li3Strong": "WhatsApp & inquiry CTAs", "extras.li3Rest": " — click-to-chat plus booking inquiry form wired when back-end goes live.", "extras.seoStrong": "SEO note (EN / TH):", "extras.seoRest": " Page title and meta description update with the language toggle. Key image alt text is bilingual.", "extras.careTitle": "After go-live · Monthly site care", "extras.careLead": "A simple monthly care plan keeps the lodge site fresh and reliable:", "extras.care1": "Content updates & small edits", "extras.care2": "Uptime checks", "extras.care3": "Backup of site files", "extras.care4": "Minor SEO / listing tweaks as needed", "extras.carePrice": "Priced & connected after they invest.", "extras.careCta": "Ask about monthly care", "footer.tagline": "<strong>The BJ Holiday Lodge</strong> — See it, Feel it", "footer.compare": "Compare old vs new →", "footer.demo": "Front-end demo — bookings/payments not connected yet; paid back-end after they invest", "sticky.call": "Call", "sticky.whatsapp": "WhatsApp", "menu.close": "Close", "aria.menuDialog": "Menu", "theme.appearance": "Appearance", "theme.dark": "Dark", "theme.light": "Light", "theme.darkAnnounce": "Dark theme", "theme.lightAnnounce": "Light theme", "nav.rates": "Rates", "rooms.typesTitle": "Room types (from old site)", "rooms.single.h": "Single room", "rooms.single.p": "Double bed", "rooms.family.h": "Family room", "rooms.family.p": "2 rooms, 2 bathrooms, with a joining balcony", "rooms.twin.h": "Twin-beds", "rooms.twin.p": "No balcony", "rates.label": "Tariff", "rates.title": "Room types & tariff rates (Thai Baht)", "rates.lead": "Copied from the lodge’s live Room Types page (room.htm). Confirm current rates with the lodge — shown here exactly as published.", "rates.caption": "Tariff Rates in Thai Baht", "rates.colType": "Type", "rates.colLow": "May–September", "rates.colHigh": "October–April", "rates.source": "Source: bjholidaylodge.com/room.htm — not invented rates.", "reviews.label": "Guest reviews", "reviews.title": "TripAdvisor Reviews", "reviews.lead": "As linked from the lodge Contact page. No invented guest quotes — open TripAdvisor for real reviews.", "reviews.heading": "The BJ Holiday Lodge on TripAdvisor", "reviews.property": "TripAdvisor property d=951634", "reviews.open": "Open TripAdvisor Reviews"},
    th: {"meta.title": "บีเจ ฮอลิเดย์ ลอดจ์ | ชายหาดพัทยาเหนือ", "meta.description": "บีเจ ฮอลิเดย์ ลอดจ์ — ห้องสไตล์ไทยร่วมสมัย ห่างชายหาดพัทยาเหนือประมาณ 100 เมตร มาดู มาสัมผัส", "aria.home": "หน้าแรก บีเจ ฮอลิเดย์ ลอดจ์", "aria.primaryNav": "เมนูหลัก", "aria.menuOpen": "เปิดเมนู", "aria.menuClose": "ปิดเมนู", "aria.langSwitch": "ภาษา", "aria.roomsPreview": "ภาพบรรยากาศห้องพัก", "nav.rooms": "ห้องพัก", "nav.facilities": "สิ่งอำนวยความสะดวก", "nav.location": "ที่ตั้ง", "nav.book": "จองห้อง", "nav.contact": "ติดต่อ", "nav.compare": "เทียบเว็บเดิมกับใหม่", "nav.cta": "สอบถาม", "nav.whatsapp": "แชททาง WhatsApp", "hero.pill": "ห่างชายหาด ~100 ม. · ซอย 3 พัทยาเหนือ", "hero.title": "The BJ <em>Holiday Lodge</em>", "hero.tagline": "มาดู มาสัมผัส", "hero.lead": "รู้สึกเหมือนอยู่บ้านใจกลางเมืองพัทยา ห้องพักสไตล์ไทยร่วมสมัย 50 ห้อง บนถนนชายหาดพัทยาเหนือ ซอย 3 — ห่างชายหาดเพียงราว 100 เมตร", "hero.ctaBook": "ส่งคำถามจองห้อง", "hero.ctaWhatsapp": "แชททาง WhatsApp", "stat.roomsStrong": "50", "stat.roomsSpan": "ห้องสไตล์ไทย", "stat.beachStrong": "~100 ม.", "stat.beachSpan": "ถึงชายหาด", "stat.poolStrong": "สระว่ายน้ำ", "stat.poolSpan": "และร้านอาหาร", "float.strong": "ระเบียงส่วนตัว", "float.span": "รับลมทะเลและชมพระอาทิตย์ตกจากห้องพัก", "alt.hero": "สระว่ายน้ำและระเบียงห้องพัก BJ Holiday Lodge", "alt.room1": "ห้องพักสไตล์ไทย BJ Holiday Lodge", "alt.room2": "ห้องพักเตียงคู่ BJ Holiday Lodge", "alt.pool": "สระว่ายน้ำ BJ Holiday Lodge", "loc.band": "ตั้งอยู่บน <strong>ถนนชายหาดพัทยาเหนือ ซอย 3</strong> — ใจกลางเมืองพัทยา และห่างชายหาดเพียง <strong>ราว 100 เมตร</strong>", "rooms.label": "ห้องพัก", "rooms.title": "ห้องสไตล์ไทยร่วมสมัย", "rooms.lead": "50 ห้องสบาย พร้อมสิ่งจำเป็นสำหรับวันหยุดริมทะเล", "feat.ac.h": "แอร์รีโมท", "feat.ac.p": "เย็นสบายด้วยเครื่องปรับอากาศควบคุมด้วยรีโมทในทุกห้อง", "feat.tv.h": "เคเบิลทีวี", "feat.tv.p": "ผ่อนคลายดูทีวีหลังเที่ยวชายหาดทั้งวัน", "feat.shower.h": "ฝักบัวน้ำร้อน-เย็น", "feat.shower.p": "ห้องน้ำสไตล์ไทยพร้อมฝักบัวน้ำร้อนและน้ำเย็น", "feat.safe.h": "ตู้เซฟ", "feat.safe.p": "ตู้เซฟไฟฟ้าส่วนตัวเก็บของมีค่า", "feat.balcony.h": "ระเบียงส่วนตัว", "feat.balcony.p": "รับลมทะเลและชมพระอาทิตย์ตกจากระเบียงของท่าน", "feat.thai.h": "ความสบายแบบไทย", "feat.thai.p": "ดีไซน์ไทยร่วมสมัย ที่ให้ความรู้สึกอบอุ่นและคุ้นเคย", "fac.label": "สิ่งอำนวยความสะดวก", "fac.title": "ครบครัน พักอย่างสบายใจ", "fac.lead": "ทุกอย่างที่ท่านต้องการใกล้ชายหาดพัทยาเหนือ", "fac.elevator": "ลิฟต์", "fac.pool": "สระว่ายน้ำ", "fac.bar": "บาร์และร้านอาหาร", "fac.roomService": "รูมเซอร์วิส", "fac.laundry": "บริการซักรีด", "fac.wifi": "WiFi ฟรี", "fac.pc": "คอมพิวเตอร์ 2 เครื่อง (40฿/ชม.)", "fac.cams": "กล้องวงจรปิด", "fac.parking": "ที่จอดรถใต้ดิน", "inq.label": "จองห้อง", "inq.title": "สอบถามการจอง", "inq.lead": "บอกรายละเอียดวันเข้าพัก — ตอบเร็วผ่าน WhatsApp หรือส่งแบบฟอร์มด้านล่าง", "form.name": "ชื่อ-นามสกุล", "form.namePh": "ชื่อของท่าน", "form.email": "อีเมล", "form.emailPh": "you@email.com", "form.phone": "โทรศัพท์ / WhatsApp", "form.phonePh": "+66 …", "form.guests": "จำนวนผู้เข้าพัก", "form.g1": "1 ท่าน", "form.g2": "2 ท่าน", "form.g3": "3 ท่าน", "form.g4": "4 ท่านขึ้นไป", "form.checkin": "วันเช็คอิน", "form.checkout": "วันเช็คเอาท์", "form.message": "ข้อความ / ความต้องการห้องพัก", "form.messagePh": "ความต้องการห้องพักหรือคำถาม…", "form.submit": "ส่งคำถาม", "form.note": "เดโมเท่านั้น — การส่งแบบฟอร์มยังไม่เชื่อมระบบ การจองจริงจะเชื่อมหลังลงทุน โทร อีเมล หรือ WhatsApp ได้ทุกเมื่อ", "form.alert": "ขอบคุณครับ/ค่ะ! นี่เป็นเดโมหน้าบ้าน — การส่งคำถามเป็นการสาธิต จะเชื่อมระบบหลังลงทุน กรุณาโทร อีเมล หรือ WhatsApp หาลอดจ์ก่อนนะคะ", "contact.label": "ติดต่อ", "contact.title": "มาดู มาสัมผัส", "contact.lead": "อยู่ซอย 3 ถนนชายหาดพัทยาเหนือ", "contact.address": "ที่อยู่", "contact.phoneFax": "โทรศัพท์ / แฟกซ์", "contact.fax": "แฟกซ์: 038-488574", "contact.emailWa": "อีเมลและ WhatsApp", "contact.tagline": "รู้สึกเหมือนอยู่บ้าน และสนุกกับวันหยุดของท่าน", "contact.callLodge": "โทรหาลอดจ์", "contact.emailUs": "ส่งอีเมล", "contact.bookCta": "สอบถามการจอง", "contact.whatsappCta": "แชททาง WhatsApp", "extras.launchTitle": "เช็กลิสต์ก่อนเปิดตัว", "extras.launchIntro": "สิ่งที่รวมในแพ็กเกจหลังลงทุน — ยังไม่ได้ปรับของจริงบนเว็บ/GBP", "extras.li1Strong": "จัดระเบียบ Google Business Profile", "extras.li1Rest": " — หมวดหมู่ รูปภาพ เวลาทำการ และคำอธิบาย เป็นบริการหลังลงทุน/เปิดตัว (ไม่ได้เคลมว่าแก้ GBP จริงแล้ว)", "extras.li2Strong": "SEO พื้นฐานไทย+อังกฤษ", "extras.li2Rest": " — ชื่อหน้าและเมตาคำอธิบายสองภาษา มาร์กอัพร้อม hreflang และ alt รูปที่มีความหมาย", "extras.li3Strong": "ปุ่ม WhatsApp และฟอร์มสอบถาม", "extras.li3Rest": " — คลิกแชทได้ทันที และเชื่อมฟอร์มจองเมื่อระบบหลังบ้านพร้อม", "extras.seoStrong": "หมายเหตุ SEO (EN / TH):", "extras.seoRest": " ชื่อหน้าและเมตาคำอธิบายเปลี่ยนตามภาษาที่เลือก Alt ของรูปสำคัญเป็นสองภาษา", "extras.careTitle": "หลังเปิดตัว · ดูแลเว็บรายเดือน", "extras.careLead": "แพ็กดูแลรายเดือนช่วยให้เว็บลอดจ์สดใหม่และเสถียร:", "extras.care1": "อัปเดตเนื้อหาและแก้เล็กน้อย", "extras.care2": "ตรวจออนไลน์อยู่เสมอ", "extras.care3": "สำรองไฟล์เว็บไซต์", "extras.care4": "ปรับ SEO / รายชื่อธุรกิจเล็กน้อยตามต้องการ", "extras.carePrice": "คิดราคาและเชื่อมระบบหลังลงทุน", "extras.careCta": "สอบถามแพ็กดูแลรายเดือน", "footer.tagline": "<strong>The BJ Holiday Lodge</strong> — มาดู มาสัมผัส", "footer.compare": "เทียบเว็บเดิมกับใหม่ →", "footer.demo": "เดโมหน้าบ้าน — ยังไม่เชื่อมจอง/ชำระเงิน ระบบหลังบ้านหลังลงทุน", "sticky.call": "โทร", "sticky.whatsapp": "WhatsApp", "menu.close": "ปิด", "aria.menuDialog": "เมนู", "theme.appearance": "ธีม", "theme.dark": "เข้ม", "theme.light": "สว่าง", "theme.darkAnnounce": "ธีมสีเข้ม", "theme.lightAnnounce": "ธีมสีสว่าง", "nav.rates": "ราคา", "rooms.typesTitle": "ประเภทห้อง (จากเว็บเดิม)", "rooms.single.h": "ห้องเดี่ยว", "rooms.single.p": "เตียงคู่", "rooms.family.h": "ห้องแฟมิลี่", "rooms.family.p": "2 ห้อง 2 ห้องน้ำ พร้อมระเบียงเชื่อม", "rooms.twin.h": "ห้องทวิน", "rooms.twin.p": "ไม่มีระเบียง", "rates.label": "อัตราค่าห้อง", "rates.title": "ประเภทห้องและอัตราค่าห้อง (บาท)", "rates.lead": "คัดลอกจากหน้า Room Types ของลอดจ์ (room.htm) กรุณายืนยันราคากับลอดจ์ — แสดงตามที่เผยแพร่", "rates.caption": "อัตราค่าห้องเป็นบาทไทย", "rates.colType": "ประเภท", "rates.colLow": "พ.ค.–ก.ย.", "rates.colHigh": "ต.ค.–เม.ย.", "rates.source": "แหล่งที่มา: bjholidaylodge.com/room.htm — ไม่ได้แต่งราคา", "reviews.label": "รีวิวผู้เข้าพัก", "reviews.title": "รีวิว TripAdvisor", "reviews.lead": "ตามลิงก์จากหน้า Contact ของลอดจ์ ไม่แต่งคำรับรอง — เปิด TripAdvisor เพื่ออ่านรีวิวจริง", "reviews.heading": "The BJ Holiday Lodge บน TripAdvisor", "reviews.property": "TripAdvisor property d=951634", "reviews.open": "เปิดรีวิว TripAdvisor"}
  };
  let currentLang = "en";

  function detectDefaultLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "th" || saved === "en") return saved;
    } catch (_) {}
    const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    return nav.startsWith("th") ? "th" : "en";
  }

  function applyI18n(lang, dict) {
    if (!dict) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (dict[key] != null) el.setAttribute("aria-label", dict[key]);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (dict[key] != null) el.setAttribute("alt", dict[key]);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (dict[key] != null) el.setAttribute("title", dict[key]);
    });

    if (dict["meta.title"]) document.title = dict["meta.title"];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict["meta.description"]) metaDesc.setAttribute("content", dict["meta.description"]);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    if (menuBtn && mobileNav) {
      const open = mobileNav.classList.contains("open");
      menuBtn.setAttribute("aria-label", open ? (dict["aria.menuClose"] || "Close menu") : (dict["aria.menuOpen"] || "Open menu"));
    }
  }

  function i18nAlert(key, fallback) {
    const dict = i18nDicts[currentLang];
    alert((dict && dict[key]) || fallback);
  }

  function initI18n() {
    const lang = detectDefaultLang();
    applyI18n(lang, i18nDicts[lang] || i18nDicts.en);
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-lang");
        if (next && i18nDicts[next]) applyI18n(next, i18nDicts[next]);
      });
    });
  }

  initI18n();


  /* --- Theme: dark default + light toggle (pattaya-demo-theme) --- */
  const THEME_KEY = "pattaya-demo-theme";
  const themeLive = document.getElementById("themeLive");

  function getTheme() {
    const t = document.documentElement.getAttribute("data-theme");
    return t === "light" ? "light" : "dark";
  }

  function applyTheme(theme, announce) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-theme-set") === next));
    });
    if (announce && themeLive) {
      const d = (typeof i18nDicts !== "undefined" && i18nDicts[currentLang]) || {};
      const label = next === "light"
        ? (d["theme.lightAnnounce"] || d["theme.light"] || "Light theme")
        : (d["theme.darkAnnounce"] || d["theme.dark"] || "Dark theme");
      themeLive.textContent = label;
    }
  }

  function initTheme() {
    applyTheme(getTheme(), false);
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-theme-set");
        if (next) applyTheme(next, true);
      });
    });
  }
  initTheme();

})();
