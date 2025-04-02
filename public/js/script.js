// Elementos do DOM
const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("uploadArea");
const uploadBtn = document.getElementById("uploadBtn");
const submitImageBtn = document.getElementById("submitImageBtn");
const clearBtn = document.getElementById("clearBtn");
const progressBar = document.getElementById("progressBar");
const progress = document.getElementById("progress");
const form = document.getElementById("autoForm");
const provinciaSelect = document.getElementById("provincia");

// Estados do aplicativo
const appState = {
  isProcessing: false,
  lastUploadedFile: null,
  requiredFields: [
    "nome",
    "apelido",
    "dataNascimento",
    "genero",
    "naturalidade",
    "tipoDocumento",
    "numeroDocumento",
    "dataEmissao",
    "dataValidade",
    "telefone",
    "provincia",
    "cidade",
    "endereco",
    "nomeMae",
  ],
};

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  markRequiredFields();
  setupProvinciaDistritoLogic();
});

// Configura todos os event listeners
function setupEventListeners() {
  // Drag and drop
  uploadArea.addEventListener("dragover", handleDragOver);
  uploadArea.addEventListener("dragleave", handleDragLeave);
  uploadArea.addEventListener("drop", handleDrop);

  // Cliques
  uploadArea.addEventListener("click", () => fileInput.click());
  uploadBtn.addEventListener("click", () => fileInput.click());
  submitImageBtn.addEventListener("click", handleImageSubmission);
  clearBtn.addEventListener("click", resetForm);

  // Mudança de arquivo
  fileInput.addEventListener("change", handleFileChange);

  // Envio do formulário
  form.addEventListener("submit", handleFormSubmit);
}

// Manipulador para o novo botão de submissão de imagem
async function handleImageSubmission() {
  if (!fileInput.files.length) {
    showMessage("Por favor, selecione um arquivo primeiro.", "warning");
    return;
  }

  if (appState.isProcessing) return;
  appState.isProcessing = true;

  try {
    showProgressBar();
    updateProgress(30);

    const file = fileInput.files[0];

    // Validar tipo de arquivo
    if (!validateFileType(file)) {
      throw new Error("Tipo de arquivo não suportado. Use JPEG, PNG ou PDF.");
    }

    // Validar tamanho do arquivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("O arquivo é muito grande. Tamanho máximo: 5MB.");
    }

    // Simular upload (substituir por chamada real à API)
    await simulateUpload(file);
    updateProgress(100);

    showMessage("Imagem submetida com sucesso!", "success");
    appState.lastUploadedFile = file;
  } catch (error) {
    console.error("Erro no upload:", error);
    showMessage(error.message, "error");
  } finally {
    appState.isProcessing = false;
    hideProgressBar();
  }
}

// Simula o upload do arquivo
async function simulateUpload(file) {
  console.log("Submetendo imagem:", file.name);
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

// Marca campos obrigatórios
function markRequiredFields() {
  appState.requiredFields.forEach((fieldId) => {
    const label = document.querySelector(`label[for="${fieldId}"]`);
    if (label) {
      label.classList.add("required");
    }
  });
}

// Lógica para distritos baseados na província selecionada
function setupProvinciaDistritoLogic() {
  provinciaSelect.addEventListener("change", function () {
    console.log("Província selecionada:", this.value);
    // Aqui você poderia carregar os distritos correspondentes
  });
}

// Manipuladores de eventos
function handleDragOver(e) {
  e.preventDefault();
  uploadArea.style.borderColor = "#009246";
  uploadArea.style.backgroundColor = "rgba(0, 146, 70, 0.1)";
}

function handleDragLeave() {
  uploadArea.style.borderColor = "#e9ecef";
  uploadArea.style.backgroundColor = "#f8f9fa";
}

function handleDrop(e) {
  e.preventDefault();
  handleDragLeave();

  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    handleFileUpload(fileInput.files[0]);
  }
}

function handleFileChange() {
  if (fileInput.files.length) {
    handleFileUpload(fileInput.files[0]);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  if (appState.isProcessing) return;

  // Validação dos campos obrigatórios
  if (!validateForm()) {
    showMessage("Por favor, preencha todos os campos obrigatórios", "warning");
    return;
  }

  try {
    appState.isProcessing = true;
    updateSubmitButton(true);

    // Simular envio (substituir por chamada real à API)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    showMessage("Registo submetido com sucesso!", "success");
    resetForm();
  } catch (error) {
    console.error("Erro no envio:", error);
    showMessage("Erro ao submeter registo. Tente novamente.", "error");
  } finally {
    appState.isProcessing = false;
    updateSubmitButton(false);
  }
}

// Validação do formulário
function validateForm() {
  let isValid = true;

  appState.requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field && !field.value) {
      field.style.borderColor = "var(--danger)";
      isValid = false;
    }
  });

  return isValid;
}

// Funções de processamento de arquivo
async function handleFileUpload(file) {
  if (!file) return;

  if (appState.isProcessing) return;
  appState.isProcessing = true;

  try {
    // Mostrar progresso
    showProgressBar();
    updateProgress(30);

    // Validar tipo de arquivo
    if (!validateFileType(file)) {
      throw new Error("Tipo de arquivo não suportado. Use JPEG, PNG ou PDF.");
    }

    // Validar tamanho do arquivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("O arquivo é muito grande. Tamanho máximo: 5MB.");
    }

    // Processar OCR (simulado)
    await simulateOCRProcessing(file);
    updateProgress(70);

    const extractedData = simulateOCRResult(file.name);

    // Preencher formulário
    autoFillForm(extractedData);
    updateProgress(100);

    showMessage("Documento processado com sucesso!", "success");
    appState.lastUploadedFile = file;
  } catch (error) {
    console.error("Erro no processamento:", error);
    showMessage(error.message, "error");
  } finally {
    appState.isProcessing = false;
    hideProgressBar();
  }
}

// Funções auxiliares
function validateFileType(file) {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  return validTypes.includes(file.type);
}

function showProgressBar() {
  progressBar.style.display = "block";
  progress.style.width = "0%";
}

function updateProgress(percent) {
  progress.style.width = `${percent}%`;
  progress.textContent = `${percent}%`;
}

function hideProgressBar() {
  setTimeout(() => {
    progressBar.style.display = "none";
    progress.style.width = "0%";
    progress.textContent = "";
  }, 500);
}

function updateSubmitButton(isLoading) {
  const submitBtn = form.querySelector(".btn-primary");
  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Processando...';
  } else {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span class="btn-icon">✅</span> Submeter Registo';
  }
}

function showMessage(message, type) {
  // Remove mensagens anteriores
  const oldMessage = document.querySelector(".message");
  if (oldMessage) oldMessage.remove();

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}-message`;
  messageDiv.textContent = message;

  form.insertBefore(messageDiv, form.firstChild);

  // Remove a mensagem após 5 segundos
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

function autoFillForm(data) {
  // Dados Pessoais
  if (data.nome) document.getElementById("nome").value = data.nome;
  if (data.apelido) document.getElementById("apelido").value = data.apelido;
  if (data.dataNascimento)
    document.getElementById("dataNascimento").value = formatDate(
      data.dataNascimento
    );
  if (data.genero) document.getElementById("genero").value = data.genero;
  if (data.naturalidade)
    document.getElementById("naturalidade").value = data.naturalidade;

  // Documento
  if (data.tipoDocumento)
    document.getElementById("tipoDocumento").value = data.tipoDocumento;
  if (data.numeroDocumento)
    document.getElementById("numeroDocumento").value = data.numeroDocumento;
  if (data.dataEmissao)
    document.getElementById("dataEmissao").value = formatDate(data.dataEmissao);
  if (data.dataValidade)
    document.getElementById("dataValidade").value = formatDate(
      data.dataValidade
    );

  // Contactos
  if (data.telefone) document.getElementById("telefone").value = data.telefone;
  if (data.email) document.getElementById("email").value = data.email;

  // Morada
  if (data.provincia)
    document.getElementById("provincia").value = data.provincia;
  if (data.cidade) document.getElementById("cidade").value = data.cidade;
  if (data.endereco) document.getElementById("endereco").value = data.endereco;

  // Informações Adicionais
  if (data.estadoCivil)
    document.getElementById("estadoCivil").value = data.estadoCivil;
  if (data.profissao)
    document.getElementById("profissao").value = data.profissao;
  if (data.nomePai) document.getElementById("nomePai").value = data.nomePai;
  if (data.nomeMae) document.getElementById("nomeMae").value = data.nomeMae;

  // Animar campos preenchidos
  animateFilledFields();
}

function animateFilledFields() {
  const filledInputs = Array.from(form.elements).filter(
    (el) => el.value && (el.tagName === "INPUT" || el.tagName === "SELECT")
  );

  filledInputs.forEach((input) => {
    input.style.backgroundColor = "rgba(0, 146, 70, 0.1)";
    input.style.borderColor = "#009246";

    setTimeout(() => {
      input.style.backgroundColor = "";
      input.style.borderColor = "";
    }, 2000);
  });
}

function resetForm() {
  if (appState.isProcessing) return;

  if (confirm("Tem certeza que deseja limpar todos os campos?")) {
    form.reset();
    uploadArea.innerHTML = `
            <div class="upload-icon">📄</div>
            <h3>Carregue seu documento de identificação</h3>
            <p>BI/Passaporte/Carta de Condução (imagem ou PDF)</p>
            <input type="file" id="fileInput" class="file-input" accept="image/*,.pdf" />
            <div class="progress-bar" id="progressBar">
              <div class="progress" id="progress"></div>
            </div>
            <button type="button" class="btn btn-upload" id="submitImageBtn" style="margin-top: 15px;">
              <span class="btn-icon">📤</span> Submeter Imagem
            </button>
        `;
    // Reatribuir os event listeners após reset
    fileInput = document.getElementById("fileInput");
    submitImageBtn = document.getElementById("submitImageBtn");
    submitImageBtn.addEventListener("click", handleImageSubmission);
    fileInput.addEventListener("change", handleFileChange);

    appState.lastUploadedFile = null;
    showMessage("Formulário limpo com sucesso", "success");
  }
}

// Funções de simulação (substituir por implementação real)
async function simulateOCRProcessing(file) {
  console.log("Processando documento moçambicano:", file.name);
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

function simulateOCRResult(filename) {
  // Gera dados fictícios baseados no nome do arquivo para contexto moçambicano
  const namePart = filename.split(".")[0] || "joao_sitoe";
  const nameParts = namePart.split("_");
  const nomesComuns = ["João", "Maria", "José", "Ana", "Carlos", "Marta"];
  const apelidosComuns = [
    "Sitoe",
    "Mabunda",
    "Macamo",
    "Nhantumbo",
    "Chissano",
  ];
  const cidades = ["Maputo", "Matola", "Beira", "Nampula", "Quelimane"];
  const provincias = ["Maputo", "Gaza", "Inhambane", "Sofala", "Zambézia"];

  return {
    nome: nameParts[0]
      ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
      : nomesComuns[Math.floor(Math.random() * nomesComuns.length)],
    apelido: nameParts[1]
      ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
      : apelidosComuns[Math.floor(Math.random() * apelidosComuns.length)],
    dataNascimento: randomDate(new Date(1950, 0, 1), new Date(2003, 0, 1)),
    genero: Math.random() > 0.5 ? "M" : "F",
    naturalidade: cidades[Math.floor(Math.random() * cidades.length)],
    tipoDocumento: ["BI", "PASSAPORTE", "DIRE"][Math.floor(Math.random() * 3)],
    numeroDocumento: Math.floor(1000000000 + Math.random() * 9000000000) + "L",
    dataEmissao: randomDate(new Date(2015, 0, 1), new Date()),
    dataValidade: randomDate(new Date(), new Date(2030, 0, 1)),
    telefone:
      "+258 8" +
      Math.floor(10 + Math.random() * 90) +
      " " +
      Math.floor(1000000 + Math.random() * 9000000),
    email: `${namePart.toLowerCase()}@gmail.com`,
    provincia: provincias[Math.floor(Math.random() * provincias.length)],
    cidade: cidades[Math.floor(Math.random() * cidades.length)],
    endereco:
      "Av. " +
      ["25 de Setembro", "Eduardo Mondlane", "Julius Nyerere", "Kim Il Sung"][
        Math.floor(Math.random() * 4)
      ] +
      ", nº " +
      Math.floor(1 + Math.random() * 300),
    estadoCivil: ["SOLTEIRO", "CASADO", "DIVORCIADO", "VIUVO"][
      Math.floor(Math.random() * 4)
    ],
    profissao: [
      "Engenheiro",
      "Médico",
      "Professor",
      "Agricultor",
      "Comerciante",
    ][Math.floor(Math.random() * 5)],
    nomePai:
      "Carlos " +
      apelidosComuns[Math.floor(Math.random() * apelidosComuns.length)],
    nomeMae:
      "Ana " +
      apelidosComuns[Math.floor(Math.random() * apelidosComuns.length)],
  };
}

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
    .toISOString()
    .split("T")[0];
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

// Para demonstração (remover em produção)
window.demoFillForm = function () {
  autoFillForm(simulateOCRResult("demo_bi.pdf"));
};
