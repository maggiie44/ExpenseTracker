import { useState } from "react";
import { createWorker, PSM } from "tesseract.js";

// ---------- helpers ----------

// โหลดไฟล์ภาพเป็น HTMLImageElement
const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

// ตัดเฉพาะแถว "จำนวนเงิน" ของสลิป SCB (สัดส่วนจากตัวอย่างที่แนบ) แล้วขยาย 2 เท่า
// ปรับค่า REGION ได้ถ้าสลิปธนาคารอื่นมี layout ต่างกัน
const REGION = { x: 0.4, y: 0.66, w: 0.6, h: 0.08 };

function cropAmountRegion(img) {
  const sx = img.width * REGION.x;
  const sy = img.height * REGION.y;
  const sw = img.width * REGION.w;
  const sh = img.height * REGION.h;
  const scale = 2;

  const canvas = document.createElement("canvas");
  canvas.width = sw * scale;
  canvas.height = sh * scale;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// หาตัวเลขรูปแบบเงิน เช่น 110.00 หรือ 1,250.50
const MONEY = /\d{1,3}(?:,\d{3})*\.\d{2}/g;

function parseAmount(text) {
  const matches = text.replace(/\s/g, "").match(MONEY);
  if (!matches) return null;
  return matches[matches.length - 1].replace(/,/g, "");
}

// ---------- OCR ----------

async function readAmount(file) {
  const img = await loadImage(file);

  // ขั้นที่ 1: ตัดเฉพาะบริเวณจำนวนเงิน แล้วอ่านเฉพาะตัวเลข (เร็วและแม่นที่สุด)
  const worker = await createWorker("eng");
  await worker.setParameters({
    tessedit_char_whitelist: "0123456789.,",
    tessedit_pageseg_mode: PSM.SINGLE_LINE,
  });
  const { data } = await worker.recognize(cropAmountRegion(img));
  await worker.terminate();

  const quick = parseAmount(data.text);
  if (quick) return { amount: quick, method: "crop + digits", raw: data.text };

  // ขั้นที่ 2 (สำรอง): อ่านทั้งภาพด้วยภาษาไทย แล้วหาบรรทัดที่มีคำว่า "จำนวนเงิน"
  const thWorker = await createWorker("tha+eng");
  const full = await thWorker.recognize(file);
  await thWorker.terminate();

  // Tesseract ภาษาไทยมักแทรกช่องว่างระหว่างตัวอักษร จึงลบช่องว่างก่อนเทียบ
  const lines = full.data.text.split("\n");
  const line = lines.find((l) => l.replace(/\s/g, "").includes("จำนวนเงิน"));
  const fromLine = line ? parseAmount(line) : null;

  return {
    amount: fromLine ?? parseAmount(full.data.text),
    method: "full-image Thai OCR",
    raw: full.data.text,
  };
}

// ---------- component ----------

export default function SlipAmountOCR() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
    setLoading(true);
    try {
      setResult(await readAmount(file));
    } catch (err) {
      setError("อ่านภาพไม่สำเร็จ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "24px auto", fontFamily: "sans-serif" }}>
      <h2>อ่านจำนวนเงินจากสลิป</h2>
      <input type="file" accept="image/*" onChange={onFile} />

      {preview && (
        <img src={preview} alt="slip" style={{ width: "100%", marginTop: 12 }} />
      )}

      {loading && <p>กำลังอ่านภาพ…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 12 }}>
          {result.amount ? (
            <p style={{ fontSize: 28, margin: 0 }}>
              แสดงจำนวนเงิน: <b>{Number(result.amount).toLocaleString("th-TH", { minimumFractionDigits: 2 })}</b> บาท
            </p>
          ) : (
            <p>ไม่พบจำนวนเงินในภาพ ลองปรับค่า REGION หรือใช้ภาพที่ชัดขึ้น</p>
          )}
          <small style={{ color: "#666" }}>วิธีที่ใช้: {result.method}</small>
        </div>
      )}
    </div>
  );
}
