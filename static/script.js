const uploadForm = document.getElementById("upload-form");
const uploadArea = document.getElementById("upload-area");
const fileInput = document.getElementById("file-input");
const btnChoose = document.getElementById("btn-choose");
const previewBox = document.getElementById("preview-box");
const loading = document.getElementById("loading");

const resultTag = document.getElementById("result-tag");
const resultLabel = document.getElementById("result-label");
const resultConfidence = document.getElementById("result-confidence");
const resultRecommendation = document.getElementById("result-recommendation");
const resultNotes = document.getElementById("result-notes");

let selectedFile = null;

function setPreview(file) {
    if (!file) {
        previewBox.innerHTML = "Belum ada gambar";
        return;
    }
    const reader = new FileReader();
    reader.onload = e => {
        previewBox.innerHTML = "";
        const img = document.createElement("img");
        img.src = e.target.result;
        previewBox.appendChild(img);
    };
    reader.readAsDataURL(file);
}

btnChoose.onclick = () => fileInput.click();

fileInput.onchange = e => {
    selectedFile = e.target.files[0];
    setPreview(selectedFile);
};

uploadArea.addEventListener("dragover", e => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", e => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
    selectedFile = e.dataTransfer.files[0];
    fileInput.files = e.dataTransfer.files;
    setPreview(selectedFile);
});

uploadForm.addEventListener("reset", () => {
    selectedFile = null;
    setPreview(null);
    resultTag.classList.add("hidden");
    resultConfidence.textContent = "Belum ada prediksi.";
    resultRecommendation.innerHTML = "<li>Unggah foto untuk melihat rekomendasi.</li>";
    resultNotes.textContent = "Hasil prediksi ini masih simulasi.";
});

function addRec(text) {
    const li = document.createElement("li");
    li.textContent = text;
    resultRecommendation.appendChild(li);
}

uploadForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!selectedFile) {
        alert("Mohon upload gambar terlebih dahulu.");
        return;
    }

    loading.classList.remove("hidden");
    resultConfidence.textContent = "Memproses gambar...";

    const formData = new FormData(uploadForm);

    fetch("/predict", {
        method: "POST",
        body: formData
    })
        .then(res => {
            if (!res.ok) throw new Error("Gagal memproses gambar");
            return res.json();
        })
        .then(data => {
            loading.classList.add("hidden");

            resultTag.classList.remove("hidden");
            resultLabel.textContent = data.class_name;

            resultConfidence.textContent =
                `Keyakinan model: ${(data.confidence * 100).toFixed(1)}%`;

            // Buat rekomendasi dari metadata
            resultRecommendation.innerHTML = "";

            if (data.type === "organik") {
                addRec("Masukkan ke tempat sampah organik.");
                addRec("Dapat dijadikan kompos.");
            } else {
                addRec("Masukkan ke tempat sampah anorganik.");
            }

            if (data.recyclable) {
                addRec("Sampah ini dapat didaur ulang.");
                addRec("Bersihkan sebelum diserahkan ke pengepul.");
            } else {
                addRec("Sampah ini tidak dapat didaur ulang.");
            }
        })
        .catch(err => {
            loading.classList.add("hidden");
            alert(err.message);
        });
});