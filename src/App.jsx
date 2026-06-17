import { useState, useMemo } from "react";

// ─── COLORS & TOKENS ─────────────────────────────────────────────────────────
const RED = "#DA2127";
const CREAM = "#FFF8F0";
const DARK = "#1A1A1A";
const GRAY = "#6B6B6B";
const LIGHT_GRAY = "#F0EBE3";
const WHITE = "#FFFFFF";
const GREEN = "#2D7D46";
const YELLOW = "#F5A623";
const AD_BG = "#F7F7F7";
const NAV_HEIGHT = "56px";

// ─── DATA ────────────────────────────────────────────────────────────────────
const PATTY_OPTIONS = [
  { id: "1x1", label: "1 Patty", order: "a Hamburger" },
  { id: "2x2", label: "2 Patties (Double-Double)", order: "a Double-Double" },
  { id: "3x3", label: "3 Patties", order: "a 3x3" },
  { id: "4x4", label: "4 Patties", order: "a 4x4" },
];
const CHEESE_OPTIONS = [
  { id: "no_cheese", label: "No Cheese", order: "no cheese" },
  { id: "1_cheese", label: "1 Slice", order: null },
  { id: "2_cheese", label: "2 Slices", order: null },
  { id: "3_cheese", label: "3 Slices", order: "3 slices of cheese" },
  { id: "4_cheese", label: "4 Slices", order: "4 slices of cheese" },
];
const BUN_OPTIONS = [
  { id: "regular_bun", label: "Regular Bun", order: null },
  { id: "extra_toast", label: "Extra Toast", order: "extra toast on the bun" },
  { id: "light_toast", label: "Light Toast", order: "light toast on the bun" },
  { id: "protein_style", label: "Protein Style (Lettuce Wrap)", order: "Protein Style", secret: true },
  { id: "tomato_wrap", label: "Tomato Wrap", order: "wrapped in tomato slices instead of a bun", secret: true },
  { id: "onion_wrap", label: "Whole Grilled Onion Wrap", order: "wrapped in whole grilled onions instead of a bun", secret: true },
  { id: "no_bun", label: "No Bun (Flying Dutchman)", order: "Flying Dutchman style — no bun", secret: true },
];
const PATTY_COOK = [
  { id: "regular_cook", label: "Regular", order: null },
  { id: "medium_rare", label: "Medium Rare", order: "medium rare patty", secret: true },
  { id: "mustard_fried", label: "Mustard-Fried", order: "mustard fried", secret: true },
  { id: "well_done_patty", label: "Well Done", order: "well done patty" },
  { id: "light_well", label: "Light Well", order: "light well patty" },
];
const TOPPINGS = [
  { id: "lettuce", label: "Lettuce", default: true, addOrder: "add lettuce", removeOrder: "no lettuce" },
  { id: "tomato", label: "Tomato", default: true, addOrder: "add tomato", removeOrder: "no tomato" },
  { id: "extra_tomato", label: "Extra Tomato", default: false, addOrder: "extra tomato", removeOrder: null },
  { id: "raw_onion", label: "Raw Onion", default: true, addOrder: "add onion", removeOrder: "no onion" },
  { id: "grilled_onion", label: "Grilled Onion (chopped)", default: false, addOrder: "grilled onions", removeOrder: null },
  { id: "whole_grilled_onion", label: "Whole Grilled Onion", default: false, addOrder: "whole grilled onion", removeOrder: null },
  { id: "spread", label: "Spread", default: true, addOrder: "add spread", removeOrder: "no spread" },
  { id: "extra_spread", label: "Extra Spread", default: false, addOrder: "extra spread", removeOrder: null },
  { id: "pickles", label: "Pickles", default: false, addOrder: "add pickles", removeOrder: null },
  { id: "chopped_chilies", label: "Chopped Chilies", default: false, addOrder: "add chopped chilies", removeOrder: null },
];
const FRIES_STYLE = [
  { id: "regular_fries", label: "Regular", order: "fries" },
  { id: "light_fries", label: "Light / Soft", order: "light fries" },
  { id: "well_done_fries", label: "Well Done", order: "well done fries" },
  { id: "extra_crispy", label: "Extra Well Done", order: "extra well done fries" },
];
const FRIES_TOPPINGS = [
  { id: "no_fries_topping", label: "Plain", order: null },
  { id: "cheese_fries", label: "+ Cheese", order: "with cheese" },
  { id: "animal_fries", label: "+ Animal Style", order: "Animal Style", secret: true },
  { id: "ultimate_animal_fries", label: "+ Ultimate Animal Style", order: "Ultimate Animal Style — Animal fries with beef crumbles", secret: true },
  { id: "roadkill_fries", label: "+ Roadkill", order: "Roadkill — Animal fries with Flying Dutchman crumbled on top", secret: true },
  { id: "lemon_fries", label: "+ Lemon Juice", order: "with lemon juice" },
  { id: "lemon_pepper_fries", label: "+ Lemon Pepper", order: "with lemon pepper" },
  { id: "chilies_fries", label: "+ Chopped Chilies", order: "with chopped chilies" },
];
const DRINK_TYPE = [
  { id: "soda", label: "Soda / Lemonade" },
  { id: "shake", label: "Milkshake" },
  { id: "float", label: "Float ★", secret: true },
  { id: "secret_mix", label: "Secret Mix ★", secret: true },
  { id: "no_drink", label: "No Drink" },
];
const SODAS = [
  { id: "coke", label: "Coca-Cola" }, { id: "diet_coke", label: "Diet Coke" },
  { id: "dr_pepper", label: "Dr Pepper" }, { id: "7up", label: "7-Up" },
  { id: "root_beer", label: "Root Beer" }, { id: "pink_lemonade", label: "Pink Lemonade" },
  { id: "iced_tea", label: "Iced Tea" }, { id: "water", label: "Water" },
];
const SHAKE_FLAVORS = [
  { id: "vanilla", label: "Vanilla" }, { id: "chocolate", label: "Chocolate" }, { id: "strawberry", label: "Strawberry" },
];
const SHAKE_SIZE = [
  { id: "regular", label: "Regular" }, { id: "large", label: "Large ★", secret: true }, { id: "xlarge", label: "X-Large ★", secret: true },
];
const FLOAT_OPTIONS = [
  { id: "root_beer_float", label: "Root Beer Float", order: "Root Beer Float — half root beer, half vanilla shake" },
  { id: "coke_float", label: "Coke Float", order: "Coke Float — half Coke, half vanilla shake" },
  { id: "dr_pepper_float", label: "Dr Pepper Float", order: "Dr Pepper Float — half Dr Pepper, half vanilla shake" },
  { id: "7up_float", label: "7-Up Float", order: "7-Up Float — half 7-Up, half vanilla shake" },
  { id: "lemonade_float", label: "Pink Lemonade Float", order: "Pink Lemonade Float — half pink lemonade, half vanilla shake" },
];
const SECRET_MIXES = [
  { id: "neapolitan", label: "Neapolitan Shake", order: "Neapolitan Shake — all three flavors blended" },
  { id: "black_white", label: "Black & White Shake", order: "Black & White Shake — chocolate and vanilla" },
  { id: "choc_straw", label: "Chocolate-Strawberry Shake", order: "Chocolate-Strawberry Shake" },
  { id: "van_straw", label: "Vanilla-Strawberry Shake", order: "Vanilla-Strawberry Shake" },
  { id: "around_world", label: "Around the World", order: "Around the World — all three shake flavors layered" },
  { id: "arnold_palmer", label: "Arnold Palmer", order: "Arnold Palmer — half iced tea, half pink lemonade" },
  { id: "lemon_up", label: "Lemon-Up", order: "Lemon-Up — half 7-Up, half pink lemonade" },
];

const TOTAL_BURGER = 4 * 5 * 7 * 5 * Math.pow(2, 10);
const TOTAL_FRIES = 4 * 8;
const TOTAL_DRINKS = 8 + 9 + 5 + 7 + 1;
const TOTAL = TOTAL_BURGER * TOTAL_FRIES * TOTAL_DRINKS;

const defaultToppings = TOPPINGS.reduce((a, t) => { a[t.id] = t.default; return a; }, {});

// ─── ORDER SCRIPT ─────────────────────────────────────────────────────────────
function buildScript(state) {
  const { patty, cheese, bun, cook, toppings, friesStyle, friesTop, drinkType, soda, shakeBase, shakeSize, floatChoice, secretMix } = state;
  const pd = PATTY_OPTIONS.find(x => x.id === patty);
  const cd = CHEESE_OPTIONS.find(x => x.id === cheese);
  const bd = BUN_OPTIONS.find(x => x.id === bun);
  const ck = PATTY_COOK.find(x => x.id === cook);
  const fd = FRIES_STYLE.find(x => x.id === friesStyle);
  const ft = FRIES_TOPPINGS.find(x => x.id === friesTop);

  let parts = [pd.order];
  if (cd.id === "no_cheese") parts.push("no cheese");
  else if (cd.order) parts.push(cd.order);
  if (bd.order) parts.push(bd.order);
  if (ck.order) parts.push(ck.order);

  const defState = TOPPINGS.reduce((a, t) => { a[t.id] = t.default; return a; }, {});
  TOPPINGS.forEach(t => {
    const on = toppings[t.id], was = defState[t.id];
    if (on && !was && t.addOrder) parts.push(t.addOrder);
    if (!on && was && t.removeOrder) parts.push(t.removeOrder);
  });

  let friesStr = fd.order + (ft.order ? ` — ${ft.order}` : "");
  let drinkStr = "";
  if (drinkType === "soda") drinkStr = SODAS.find(x => x.id === soda)?.label;
  else if (drinkType === "shake") {
    const sz = SHAKE_SIZE.find(x => x.id === shakeSize);
    drinkStr = `${sz.id !== "regular" ? sz.label.replace(" ★","") + " " : ""}${SHAKE_FLAVORS.find(x => x.id === shakeBase)?.label} milkshake`;
  } else if (drinkType === "float") drinkStr = FLOAT_OPTIONS.find(x => x.id === floatChoice)?.order;
  else if (drinkType === "secret_mix") drinkStr = SECRET_MIXES.find(x => x.id === secretMix)?.order;

  const burgerLine = parts.join(", ");
  const lines = drinkStr && drinkType !== "no_drink"
    ? [`"Can I get ${burgerLine},`, `${friesStr},`, `and a ${drinkStr}?"`]
    : [`"Can I get ${burgerLine}`, `and ${friesStr}?"`];

  const tips = [];
  if (bun === "onion_wrap") tips.push("Whole grilled onion wrap takes ~9 extra minutes. Give them a heads up.");
  if (bun === "no_bun") tips.push("Flying Dutchman = two patties, two cheese slices, no bun. Most locations know it.");
  if (bun === "protein_style") tips.push("Protein Style is widely known — just say the name.");
  if (cook === "mustard_fried") tips.push("Mustard fried means they squeeze mustard onto the patty while it cooks on the grill.");
  if (cook === "medium_rare") tips.push("Medium rare is possible but some locations decline for food safety — ask politely.");
  if (friesTop === "roadkill_fries") tips.push("Roadkill isn't universal — describe it as Animal Style fries with a Flying Dutchman crumbled on top.");
  if (friesTop === "ultimate_animal_fries") tips.push("Ask for Animal Style fries with a beef patty crumbled on top.");
  if (drinkType === "float") tips.push("Ask for a half cup of soda first so it doesn't overflow when they add the shake.");
  if (drinkType === "secret_mix" && secretMix === "lemon_up") tips.push("Lemon-Up = half 7-Up, half pink lemonade. Say it by name or describe it.");
  if (drinkType === "shake" && shakeSize !== "regular") tips.push("Large and X-Large shakes are off-menu — just ask for the size by name.");

  return { lines, tips };
}

// ─── TINY UI PARTS ───────────────────────────────────────────────────────────
const AdSlot = ({ label, height = 90, sidebar = false }) => (
  <div style={{ background: AD_BG, border: "1px dashed #CCC", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", height: sidebar ? "600px" : `${height}px`, width: "100%", flexDirection: "column", gap: "4px", margin: sidebar ? "0" : "16px 0" }}>
    <span style={{ fontSize: "10px", color: "#AAA", letterSpacing: "1px", textTransform: "uppercase" }}>Advertisement</span>
    <span style={{ fontSize: "9px", color: "#CCC" }}>{label}</span>
  </div>
);

const RadioGrid = ({ options, value, onChange, cols = 2 }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "6px" }}>
    {options.map(o => (
      <button key={o.id} onClick={() => onChange(o.id)} style={{
        padding: "9px 8px", borderRadius: "6px", lineHeight: "1.3", position: "relative",
        border: value === o.id ? `2px solid ${RED}` : `2px solid ${LIGHT_GRAY}`,
        background: value === o.id ? "#FFF0F0" : WHITE,
        color: value === o.id ? RED : DARK,
        fontWeight: value === o.id ? "700" : "400", fontSize: "12px", cursor: "pointer", textAlign: "center",
      }}>
        {o.label}
        {o.secret && <span style={{ position: "absolute", top: "2px", right: "4px", fontSize: "8px", color: YELLOW }}>★</span>}
      </button>
    ))}
  </div>
);

const CheckGrid = ({ options, values, onToggle }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
    {options.map(t => {
      const checked = values[t.id];
      return (
        <button key={t.id} onClick={() => onToggle(t.id)} style={{
          padding: "8px 10px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "7px",
          border: checked ? `2px solid ${RED}` : `2px solid ${LIGHT_GRAY}`,
          background: checked ? "#FFF0F0" : WHITE, color: checked ? RED : DARK,
          fontWeight: checked ? "700" : "400", fontSize: "12px", cursor: "pointer", textAlign: "left",
        }}>
          <span style={{ width: "14px", height: "14px", borderRadius: "3px", flexShrink: 0, background: checked ? RED : LIGHT_GRAY, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          {t.label}
        </button>
      );
    })}
  </div>
);

const Card = ({ label, children, secret }) => (
  <div style={{ background: WHITE, borderRadius: "8px", padding: "14px", marginBottom: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", borderLeft: secret ? `3px solid ${YELLOW}` : "none" }}>
    {label && <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: GRAY, marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
      {label}{secret && <span style={{ fontSize: "9px", color: YELLOW }}>★ SECRET</span>}
    </div>}
    {children}
  </div>
);

const SectionHead = ({ emoji, children }) => (
  <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: RED, margin: "22px 0 10px", paddingBottom: "6px", borderBottom: `2px solid ${RED}`, display: "flex", alignItems: "center", gap: "6px" }}>
    {emoji}<span>{children}</span>
  </div>
);

// ─── SHARE ───────────────────────────────────────────────────────────────────
function ShareButtons({ orderText }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "https://yourdomain.com";
  const msg = encodeURIComponent(`My secret order: ${orderText} — build yours at ${url}`);
  const copyLink = () => { navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  const platforms = [
    { name: "X / Twitter", color: "#000", url: `https://twitter.com/intent/tweet?text=${msg}` },
    { name: "Facebook", color: "#1877F2", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: "WhatsApp", color: "#25D366", url: `https://wa.me/?text=${msg}` },
    { name: "iMessage", color: "#34C759", url: `sms:&body=${msg}` },
  ];
  return (
    <div style={{ marginTop: "16px" }}>
      <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "10px" }}>Share your order</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {platforms.map(p => <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", borderRadius: "8px", background: p.color, color: WHITE, textDecoration: "none", fontSize: "12px", fontWeight: "600" }}>{p.name}</a>)}
        <button onClick={copyLink} style={{ gridColumn: "span 2", padding: "10px", borderRadius: "8px", background: copied ? GREEN : "#444", color: WHITE, border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>{copied ? "✓ Copied!" : "Copy Link"}</button>
      </div>
    </div>
  );
}

// ─── ORDER PANEL ─────────────────────────────────────────────────────────────
function OrderPanel(props) {
  const { lines, tips } = useMemo(() => buildScript(props), [JSON.stringify(props)]);
  return (
    <div style={{ background: DARK, borderRadius: "10px", padding: "18px", color: WHITE }}>
      <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "12px" }}>What to say at the window</div>
      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "8px", padding: "14px", borderLeft: `4px solid ${RED}` }}>
        {lines.map((l, i) => <div key={i} style={{ fontSize: i === 0 ? "16px" : "14px", fontWeight: i === 0 ? "700" : "400", lineHeight: "1.6", marginBottom: i < lines.length - 1 ? "2px" : 0 }}>{l}</div>)}
      </div>
      {tips.length > 0 && (
        <div style={{ marginTop: "14px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>Ordering tips</div>
          {tips.map((t, i) => <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "12px", color: "rgba(255,255,255,0.7)", lineHeight: "1.5" }}><span style={{ color: RED, flexShrink: 0 }}>→</span>{t}</div>)}
        </div>
      )}
      <ShareButtons orderText={lines.join(" ")} />
    </div>
  );
}

// ─── THE BUILDER TOOL ────────────────────────────────────────────────────────
function BuilderTool() {
  const [patty, setPatty] = useState("2x2");
  const [cheese, setCheese] = useState("2_cheese");
  const [bun, setBun] = useState("regular_bun");
  const [cook, setCook] = useState("regular_cook");
  const [toppings, setToppings] = useState(defaultToppings);
  const [friesStyle, setFriesStyle] = useState("regular_fries");
  const [friesTop, setFriesTop] = useState("no_fries_topping");
  const [drinkType, setDrinkType] = useState("shake");
  const [soda, setSoda] = useState("coke");
  const [shakeBase, setShakeBase] = useState("vanilla");
  const [shakeSize, setShakeSize] = useState("regular");
  const [floatChoice, setFloatChoice] = useState("root_beer_float");
  const [secretMix, setSecretMix] = useState("neapolitan");
  const toggleTop = id => setToppings(p => ({ ...p, [id]: !p[id] }));
  const reset = () => { setPatty("2x2"); setCheese("2_cheese"); setBun("regular_bun"); setCook("regular_cook"); setToppings(defaultToppings); setFriesStyle("regular_fries"); setFriesTop("no_fries_topping"); setDrinkType("shake"); setSoda("coke"); setShakeBase("vanilla"); setShakeSize("regular"); setFloatChoice("root_beer_float"); setSecretMix("neapolitan"); };
  const topCount = Object.values(toppings).filter(Boolean).length;
  const secretBun = ["protein_style","tomato_wrap","onion_wrap","no_bun"].includes(bun);
  const secretCook = ["mustard_fried","medium_rare"].includes(cook);
  const secretFries = ["animal_fries","ultimate_animal_fries","roadkill_fries"].includes(friesTop);

  return (
    <div>
      {/* Stats bar */}
      <div style={{ background: DARK, borderRadius: "10px", display: "flex", justifyContent: "space-around", padding: "14px 8px", marginBottom: "16px" }}>
        {[{ n: TOTAL_BURGER.toLocaleString(), l: "Burger Combos" }, { n: TOTAL_FRIES, l: "Fry Combos" }, { n: TOTAL_DRINKS, l: "Drink Combos" }, { n: TOTAL.toLocaleString(), l: "Total Possible" }].map((s, i) => (
          <div key={i} style={{ textAlign: "center", flex: 1 }}>
            <span style={{ fontSize: "15px", fontWeight: "900", color: RED, display: "block" }}>{s.n}</span>
            <span style={{ fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: WHITE, opacity: 0.7, display: "block", marginTop: "4px" }}>{s.l}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ background: "#FFF8E8", border: `1px solid ${YELLOW}`, borderRadius: "6px", padding: "8px 12px", marginBottom: "16px", fontSize: "11px", color: "#8B6914", display: "flex", gap: "6px", alignItems: "center" }}>
        <span style={{ color: YELLOW }}>★</span> = Secret menu item — not on the board, but totally orderable
      </div>

      {/* BURGER */}
      <SectionHead emoji="🍔">Build Your Burger</SectionHead>
      <Card label="Patties"><RadioGrid options={PATTY_OPTIONS} value={patty} onChange={setPatty} /></Card>
      <Card label="Cheese"><RadioGrid options={CHEESE_OPTIONS} value={cheese} onChange={setCheese} /></Card>
      <Card label="Bun / Wrap" secret={secretBun}><RadioGrid options={BUN_OPTIONS} value={bun} onChange={setBun} /></Card>
      <Card label="Cook Style" secret={secretCook}><RadioGrid options={PATTY_COOK} value={cook} onChange={setCook} /></Card>
      <Card label={`Toppings — ${topCount} selected`}><CheckGrid options={TOPPINGS} values={toppings} onToggle={toggleTop} /></Card>

      {/* FRIES */}
      <SectionHead emoji="🍟">Build Your Fries</SectionHead>
      <Card label="Cook Style"><RadioGrid options={FRIES_STYLE} value={friesStyle} onChange={setFriesStyle} /></Card>
      <Card label="Toppings" secret={secretFries}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {FRIES_TOPPINGS.map(o => (
            <button key={o.id} onClick={() => setFriesTop(o.id)} style={{ padding: "10px 12px", borderRadius: "6px", textAlign: "left", border: friesTop === o.id ? `2px solid ${RED}` : `2px solid ${LIGHT_GRAY}`, background: friesTop === o.id ? "#FFF0F0" : WHITE, color: friesTop === o.id ? RED : DARK, fontWeight: friesTop === o.id ? "700" : "400", fontSize: "12px", cursor: "pointer" }}>
              {o.label}{o.secret && <span style={{ marginLeft: "6px", color: YELLOW, fontSize: "10px" }}>★</span>}
            </button>
          ))}
        </div>
      </Card>

      {/* DRINKS */}
      <SectionHead emoji="🥤">Build Your Drink</SectionHead>
      <Card label="Drink Type"><RadioGrid options={DRINK_TYPE} value={drinkType} onChange={setDrinkType} /></Card>
      {drinkType === "soda" && <Card label="Choose Soda"><RadioGrid options={SODAS} value={soda} onChange={setSoda} /></Card>}
      {drinkType === "shake" && <>
        <Card label="Flavor"><RadioGrid options={SHAKE_FLAVORS} value={shakeBase} onChange={setShakeBase} cols={3} /></Card>
        <Card label="Size" secret={shakeSize !== "regular"}><RadioGrid options={SHAKE_SIZE} value={shakeSize} onChange={setShakeSize} cols={3} /></Card>
      </>}
      {drinkType === "float" && <Card label="Float Style" secret>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {FLOAT_OPTIONS.map(o => <button key={o.id} onClick={() => setFloatChoice(o.id)} style={{ padding: "10px 12px", borderRadius: "6px", textAlign: "left", border: floatChoice === o.id ? `2px solid ${RED}` : `2px solid ${LIGHT_GRAY}`, background: floatChoice === o.id ? "#FFF0F0" : WHITE, color: floatChoice === o.id ? RED : DARK, fontWeight: floatChoice === o.id ? "700" : "400", fontSize: "12px", cursor: "pointer" }}>{o.label}</button>)}
        </div>
      </Card>}
      {drinkType === "secret_mix" && <Card label="Secret Mix" secret>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {SECRET_MIXES.map(o => <button key={o.id} onClick={() => setSecretMix(o.id)} style={{ padding: "10px 12px", borderRadius: "6px", textAlign: "left", border: secretMix === o.id ? `2px solid ${RED}` : `2px solid ${LIGHT_GRAY}`, background: secretMix === o.id ? "#FFF0F0" : WHITE, color: secretMix === o.id ? RED : DARK, fontWeight: secretMix === o.id ? "700" : "400", fontSize: "12px", cursor: "pointer" }}>{o.label} <span style={{ color: YELLOW, fontSize: "10px" }}>★</span></button>)}
        </div>
      </Card>}

      {/* ORDER */}
      <SectionHead emoji="🗣️">Your Order</SectionHead>
      <OrderPanel patty={patty} cheese={cheese} bun={bun} cook={cook} toppings={toppings} friesStyle={friesStyle} friesTop={friesTop} drinkType={drinkType} soda={soda} shakeBase={shakeBase} shakeSize={shakeSize} floatChoice={floatChoice} secretMix={secretMix} />

      <button onClick={reset} style={{ width: "100%", marginTop: "14px", padding: "13px", borderRadius: "8px", background: RED, color: WHITE, fontWeight: "900", fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase", border: "none", cursor: "pointer" }}>Reset & Start Over</button>

      <p style={{ fontSize: "10px", color: GRAY, textAlign: "center", marginTop: "14px", lineHeight: "1.8" }}>
        4 patties × 5 cheese × 7 buns × 5 cook styles × 2¹⁰ toppings = {TOTAL_BURGER.toLocaleString()} burger combos · {TOTAL_FRIES} fry combos · {TOTAL_DRINKS} drink combos<br />
        <strong>{TOTAL.toLocaleString()} total possible orders</strong>
      </p>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function HomePage() {
  return (
    <div>
      {/* Top leaderboard ad */}
      <AdSlot label="728x90 Leaderboard — place AdSense unit here" height={90} />

      {/* Hero intro */}
      <div style={{ background: WHITE, borderRadius: "10px", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "900", color: DARK, margin: "0 0 12px", lineHeight: "1.2" }}>
          The Complete West Coast Burger Secret Menu Builder
        </h1>
        <p style={{ fontSize: "14px", color: GRAY, lineHeight: "1.7", margin: "0 0 12px" }}>
          Everyone knows the classic burger lineup. But regulars know the real menu lives underneath — hundreds of combinations most people never order because they don't know they exist. This tool puts every customization option in one place, walks you through the choices, and hands you the exact words to say at the drive-thru window.
        </p>
        <p style={{ fontSize: "14px", color: GRAY, lineHeight: "1.7", margin: 0 }}>
          From off-menu bun styles like lettuce wraps and whole grilled onion wraps, to secret drink combinations like root beer floats and Neapolitan shakes — if the ingredients exist in that kitchen, it's in the builder below. Pick your options and walk away with a ready-to-order script, plus tips on which items need a little extra explaining.
        </p>
      </div>

      {/* Two-column layout: tool + sidebar */}
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {/* Main tool column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <BuilderTool />

          {/* Post-tool content */}
          <div style={{ background: WHITE, borderRadius: "10px", padding: "24px", marginTop: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: DARK, margin: "0 0 14px" }}>How the hidden menu actually works</h2>
            <p style={{ fontSize: "14px", color: GRAY, lineHeight: "1.7", margin: "0 0 12px" }}>
              The secret menu at this iconic West Coast chain isn't printed anywhere — it's passed down through regulars, employees, and food blogs. Most of the options are simply customizations the kitchen can execute because the ingredients are already there. Workers know the named shortcuts like Animal Style and Protein Style by heart. For the more obscure ones, describe what you want and they'll make it happen.
            </p>
            <p style={{ fontSize: "14px", color: GRAY, lineHeight: "1.7", margin: "0 0 12px" }}>
              The ★ items in the builder above are the off-menu options. Everything else is already on the board. Mix and match freely — the builder calculates over {TOTAL.toLocaleString()} possible combinations from the available ingredients, and the order script adjusts in real time as you select.
            </p>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: DARK, margin: "20px 0 10px" }}>Tips before you pull up to the window</h3>
            <ul style={{ fontSize: "14px", color: GRAY, lineHeight: "1.9", paddingLeft: "20px", margin: 0 }}>
              <li>The whole grilled onion wrap takes about 9 extra minutes — mention you're okay waiting when you order.</li>
              <li>For floats, ask for a half cup of soda first so it doesn't overflow when they add the shake.</li>
              <li>Medium rare patties are technically possible but some locations decline. Ask politely and have a backup.</li>
              <li>Roadkill fries and Ultimate Animal Style fries aren't universally known by name — use the description from your order script if the worker looks confused.</li>
              <li>Extra spread packets are free to grab at the counter — great if you want to dip your fries.</li>
            </ul>
          </div>

          {/* Bottom ad */}
          <AdSlot label="728x90 — place AdSense unit here" height={90} />
        </div>

        {/* Sidebar */}
        <div style={{ width: "160px", flexShrink: 0 }}>
          <AdSlot label="160x600 Wide Skyscraper — place AdSense unit here" height={600} sidebar />
        </div>
      </div>
    </div>
  );
}

function BlogListPage({ onPost }) {
  const posts = [
    { id: 1, slug: "animal-style-explained", title: "Animal Style, Explained: What's Actually in It and How to Order It Right", date: "June 2026", excerpt: "It's the most famous secret menu item in fast food. Here's exactly what goes into it, why mustard-grilled patties taste different, and the best way to ask for it without slowing down the line.", readTime: "4 min read" },
    { id: 2, slug: "flying-dutchman-guide", title: "The Flying Dutchman: The Ultimate Low-Carb Order Hidden in Plain Sight", date: "June 2026", excerpt: "Two patties. Two slices of cheese. No bun, no lettuce, no tomato. The Flying Dutchman is the simplest and most misunderstood item on the hidden menu.", readTime: "3 min read" },
    { id: 3, slug: "secret-drinks-guide", title: "Every Secret Drink You Can Order: Floats, Neapolitan Shakes, Arnold Palmers and More", date: "June 2026", excerpt: "The shakes are made with real ice cream. The sodas are standard. But combine them in the right way and you unlock a drink menu that most customers don't know exists.", readTime: "5 min read" },
  ];
  return (
    <div>
      <AdSlot label="728x90 Leaderboard — place AdSense unit here" height={90} />
      <div style={{ background: WHITE, borderRadius: "10px", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "900", color: DARK, margin: "0 0 6px" }}>The Secret Menu Blog</h1>
        <p style={{ fontSize: "14px", color: GRAY, margin: 0 }}>Guides, deep dives, and ordering tips for the hidden menu.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {posts.map(p => (
          <div key={p.id} onClick={() => onPost(p.id)} style={{ background: WHITE, borderRadius: "10px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", cursor: "pointer", borderLeft: `4px solid ${RED}` }}>
            <div style={{ fontSize: "10px", color: GRAY, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>{p.date} · {p.readTime}</div>
            <h2 style={{ fontSize: "17px", fontWeight: "800", color: DARK, margin: "0 0 8px", lineHeight: "1.3" }}>{p.title}</h2>
            <p style={{ fontSize: "13px", color: GRAY, lineHeight: "1.6", margin: "0 0 10px" }}>{p.excerpt}</p>
            <span style={{ fontSize: "12px", fontWeight: "700", color: RED }}>Read more →</span>
          </div>
        ))}
      </div>
      <AdSlot label="728x90 — place AdSense unit here" height={90} />
    </div>
  );
}

function BlogPostPage({ postId, onBack }) {
  const content = {
    1: {
      title: "Animal Style, Explained: What's Actually in It and How to Order It Right",
      date: "June 2026", readTime: "4 min read",
      body: [
        { h: "What is Animal Style?" },
        { p: "Animal Style is the most recognized hidden menu item in American fast food. It adds four things to any burger: a mustard-fried patty, extra spread, pickles, and grilled onions. Every one of those elements changes the burger in a distinct way, and together they produce something that doesn't taste like any standard combination on the board." },
        { h: "The mustard-fried patty is the key" },
        { p: "When you order Animal Style, the cook squeezes yellow mustard directly onto the beef patty while it's still on the grill. The mustard caramelizes as it cooks into the meat, adding a tangy, slightly smoky crust that a plain patty doesn't have. This single step changes the entire flavor profile of the burger." },
        { h: "Grilled onions vs. raw onions" },
        { p: "The standard order comes with raw diced onions. Animal Style replaces those with grilled onions — slow-cooked on the flat top until they're soft, sweet, and caramelized. The sweetness of the onions balances the tang of the mustard and the richness of the extra spread. It's a deliberate contrast, not an accident." },
        { h: "Extra spread" },
        { p: "The spread is a Thousand Island-style sauce. Animal Style adds extra, which means more of it on the bun. This makes the burger noticeably wetter and richer. If you're someone who likes your burger on the saucy side, this is the right call. If you prefer a drier build, you can ask for Animal Style but light on the spread." },
        { h: "How to order it" },
        { p: "Just say 'Animal Style' after your burger order. Every worker knows what it means. If you want it on fries too, Animal Style Fries are a separate request — cheese, grilled onions, and spread on top of a basket of fries. You can order both in the same visit." },
        { h: "Can you customize Animal Style further?" },
        { p: "Yes. The builder at the top of this site lets you start with Animal Style logic and add to it. You can layer in extra tomato, whole grilled onion, medium rare, or any of the other off-menu modifications. The order script will tell you exactly how to phrase it at the window." },
      ]
    },
    2: {
      title: "The Flying Dutchman: The Ultimate Low-Carb Order Hidden in Plain Sight",
      date: "June 2026", readTime: "3 min read",
      body: [
        { h: "What is the Flying Dutchman?" },
        { p: "The Flying Dutchman is two beef patties with two slices of American cheese melted between them. No bun. No lettuce, no tomato, no onion, no spread. It is the most stripped-down item on the hidden menu and one of the most misunderstood." },
        { h: "Why people order it" },
        { p: "The Flying Dutchman is the go-to order for anyone eating low-carb or keto. Without a bun, you eliminate nearly all the carbohydrates in a standard burger order. The patties are 100% beef with no fillers, and the cheese is standard American. It's as clean as a fast food order gets for someone avoiding bread." },
        { h: "How it differs from Protein Style" },
        { p: "Protein Style is a regular burger wrapped in lettuce instead of a bun. The Flying Dutchman removes the bun entirely — no lettuce wrap, no substitute. You get the meat and cheese, handed to you in paper or a tray. Toppings are optional; the default is nothing extra." },
        { h: "Variations worth knowing" },
        { p: "The Tomato-Wrapped Flying Dutchman replaces the bun with two thick tomato slices, one on top and one on bottom. The Onion-Wrapped version does the same with whole grilled onions. These add back some vegetable content while keeping the bun out of the picture. Both are available if you ask." },
        { h: "How to order it" },
        { p: "Say 'Flying Dutchman' by name — most locations know it. If you want to add toppings, name them after. If you want the tomato or onion wrap variation, describe it clearly: 'Flying Dutchman with tomato slices as the bun' or 'wrapped in whole grilled onion.'" },
      ]
    },
    3: {
      title: "Every Secret Drink You Can Order: Floats, Neapolitan Shakes, Arnold Palmers and More",
      date: "June 2026", readTime: "5 min read",
      body: [
        { h: "The drink menu is deeper than it looks" },
        { p: "On the surface, the drink selection is simple: three shake flavors, a handful of sodas, pink lemonade, and iced tea. But the hidden menu extends into drinks just as much as burgers. The ingredients in that kitchen can be combined in ways that produce a dozen different drinks most customers never think to order." },
        { h: "The Neapolitan Shake" },
        { p: "This is the most well-known secret drink. Ask for a Neapolitan Shake and the worker blends all three shake flavors — vanilla, chocolate, and strawberry — into a single cup. The result is a layered, multi-flavor shake that some locations will pour in separate stripes rather than fully blending. Either version works." },
        { h: "Floats" },
        { p: "Any soda on the menu can be turned into a float by adding a swirl of vanilla shake. The Root Beer Float is the most popular combination, but Coke floats, Dr Pepper floats, and 7-Up floats all work. When ordering, ask for a half cup of soda first — this prevents overflow when the shake is added." },
        { h: "The Arnold Palmer" },
        { p: "Half iced tea, half pink lemonade. This is a classic summer drink combination that works perfectly with the available ingredients. Most locations will make it on request. If the worker isn't familiar with the name, describe it directly." },
        { h: "Lemon-Up" },
        { p: "Half 7-Up, half pink lemonade. The fizz from the 7-Up turns the still lemonade into something closer to a sparkling lemonade. This is a lighter option than a shake but more interesting than a plain soda." },
        { h: "The Black & White and other two-flavor shakes" },
        { p: "Any two shake flavors can be combined. Chocolate and vanilla (Black & White) is the classic pairing. Vanilla and strawberry, chocolate and strawberry — all are available on request. The Around the World shake layers all three flavors in one cup without blending them together, so you can taste each section separately." },
        { h: "Large and X-Large shakes" },
        { p: "Standard shakes come in one size. But if you ask for a large or X-Large, most locations will accommodate. This isn't advertised anywhere on the board — it's one of the most straightforward hidden options and the one most likely to be granted without any pushback." },
      ]
    }
  };

  const post = content[postId];
  if (!post) return null;

  return (
    <div>
      <AdSlot label="728x90 Leaderboard — place AdSense unit here" height={90} />
      <button onClick={onBack} style={{ background: "none", border: "none", color: RED, fontWeight: "700", fontSize: "13px", cursor: "pointer", padding: "0 0 12px", display: "flex", alignItems: "center", gap: "4px" }}>← Back to Blog</button>
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: WHITE, borderRadius: "10px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "10px", color: GRAY, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>{post.date} · {post.readTime}</div>
            <h1 style={{ fontSize: "22px", fontWeight: "900", color: DARK, margin: "0 0 20px", lineHeight: "1.3" }}>{post.title}</h1>
            {post.body.map((block, i) => (
              <div key={i}>
                {block.h && <h2 style={{ fontSize: "17px", fontWeight: "800", color: DARK, margin: "20px 0 8px" }}>{block.h}</h2>}
                {block.p && <p style={{ fontSize: "14px", color: GRAY, lineHeight: "1.7", margin: "0 0 4px" }}>{block.p}</p>}
              </div>
            ))}
          </div>
          <div style={{ background: RED, borderRadius: "10px", padding: "20px", marginTop: "16px", color: WHITE, textAlign: "center" }}>
            <div style={{ fontSize: "15px", fontWeight: "800", marginBottom: "6px" }}>Build your exact order →</div>
            <div style={{ fontSize: "13px", opacity: 0.85, marginBottom: "12px" }}>Use the builder on the home page to get your drive-thru script.</div>
            <button onClick={onBack} style={{ background: WHITE, color: RED, border: "none", borderRadius: "6px", padding: "10px 20px", fontWeight: "800", fontSize: "13px", cursor: "pointer" }}>Go to the Builder</button>
          </div>
          <AdSlot label="728x90 — place AdSense unit here" height={90} />
        </div>
        <div style={{ width: "160px", flexShrink: 0 }}>
          <AdSlot label="160x600 Sidebar — place AdSense unit here" height={600} sidebar />
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <AdSlot label="728x90 Leaderboard — place AdSense unit here" height={90} />
      <div style={{ background: WHITE, borderRadius: "10px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "900", color: DARK, margin: "0 0 16px" }}>About This Site</h1>
        <p style={{ fontSize: "14px", color: GRAY, lineHeight: "1.7", margin: "0 0 14px" }}>This is an independent fan-built tool for people who want to get more out of their West Coast burger experience. It is not affiliated with, endorsed by, or connected to any restaurant chain.</p>
        <p style={{ fontSize: "14px", color: GRAY, lineHeight: "1.7", margin: "0 0 14px" }}>The hidden menu has existed for decades, passed around by word of mouth, food blogs, and Reddit threads. Most people who know about it still have to piece together their order from memory. This tool puts every option in one place and turns your selections into a real sentence you can say at the window.</p>
        <p style={{ fontSize: "14px", color: GRAY, lineHeight: "1.7", margin: "0 0 14px" }}>The combination count is calculated from real available ingredients: patty counts, cheese slices, bun styles, cook methods, toppings, fry preparations, and drink combinations. Each toggle changes the order script in real time. The share buttons let you send your order to a friend or post it to social media.</p>
        <h2 style={{ fontSize: "18px", fontWeight: "800", color: DARK, margin: "24px 0 10px" }}>Disclaimer</h2>
        <p style={{ fontSize: "13px", color: GRAY, lineHeight: "1.7", margin: "0 0 10px" }}>This site is an independent, fan-created resource and is not affiliated with, authorized by, sponsored by, or endorsed by any restaurant chain. All restaurant names, menu items, and customizations referenced on this site are the property of their respective owners. All information is provided for entertainment and informational purposes only.</p>
        <p style={{ fontSize: "13px", color: GRAY, lineHeight: "1.7", margin: 0 }}>Menu availability may vary by location. Always confirm with the restaurant before ordering.</p>
      </div>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div>
      <div style={{ background: WHITE, borderRadius: "10px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "900", color: DARK, margin: "0 0 16px" }}>Privacy Policy</h1>
        <p style={{ fontSize: "13px", color: GRAY, lineHeight: "1.7", margin: "0 0 12px" }}><strong>Last updated:</strong> June 2026</p>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: DARK, margin: "20px 0 8px" }}>Information We Collect</h2>
        <p style={{ fontSize: "13px", color: GRAY, lineHeight: "1.7", margin: "0 0 12px" }}>This site does not require registration or login. We do not collect personal information directly. We do not store your order selections or share buttons usage. No user accounts are created on this site.</p>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: DARK, margin: "20px 0 8px" }}>Advertising</h2>
        <p style={{ fontSize: "13px", color: GRAY, lineHeight: "1.7", margin: "0 0 12px" }}>This site uses Google AdSense to display advertisements. Google AdSense may use cookies and web beacons to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" style={{ color: RED }}>Google's Ads Settings</a>.</p>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: DARK, margin: "20px 0 8px" }}>Cookies</h2>
        <p style={{ fontSize: "13px", color: GRAY, lineHeight: "1.7", margin: "0 0 12px" }}>Third-party vendors including Google use cookies to serve ads based on a user's prior visits. These cookies allow Google and its partners to serve ads based on your visit to this and other websites on the Internet. Users may opt out of the use of cookies by visiting the Network Advertising Initiative opt-out page or the Google Analytics opt-out page.</p>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: DARK, margin: "20px 0 8px" }}>Third-Party Links</h2>
        <p style={{ fontSize: "13px", color: GRAY, lineHeight: "1.7", margin: "0 0 12px" }}>This site may contain links to other websites. We are not responsible for the privacy practices of those sites.</p>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: DARK, margin: "20px 0 8px" }}>Contact</h2>
        <p style={{ fontSize: "13px", color: GRAY, lineHeight: "1.7", margin: 0 }}>If you have questions about this privacy policy, contact us at: privacy@yourdomain.com</p>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [blogPost, setBlogPost] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navTo = (p) => { setPage(p); setBlogPost(null); setMenuOpen(false); };
  const goPost = (id) => { setBlogPost(id); setPage("blogpost"); };
  const goBackBlog = () => { setPage("home"); setBlogPost(null); };

  const navItems = [
    { id: "home", label: "Builder" },
    { id: "blog", label: "Blog" },
    { id: "about", label: "About" },
    { id: "privacy", label: "Privacy" },
  ];

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: CREAM, minHeight: "100vh", color: DARK }}>
      {/* NAV */}
      <nav style={{ background: RED, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 16px", height: NAV_HEIGHT, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => navTo("home")} style={{ cursor: "pointer" }}>
            <span style={{ fontWeight: "900", fontSize: "16px", color: WHITE, textTransform: "uppercase", letterSpacing: "0.5px" }}>Secret Menu Builder</span>
          </div>
          {/* Desktop nav */}
          <div style={{ display: "flex", gap: "4px" }}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => navTo(n.id)} style={{ background: page === n.id ? "rgba(255,255,255,0.2)" : "none", border: "none", color: WHITE, fontWeight: page === n.id ? "700" : "400", fontSize: "13px", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>{n.label}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "20px 16px 60px" }}>
        {page === "home" && <HomePage />}
        {page === "blog" && <BlogListPage onPost={goPost} />}
        {page === "blogpost" && <BlogPostPage postId={blogPost} onBack={goBackBlog} />}
        {page === "about" && <AboutPage />}
        {page === "privacy" && <PrivacyPage />}
      </div>

      {/* FOOTER */}
      <footer style={{ background: DARK, color: "rgba(255,255,255,0.5)", padding: "20px 16px", textAlign: "center", fontSize: "12px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "10px", flexWrap: "wrap" }}>
            {navItems.map(n => <span key={n.id} onClick={() => navTo(n.id)} style={{ cursor: "pointer", color: "rgba(255,255,255,0.6)" }}>{n.label}</span>)}
          </div>
          <p style={{ margin: 0 }}>Independent fan site. Not affiliated with any restaurant chain. Menu availability may vary by location.</p>
        </div>
      </footer>
    </div>
  );
}
