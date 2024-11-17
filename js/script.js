const tableBody = document.getElementById("dog-table-body");
const addDogButton = document.getElementById("add-dog");
const editModal = document.getElementById("edit-modal");
const closeModal = document.getElementById("close-modal");
const saveChangesButton = document.getElementById("save-changes");

let currentRow = null;

fetch("https://run.mocky.io/v3/452452f5-906c-4567-89b3-f49052d7b199")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((dog) => {
      addDogRow(dog.imagem, dog.cachorro, dog.dono, dog.telefone, dog.email);
    });
  })
  .catch((error) => console.error("Erro ao carregar dados da API:", error));

function addDogRow(imagem, cachorro, dono, telefone, email) {
  const row = document.createElement("tr");
  row.innerHTML = `
          <td><img src="${imagem}" alt="Imagem do cachorro" class="dog-image" onerror="this.onerror=null; this.src='/img/default-image.jpg';"></td>
          <td>${cachorro}</td>
          <td>${dono}</td>
          <td>${telefone}</td>
          <td class="email-cell">${email}</td>
          <td>
              <button class="edit-button">Editar</button>
              <button class="delete-button">Excluir</button>
          </td>
      `;
  tableBody.appendChild(row);
}

addDogButton.addEventListener("click", () => {
  currentRow = null;
  document.getElementById("edit-nome").value = "";
  document.getElementById("edit-raca").value = "";
  document.getElementById("edit-dono").value = "";
  document.getElementById("edit-telefone").value = "";
  document.getElementById("edit-email").value = "";

  removeErrorMessages();

  document.getElementById("modal-title").textContent =
    "Adicionar Novo Cachorro";
  editModal.style.display = "block";
});

function removeErrorMessages() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((msg) => msg.remove());
}

saveChangesButton.onclick = () => {
  const nome = document.getElementById("edit-nome").value.trim();
  const raca = document.getElementById("edit-raca").value.trim().toLowerCase();
  const formattedRaca = raca.replace(/\s+/g, "-");
  const dono = document.getElementById("edit-dono").value;
  const telefone = document.getElementById("edit-telefone").value.trim();
  const email = document.getElementById("edit-email").value.trim();

  removeErrorMessages();

  let hasErrors = false;

  if (!email.includes("@")) {
    const emailInput = document.getElementById("edit-email");
    const errorMessage = document.createElement("div");
    errorMessage.textContent =
      "Por favor, insira um email válido que contenha '@'.";
    errorMessage.style.color = "red";
    errorMessage.classList.add("error-message");
    emailInput.parentNode.insertBefore(errorMessage, emailInput.nextSibling);
    hasErrors = true;
  }

  const phonePattern = /^[0-9\s()-]+$/;
  if (
    !phonePattern.test(telefone) ||
    telefone.replace(/\D/g, "").length !== 11
  ) {
    const phoneInput = document.getElementById("edit-telefone");
    const errorMessage = document.createElement("div");
    errorMessage.textContent =
      "Por favor, insira um telefone válido com 11 dígitos (somente números)";
    errorMessage.style.color = "red";
    errorMessage.classList.add("error-message");
    phoneInput.parentNode.insertBefore(errorMessage, phoneInput.nextSibling);
    hasErrors = true;
  }

  if (hasErrors) return;

  const getDogImage = async () => {
    try {
      const response = await fetch(
        `https://api.thedogapi.com/v1/breeds/search?q=${formattedRaca}`,
        {
          headers: {
            "x-api-key":
              "live_QYFCwk3Ucxzhq1cru5rNw5NYwqp2rU9WHTsuI1G8zZEiJQahWkHj1kuw6aXuH0ex",
          },
        }
      );
      const data = await response.json();
      return data.length > 0
        ? `https://cdn2.thedogapi.com/images/${data[0].reference_image_id}.jpg`
        : "/img/default-image.jpg";
    } catch (error) {
      console.error("Erro ao buscar imagem do cachorro:", error);
      return "/img/default-image.jpg";
    }
  };

  getDogImage().then((imagem) => {
    if (currentRow) {
      currentRow.cells[0].innerHTML = `<img src="${imagem}" alt="Imagem do cachorro" class="dog-image" onerror="this.onerror=null; this.src='/img/default-image.jpg';">`;
      currentRow.cells[1].textContent = nome;
      currentRow.cells[2].textContent = dono;
      currentRow.cells[3].textContent = telefone;
      currentRow.cells[4].textContent = email;
    } else {
      addDogRow(imagem, nome, dono, telefone, email);
    }

    editModal.style.display = "none";
  });
};

tableBody.addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-button")) {
    currentRow = event.target.parentNode.parentNode;

    document.getElementById("edit-nome").value =
      currentRow.cells[1].textContent;
    document.getElementById("edit-raca").value = "";
    document.getElementById("edit-dono").value =
      currentRow.cells[2].textContent;
    document.getElementById("edit-telefone").value =
      currentRow.cells[3].textContent;
    document.getElementById("edit-email").value =
      currentRow.cells[4].textContent;

    removeErrorMessages();

    document.getElementById("modal-title").textContent =
      "Editar Informações do Cachorro";
    editModal.style.display = "block";
  } else if (event.target.classList.contains("delete-button")) {
    const row = event.target.parentNode.parentNode;
    row.remove();
  }
});

closeModal.addEventListener("click", () => {
  editModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == editModal) {
    editModal.style.display = "none";
  }
});
