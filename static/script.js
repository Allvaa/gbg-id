const uploadForm = document.getElementById("upload-form");
const uploadArea = document.getElementById("upload-area");
const fileInput = document.getElementById("file-input");
const btnChoose = document.getElementById("btn-choose");
const btnIdentify = document.getElementById("btn-identify");
const previewBox = document.getElementById("preview-box");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");

const resultTag = document.getElementById("result-tag");
const resultLabel = document.getElementById("result-label");
const resultConfidence = document.getElementById("result-confidence");
const resultRecommendation = document.getElementById("result-recommendation");
const resultNotes = document.getElementById("result-notes");

let selectedFile = null;

// Preview image handler
function setPreview(file) {
    if (!file) {
        previewBox.innerHTML = '<span class="preview-placeholder">Belum ada gambar</span>';
        previewBox.removeAttribute('aria-label');
        return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('File harus berupa gambar (JPG, PNG, WEBP)');
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showError('Ukuran file maksimal 10MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = e => {
        previewBox.innerHTML = "";
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Preview gambar sampah yang diupload";
        previewBox.appendChild(img);
        previewBox.setAttribute('aria-label', `Preview: ${file.name}`);
        hideError();
    };
    reader.onerror = () => {
        showError('Gagal membaca file. Silakan coba lagi.');
    };
    reader.readAsDataURL(file);
}

// Error handling
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// File selection
btnChoose.onclick = () => fileInput.click();

fileInput.onchange = e => {
    selectedFile = e.target.files[0];
    setPreview(selectedFile);
};

// Drag and drop
uploadArea.addEventListener("dragover", e => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", e => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", e => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        selectedFile = files[0];
        fileInput.files = files;
        setPreview(selectedFile);
    }
});

// Keyboard accessibility for upload area
uploadArea.addEventListener("keydown", e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
    }
});

// Reset form
uploadForm.addEventListener("reset", () => {
    selectedFile = null;
    setPreview(null);
    resultTag.classList.add("hidden");
    
    // Reset badges
    document.getElementById("type-badge").classList.add("hidden");
    document.getElementById("recyclable-badge").classList.add("hidden");
    
    resultConfidence.textContent = "Belum ada prediksi.";
    resultRecommendation.innerHTML = "<li>Unggah foto untuk melihat rekomendasi.</li>";
    resultNotes.textContent = "Model AI ini membantu mengidentifikasi jenis sampah untuk pembuangan yang lebih efisien dan ramah lingkungan.";
    hideError();
    btnIdentify.disabled = false;
});

// Add recommendation item
function addRec(text, icon = "•") {
    const li = document.createElement("li");
    li.textContent = `${icon} ${text}`;
    resultRecommendation.appendChild(li);
}

// Class-specific recommendations
function getClassSpecificRecommendations(className) {
    const recommendations = {
        'battery': [
            { text: "JANGAN buang ke tempat sampah biasa - berbahaya!", icon: "⚠️" },
            { text: "Kumpulkan di wadah khusus terpisah dari sampah lain", icon: "📦" },
            { text: "Bisa diserahkan ke bank sampah yang terima B3", icon: "♻️" },
            { text: "Baterai mengandung logam berat berbahaya", icon: "☠️" },
            { text: "Lindungi terminal dengan lakban agar tidak hubung singkat", icon: "⚡" },
            { text: "Jangan dibakar atau dibongkar sendiri", icon: "🔥" }
        ],
        'biological': [
            { text: "Pisahkan ke tempat sampah organik (warna hijau)", icon: "🟢" },
            { text: "Ideal untuk dijadikan kompos rumah tangga", icon: "🌱" },
            { text: "Pastikan tidak tercampur plastik atau logam", icon: "✓" },
            { text: "Tutup wadah untuk menghindari bau dan lalat", icon: "🗑️" },
            { text: "Waktu pengomposan sekitar 4-6 minggu", icon: "⏱️" },
            { text: "Hasil kompos bagus untuk tanaman hias dan sayur", icon: "🪴" }
        ],
        'cardboard': [
            { text: "Ratakan/lipat untuk menghemat ruang penyimpanan", icon: "📦" },
            { text: "Pastikan kardus dalam keadaan kering dan bersih", icon: "🧹" },
            { text: "Pisahkan dari lakban dan stiker plastik", icon: "✂️" },
            { text: "Bisa didaur ulang menjadi kardus atau kertas baru", icon: "♻️" },
            { text: "Hindari kardus yang terkena minyak/makanan", icon: "⚠️" },
        ],
        'clothes': [
            { text: "Jangan buang jika masih bisa dipakai - donasikan!", icon: "❤️" },
            { text: "Cuci bersih sebelum disumbangkan atau dijual", icon: "🧺" },
            { text: "Bisa disumbangkan ke panti asuhan atau kotak amal", icon: "🏠" },
            { text: "Jual di thrift shop atau platform second hand", icon: "👕" },
            { text: "Pakaian rusak bisa dijadikan lap atau kerajinan", icon: "✂️" },
            { text: "Tekstil butuh 200+ tahun untuk terurai di TPA", icon: "⏳" }
        ],
        'glass': [
            { text: "Pisahkan berdasarkan warna jika memungkinkan", icon: "🎨" },
            { text: "Cuci bersih dari sisa isi sebelum didaur ulang", icon: "💧" },
            { text: "Buang tutup logam/plastik terpisah", icon: "🔩" },
            { text: "Hati-hati pecahan - bungkus dengan koran/kardus", icon: "⚠️" },
            { text: "Kaca utuh lebih bernilai daripada yang pecah", icon: "💎" },
            { text: "Dapat didaur ulang tanpa batas waktu", icon: "♻️" },
            { text: "Serahkan ke tukang loak atau bank sampah", icon: "🏪" }
        ],
        'metal': [
            { text: "Pisahkan logam dari bahan lain (plastik, karet)", icon: "🔧" },
            { text: "Bersihkan dari karat atau kotoran berlebih", icon: "🧽" },
            { text: "Kaleng minuman: cuci dan pipihkan untuk hemat ruang", icon: "🥫" },
            { text: "Aluminium, besi, tembaga dapat didaur ulang berkali-kali", icon: "♻️" },
            { text: "Hemat energi 95% dibanding produksi logam baru", icon: "⚡" },
            { text: "Jangan campur dengan sampah basah organik", icon: "🚫" }
        ],
        'paper': [
            { text: "Pisahkan kertas bersih dari yang kotor/berminyak", icon: "📄" },
            { text: "Kertas kotor tidak bisa didaur ulang", icon: "⚠️" },
            { text: "Sobek atau hancurkan dokumen penting sebelum dibuang", icon: "🔒" },
            { text: "Kertas HVS dan koran paling mudah didaur ulang", icon: "📰" },
            { text: "Hindari kertas dengan lapisan plastik/lilin", icon: "🚫" },
            { text: "Kumpulkan dalam jumlah banyak untuk efisiensi", icon: "📚" }
        ],
        'plastic': [
            { text: "Cek kode segitiga di bawah kemasan (1-7)", icon: "🔢" },
            { text: "Cuci bersih dari sisa makanan/minuman", icon: "🧴" },
            { text: "Keringkan sebelum disimpan untuk didaur ulang", icon: "☀️" },
            { text: "Plastik jenis 1 (PET) dan 2 (HDPE) paling mudah didaur ulang", icon: "♻️" },
            { text: "Hindari plastik hitam - sulit di-recycle", icon: "⚫" },
            { text: "Serahkan ke bank sampah (Rp 500-3.000/kg)", icon: "🏦" },
            { text: "Plastik kresek bisa dikumpulkan jadi ecobrick", icon: "🧱" },
            { text: "Kurangi penggunaan plastik sekali pakai", icon: "🌍" }
        ],
        'shoes': [
            { text: "Sepatu layak pakai: donasikan atau jual second", icon: "👟" },
            { text: "Bersihkan dan perbaiki jika masih bisa digunakan", icon: "🧹" },
            { text: "Beberapa brand punya program recycle sepatu", icon: "🔄" },
            { text: "Sepatu rusak bisa dijadikan pot tanaman kreatif", icon: "🌿" },
            { text: "Pisahkan bagian karet, kulit, dan tekstil jika memungkinkan", icon: "✂️" },
            { text: "Jangan buang ke tempat sampah biasa - sulit terurai", icon: "⚠️" }
        ],
        'trash': [
            { text: "Sampah campur/residu - buang ke tempat sampah umum", icon: "🗑️" },
            { text: "Pastikan tidak ada bahan berbahaya (B3)", icon: "⚠️" },
            { text: "Cek ulang apakah ada yang bisa dipisahkan untuk recycle", icon: "🔍" },
            { text: "Kemas rapat dalam kantong plastik tertutup", icon: "🎒" },
            { text: "Akan dibawa ke TPA untuk dikelola lebih lanjut", icon: "🚛" },
            { text: "Usahakan minimalisir sampah jenis ini", icon: "📉" },
            { text: "Terapkan prinsip 3R: Reduce, Reuse, Recycle", icon: "♻️" }
        ]
    };

    return recommendations[className] || [];
}

// Get detailed notes for each class
function getClassNotes(className, confidence) {
    const notes = {
        'battery': `Baterai bekas termasuk limbah B3 (Bahan Berbahaya dan Beracun) yang mengandung logam berat seperti merkuri, kadmium, dan timbal. JANGAN dibuang sembarangan karena dapat mencemari tanah dan air tanah. Tingkat keyakinan deteksi: ${confidence}%.`,
        
        'biological': `Sampah biologis/organik mudah terurai secara alami dan sangat cocok untuk dijadikan kompos. Pengomposan mengurangi volume sampah ke TPA hingga 40% dan menghasilkan pupuk alami berkualitas. Tingkat keyakinan deteksi: ${confidence}%.`,
        
        'cardboard': `Kardus adalah material yang sangat bernilai dalam daur ulang. Satu ton kardus daur ulang menghemat 17 pohon, 7.000 galon air, dan 4.100 kWh energi. Kardus dapat didaur ulang hingga 5-7 kali. Tingkat keyakinan deteksi: ${confidence}%.`,
        
        'clothes': `Industri fashion menghasilkan 92 juta ton sampah tekstil per tahun. Pakaian bekas yang masih layak pakai sebaiknya didonasikan atau dijual kembali untuk memperpanjang siklus hidupnya dan mengurangi jejak karbon. Tingkat keyakinan deteksi: ${confidence}%.`,
        
        'glass': `Kaca adalah material yang dapat didaur ulang 100% tanpa kehilangan kualitas. Daur ulang kaca menghemat 30% energi dibanding produksi kaca baru dan mengurangi emisi CO2. Kaca butuh 4.000 tahun untuk terurai di alam. Tingkat keyakinan deteksi: ${confidence}%.`,
        
        'metal': `Logam adalah salah satu material paling berharga untuk didaur ulang. Daur ulang aluminium menghemat 95% energi, sementara besi/baja menghemat 60-74%. Logam dapat didaur ulang tanpa batas tanpa kehilangan kualitas. Tingkat keyakinan deteksi: ${confidence}%.`,
        
        'paper': `Produksi kertas daur ulang menggunakan 70% lebih sedikit energi dan air dibanding kertas baru. Satu ton kertas daur ulang menyelamatkan 17 pohon dewasa. Kertas dapat didaur ulang 5-7 kali sebelum seratnya terlalu pendek. Tingkat keyakinan deteksi: ${confidence}%.`,
        
        'plastic': `Indonesia menghasilkan 6,8 juta ton sampah plastik per tahun. Hanya sekitar 10% yang didaur ulang. Plastik dapat bertahan hingga 500 tahun di lingkungan. Daur ulang plastik menghemat 66% energi dibanding produksi plastik baru. Tingkat keyakinan deteksi: ${confidence}%.`,
        
        'shoes': `Sepatu mengandung berbagai material (karet, kulit, tekstil, plastik) yang sulit terurai. Satu pasang sepatu butuh 30-40 tahun untuk terurai. Program recycle sepatu dapat memisahkan komponen untuk digunakan kembali atau menjadi material baru. Tingkat keyakinan deteksi: ${confidence}%.`,
        
        'trash': `Sampah residu adalah sampah yang tidak dapat lagi dipisahkan atau didaur ulang. Upayakan selalu memilah sampah dengan benar untuk meminimalkan kategori ini. Penerapan zero waste lifestyle dapat mengurangi sampah residu hingga 80%. Tingkat keyakinan deteksi: ${confidence}%.`
    };

    return notes[className] || `Hasil identifikasi dengan tingkat keyakinan ${confidence}%. Pengelolaan sampah yang tepat membantu mengurangi dampak negatif terhadap lingkungan.`;
}

// Form submission
uploadForm.addEventListener("submit", async e => {
    e.preventDefault();
    
    if (!selectedFile) {
        showError("Mohon upload gambar terlebih dahulu.");
        return;
    }

    // Disable button and show loading
    btnIdentify.disabled = true;
    loading.classList.remove("hidden");
    resultConfidence.textContent = "Memproses gambar...";
    hideError();

    const formData = new FormData(uploadForm);

    try {
        const res = await fetch("/predict", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        
        // Hide loading
        loading.classList.add("hidden");
        btnIdentify.disabled = false;

        // Display results
        resultTag.classList.remove("hidden");
        resultLabel.textContent = data.class_name || "Tidak diketahui";

        const confidence = (data.confidence * 100).toFixed(1);
        resultConfidence.textContent = `Keyakinan model: ${confidence}%`;

        // Update type badge (Organik/Anorganik)
        const typeBadge = document.getElementById("type-badge");
        typeBadge.classList.remove("hidden", "badge-organik", "badge-anorganik");
        
        if (data.type === "organik") {
            typeBadge.textContent = "🌿 Organik";
            typeBadge.classList.add("badge-organik");
        } else if (data.type === "anorganik") {
            typeBadge.textContent = "🔷 Anorganik";
            typeBadge.classList.add("badge-anorganik");
        } else {
            typeBadge.classList.add("hidden");
        }

        // Update recyclability badge
        const recyclableBadge = document.getElementById("recyclable-badge");
        recyclableBadge.classList.remove("hidden", "badge-recyclable", "badge-non-recyclable");
        
        if (data.recyclable === true) {
            recyclableBadge.textContent = "♻️ Dapat Didaur Ulang";
            recyclableBadge.classList.add("badge-recyclable");
        } else if (data.recyclable === false) {
            recyclableBadge.textContent = "⚠️ Tidak Dapat Didaur Ulang";
            recyclableBadge.classList.add("badge-non-recyclable");
        } else {
            recyclableBadge.classList.add("hidden");
        }

        // Build class-specific recommendations
        resultRecommendation.innerHTML = "";
        const className = data.class_name.toLowerCase();
        const recs = getClassSpecificRecommendations(className);
        
        if (recs.length > 0) {
            recs.forEach(rec => addRec(rec.text, rec.icon));
        } else {
            // Fallback to generic recommendations
            addRec("Pisahkan sampah sesuai jenisnya", "🗑️");
            addRec("Serahkan ke bank sampah jika bisa didaur ulang", "♻️");
        }

        // Update notes with class-specific information
        resultNotes.textContent = getClassNotes(className, confidence);

    } catch (err) {
        loading.classList.add("hidden");
        btnIdentify.disabled = false;
        showError(`Gagal memproses gambar: ${err.message}. Silakan coba lagi.`);
        console.error("Error:", err);
    }
});
