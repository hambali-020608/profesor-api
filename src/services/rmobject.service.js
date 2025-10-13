import fs from "fs";
import FormData from "form-data";
import axios from "axios";

// Fungsi untuk memastikan response bisa dibaca sebagai JSON
async function parseMaybeJson(buffer) {
  try {
    let text = buffer.toString("utf8");

    // Bersihkan karakter aneh di awal/akhir seperti (/X�
    text = text
      .replace(/[^\x20-\x7E]+/g, "") // hapus karakter non-printable
      .replace(/^[(\/)X]+/, "") // hapus tanda seperti (/X di awal
      .trim();

    // Ambil hanya isi JSON (antara { dan })
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.slice(jsonStart, jsonEnd + 1);
    }

    return JSON.parse(text);
  } catch (e) {
    return { kind: "text", data: buffer.toString("utf8") };
  }
}

const form = new FormData();
form.append("original_image_file", fs.createReadStream("./image.png"));
form.append("mask_file", fs.createReadStream("./mask.png"));

const productSerial = "4e0ac470"; // ganti kalau perlu

try {
  // Kirim gambar dan mask
  const response = await axios.post(
    "https://api.ezremove.ai/api/ez-remove/obj-remove/create-job",
    form,
    {
      headers: {
        ...form.getHeaders(),
        accept: "*/*",
        origin: "https://ezremove.ai",
        referer: "https://ezremove.ai/",
        "user-agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
        "product-serial": productSerial,
        dnt: "1",
      },
      maxBodyLength: Infinity,
    }
  );

  // Bersihkan dan ubah response ke JSON
  const cleanResponse = await response.data
  console.log("✅ Response:", cleanResponse);

  // Ambil job_id dari response
  const jobId = cleanResponse?.result?.job_id;
  if (!jobId) throw new Error("Tidak mendapat job_id dari response!");

  // Dapatkan hasil object removal
  const responseRemove = await axios.get(
    `https://api.ezremove.ai/api/ez-remove/obj-remove/get-job/${jobId}`,
    {
      headers: {
        accept: "*/*",
        origin: "https://ezremove.ai",
        referer: "https://ezremove.ai/",
        "user-agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
        "product-serial": productSerial,
        dnt: "1",
      },
      maxBodyLength: Infinity,
    }
  );

  console.log("✅ Hasil get-job:", responseRemove.data);
} catch (error) {
  console.error("❌ Error:", error.response?.data || error.message);
}
