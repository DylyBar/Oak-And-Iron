/* Oak & Iron - Rarity tiers and RNG drop tables for every gathered resource. Loaded after item art. */
const RARITY = {
  common: { name: "Common", color: "#b8b8b8", yield: 0.9 },
  uncommon: { name: "Uncommon", color: "#5ec45e", yield: 0.75 },
  rare: { name: "Rare", color: "#4a9aff", yield: 0.55 },
  epic: { name: "Epic", color: "#b45cff", yield: 0.38 },
  legendary: { name: "Legendary", color: "#ffb030", yield: 0.22 },
};
const ITEM_RARITY = {
  Logs: "common", "Copper ore": "common", "Tin ore": "common", Clay: "common", "Raw shrimp": "common", Redberries: "common",
  Potato: "common", Bones: "common", Feathers: "common", Wool: "common", "Raw chicken": "common", "Old boot": "common",
  "Oak logs": "uncommon", "Iron ore": "uncommon", "Raw trout": "uncommon", "Grimy guam": "uncommon", Cowhide: "uncommon",
  "Raw beef": "uncommon", "Raw mutton": "uncommon", "Bird's nest": "uncommon", "Uncut sapphire": "uncommon",
  "Willow logs": "rare", "Silver ore": "rare", Coal: "rare", "Raw salmon": "rare", "Gold ore": "rare", Pearl: "rare", "Uncut emerald": "rare",
  "Yew logs": "epic", "Mithril ore": "epic", "Raw swordfish": "epic", "Adamantite ore": "epic", Amber: "epic", "Uncut ruby": "epic",
  "Runite ore": "legendary", "Uncut diamond": "legendary", "Golden potato": "legendary", Runes: "uncommon",
  "Minor health potion": "uncommon", "Minor mana potion": "uncommon", "Stamina potion": "uncommon",
  "Health potion": "rare", "Mana potion": "rare", "Greater health potion": "epic", "Greater mana potion": "epic",
};
const rarityId = (n) => ITEM_RARITY[n] || ITEM_RARITY[n.replace(/^(Cooked|Burnt)/, "Raw")] || "common";
const rarityOf = (n) => RARITY[rarityId(n)];
/* Bonus finds rolled on every successful gather: [item, chance, min, max]. Chance rises a little with node tier. */
const BONUS = {
  tree: [["Bird's nest", 0.035, 1, 1], ["Amber", 0.006, 1, 1]],
  rock: [["Uncut sapphire", 0.03, 1, 1], ["Uncut emerald", 0.015, 1, 1], ["Uncut ruby", 0.008, 1, 1], ["Uncut diamond", 0.003, 1, 1]],
  fish: [["Old boot", 0.05, 1, 1], ["Pearl", 0.012, 1, 1]],
  plot: [["Golden potato", 0.02, 1, 1]],
  forage: [["Pearl", 0, 1, 1]],
};
/* [item, chance, minimum monster level]. Potions drop from monsters too. */
const MONSTER_BONUS = [
  ["Uncut sapphire", 0.02, 4], ["Uncut emerald", 0.01, 12], ["Uncut ruby", 0.005, 20],
  ["Minor health potion", 0.05, 1], ["Minor mana potion", 0.03, 1], ["Stamina potion", 0.02, 8],
  ["Health potion", 0.03, 14], ["Mana potion", 0.02, 14],
  ["Greater health potion", 0.012, 34], ["Greater mana potion", 0.008, 34],
];
/* Ground items (dropped by the player or left as monster loot) vanish after 5 minutes. Ticks are 600 ms. */
const GROUND_TTL = Math.round((5 * 60 * 1000) / 600);
function gdrop(n, q, x, y) {
  const e = STK.includes(n) && gd.find((i) => i.n == n && i.x == x && i.y == y);
  if (e) {
    e.q += q;
    e.u = tickN + GROUND_TTL;
  } else gd.push({ n, q, x, y, u: tickN + GROUND_TTL });
}
function groundDrop(n, q) {
  gdrop(n, q, P.x, P.y);
}
/* Give an item; if the bag is full it falls to the ground. Rare finds are highlighted. */
function giveDrop(n, q, tag) {
  const r = rarityId(n);
  if (!add(n, q)) {
    groundDrop(n, q);
    msg("Your bag is full, so " + n.toLowerCase() + " drops at your feet.");
  }
  if (r != "common" && tag !== false) msg((tag || "You find") + " " + (q > 1 ? q + " " : "") + n.toLowerCase() + " [" + RARITY[r].name + "]!", r != "uncommon");
}
/* Does the main resource drop on this successful gather? Chance depends on its rarity. */
const rollYield = (n) => R() < rarityOf(n).yield;
function rollBonus(kind, tier) {
  (BONUS[kind] || []).forEach(([n, c, a, b]) => {
    if (c && R() < c * (1 + (tier || 0) * 0.35)) giveDrop(n, a + Math.floor(R() * (b - a + 1)), "Lucky! You find");
  });
}
