function slugify(str) {
  return str        // ubah %20 jadi spasi, dll
    .replace(/\((\d{4})\)/, '-$1')      // ubah (2024) → -2024
    .replace(/&/g, '')                  // hilangkan &
    .replace(/\s+/g, '-')               // ganti semua spasi jadi -
    .replace(/[^a-z0-9\-]/gi, '')       // hapus semua karakter aneh
    .replace(/-+/g, '-')                // gabungkan double/triple - jadi satu
    .replace(/^-|-$/g, '')              // hapus tanda - di awal/akhir
    .toLowerCase();                    // ubah jadi lowercase
}

console.log(slugify('%20Deadpool%20&%20Wolverine%20(2024)'))