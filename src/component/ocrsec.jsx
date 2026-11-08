import { useEffect, useRef, useState } from "react";
import { createWorker } from "tesseract.js";

export default function Ocrsec() {
  const workerRef = useRef(null);

  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("เลือกรูปภาพเพื่อเริ่ม");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // ปิด Worker เมื่อ component ถูกถอดออกจากหน้า
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    // รับเฉพาะภาพ
    if (!file.type.startsWith("image/")) {
      setError("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }

    setError("");
    setText("");
    setProgress(0);
    setImageUrl(URL.createObjectURL(file));
    setIsProcessing(true);

    try {
      // สร้าง worker เพียงครั้งเดียว และนำกลับมาใช้ซ้ำ
      if (!workerRef.current) {
        workerRef.current = await createWorker(["tha", "eng"], 1, {
          
          logger: (message) => {
            setStatus(message.status);
            

            if (typeof message.progress === "number") {
              setProgress(Math.round(message.progress * 100));
            }
          },
        });
      }

      const result = await workerRef.current.recognize(file);

      setText(result.data.text);
      setStatus("อ่านเสร็จแล้ว");
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถอ่านข้อความจากภาพได้");
      setStatus("เกิดข้อผิดพลาด");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>React OCR ด้วย Tesseract.js</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isProcessing}
      />

      {imageUrl && (
        <img
          src={imageUrl}
          alt="ตัวอย่างภาพที่อัปโหลด"
          style={{ display: "block", maxWidth: "100%", maxHeight: 350, marginTop: 20 }}
        />
      )}

      <p>สถานะ: {status}</p>

      {isProcessing && (
        <progress value={progress} max="100" style={{ width: "100%" }}>
          {progress}%
        </progress>
      )}

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <h2>ข้อความที่อ่านได้</h2>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={12}
        style={{ width: "100%" }}
        placeholder="ผลลัพธ์ OCR จะแสดงที่นี่"
      />
    </main>
  );
}