import { useEffect, useState } from "react";
import emojiMap from "../utils/emojiMap";

export default function Home() {
  const [seeds, setSeeds] = useState([]);
  const [gear, setGear] = useState([]);
  const [eggs, setEggs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const API = "https://rioo-project-web.vercel.app/stock/grow"; // sumber

  async function load() {
    try {
      setLoading(true);
      const res = await fetch(API, { cache: "no-store" });
      const json = await res.json();

      // API kamu -> root keys: seeds, gears, eggs (arrays of {name, value})
      const seedsArr = Array.isArray(json.seeds) ? json.seeds : [];
      const gearArr = Array.isArray(json.gears) ? json.gears : [];
      const eggsArr = Array.isArray(json.eggs) ? json.eggs : [];

      // normalize to objects with name + value (value fallback to 0)
      const mapItem = (it) => ({
        name: it.name ?? "Unknown",
        value: typeof it.value === "number" ? it.value : (it.value ? Number(it.value) : 0),
      });

      setSeeds(seedsArr.map(mapItem));
      setGear(gearArr.map(mapItem));
      setEggs(eggsArr.map(mapItem));
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30000); // refresh 30s
    return () => clearInterval(id);
  }, []);

  const renderList = (items) =>
    items.map((it, idx) => {
      const key = it.name.toLowerCase();
      const emoji = emojiMap[key] || emojiMap.default;
      return (
        <li className="item" key={idx}>
          <div className="left">
            <div className="emoji">{emoji}</div>
            <div className="name">{it.name}</div>
          </div>
          <div className="val">{it.value}</div>
        </li>
      );
    });

  return (
    <div className="page">
      <header className="top">
        <div className="wrap">
          <h1>🌱 Grow A Garden — Stock</h1>
          <div className="meta">Seeds · Gear · Eggs</div>
        </div>
      </header>

      <main className="wrap mainGrid">
        {loading ? (
          <div className="loading">Memuat data...</div>
        ) : (
          <>
            <section className="card">
              <h2>🌾 Seeds</h2>
              <ul className="list">{renderList(seeds)}</ul>
            </section>

            <section className="card">
              <h2>⚙️ Gear</h2>
              <ul className="list">{renderList(gear)}</ul>
            </section>

            <section className="card">
              <h2>🥚 Eggs</h2>
              <ul className="list">{renderList(eggs)}</ul>
            </section>
          </>
        )}
      </main>

      <footer className="footer wrap">
        <div className="status">
          {lastUpdate ? `Last update: ${lastUpdate.toLocaleString()}` : "Not updated yet"}
        </div>
        <div className="note">Source: rioo-project-web.vercel.app</div>
      </footer>

      <style jsx>{`
        .page { background:#070707; color:#eaf0f1; min-height:100vh; font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
        .wrap{max-width:1100px;margin:0 auto;padding:20px}
        .top{border-bottom:1px solid rgba(255,255,255,0.03); background:linear-gradient(90deg, rgba(255,255,255,0.02), transparent)}
        h1{margin:0;padding:18px 0;color:#00ff88}
        .meta{color:#9aa0a6;font-size:13px}
        .mainGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:22px}
        .card{background:linear-gradient(180deg,#0f1112,#0a0b0c);padding:16px;border-radius:12px;border:1px solid rgba(255,255,255,0.03); box-shadow: 0 6px 20px rgba(0,0,0,0.6)}
        .card h2{margin:0 0 12px;color:#ff8a3d}
        .list{list-style:none;margin:0;padding:0;max-height:60vh;overflow:auto}
        .item{display:flex;justify-content:space-between;align-items:center;padding:10px;border-radius:8px;margin-bottom:8px;background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent);border:1px solid rgba(255,255,255,0.02)}
        .left{display:flex;align-items:center;gap:12px}
        .emoji{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;background:rgba(255,255,255,0.02);font-size:18px}
        .name{font-weight:600}
        .val{color:#00ff88;font-weight:700}
        .footer{border-top:1px solid rgba(255,255,255,0.03);padding:14px 20px;color:#9aa0a6;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
        .loading{grid-column:1 / -1;text-align:center;padding:40px 0;color:#9aa0a6}
        @media (max-width:640px){ .wrap{padding:12px} .emoji{width:28px;height:28px} }
      `}</style>
    </div>
  );
}