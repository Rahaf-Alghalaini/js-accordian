const ITEMS = [
  { id: 1, q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days." },
  { id: 2, q: "Can I edit my order?", a: "Yes, within one hour of placing it, from the My Orders page." },
  { id: 3, q: "What payment methods are available?", a: "Credit and debit cards, bank transfer, and cash on delivery." },
  { id: 4, q: "How do I contact support?", a: "Reach us by chat or email, every day from 9 AM to 9 PM." },
  { id: 5, q: "Disabled question (disabled)", a: "This item cannot be opened.", disabled: true },
  { id: 6, q: "Can I return a product?", a: "Returns are accepted within 14 days if the item is unused." }
];

const $ = (id) => document.getElementById(id);
const accord = $("accord");
let openIds = [];

function render() {
  const count = +$("count").value;
  const variant = $("variant").value;
  const iconType = $("iconType").value;
  const iconPosition = $("iconPosition").value;
  const level = $("headingLevel").value;
  const term = $("search").value.trim().toLowerCase();

  const base = ITEMS.slice(0, count);
  openIds = openIds.filter((id) => base.some((i) => i.id === id));
  const visible = base.filter((i) => i.q.toLowerCase().includes(term));

  accord.className = "accord " + (variant === "default" ? "" : variant) +
                     ($("animated").checked ? " animated" : "");
  accord.innerHTML = "";

  if (!visible.length) {
    accord.innerHTML = '<div class="empty">No questions match your search.</div>';
  }

  visible.forEach((item) => {
    const isOpen = openIds.includes(item.id);

    const wrap = document.createElement("div");
    wrap.className = "accord-item" + (isOpen ? " open" : "");

    const heading = document.createElement("h" + level);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-answer";
    btn.disabled = !!item.disabled;
    btn.setAttribute("aria-expanded", String(isOpen));
    btn.setAttribute("aria-controls", "answer-" + item.id);

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = item.q;

    const icon = document.createElement("span");
    icon.className = "icon " + (iconType === "chevron" ? "chevron" : "plus-minus");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = iconType === "chevron" ? "›" : (isOpen ? "−" : "+");

    if (iconPosition === "start") btn.append(icon, label);
    else btn.append(label, icon);

    btn.addEventListener("click", () => toggle(item.id));
    heading.appendChild(btn);

    const answer = document.createElement("div");
    answer.className = "answer-question";
    answer.id = "answer-" + item.id;
    answer.setAttribute("role", "region");
    answer.innerHTML = "<div><p></p></div>";
    answer.querySelector("p").textContent = item.a;

    wrap.append(heading, answer);
    accord.appendChild(wrap);
  });

  $("status").textContent = `${count} questions · Open: [${openIds.join(", ")}]`;
}

function toggle(id) {
  if (openIds.includes(id)) {
    if (!$("collapsible").checked && openIds.length === 1) return;
    openIds = openIds.filter((x) => x !== id);
  } else {
    openIds = $("multiple").checked ? [...openIds, id] : [id];
  }
  render();
  const btn = document.querySelector(`[aria-controls="answer-${id}"]`);
  if (btn) btn.focus();
}

document.querySelectorAll(".options select, .options input").forEach((el) =>
  el.addEventListener("change", () => {
    if (el.id === "multiple" && !el.checked) openIds = openIds.slice(0, 1);
    render();
  })
);
$("search").addEventListener("input", render);

render();