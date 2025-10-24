document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider");
  if (slider) {
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
      if (index >= totalSlides) {
        currentSlide = 0;
      } else if (index < 0) {
        currentSlide = totalSlides - 1;
      } else {
        currentSlide = index;
      }
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
      prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
    }

    setInterval(() => showSlide(currentSlide + 1), 7000);
  }

  const menuTrigger = document.getElementById("mobile-menu-trigger");
  const nav = document.querySelector("header nav");
  if (menuTrigger && nav) {
    menuTrigger.addEventListener("click", () => {
      nav.classList.toggle("menu-active");
      const icon = menuTrigger.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    });
  }

  const modal = document.getElementById("product-modal");
  if (modal) {
    const detailButtons = document.querySelectorAll(".btn-details");
    const closeModalBtn = document.querySelector(".close-modal");

    const colorMap = {
      preto: "#000000",
      branco: "#FFFFFF",
      vermelho: "#e74c3c",
      amarelo: "#f1c40f",
      verde: "#2ecc71",
      cinza: "#bdc3c7",
      azul: "#2980b9",
      laranja: "#e67e22",
      roxo: "#8e44ad",
      rosa: "#e84393",
    };

    function createInfoSection(title, iconClass, items, listClass) {
      if (!items || items.length === 0) return "";

      const ul = document.createElement("ul");
      ul.className = listClass;

      items.forEach((itemText) => {
        const li = document.createElement("li");
        const parts = itemText.split(":");
        if (parts.length > 1 && listClass === "specs-list") {
          li.innerHTML = `<strong>${parts[0]}:</strong>${parts
            .slice(1)
            .join(":")}`;
        } else {
          li.textContent = itemText;
        }
        ul.appendChild(li);
      });

      return `
        <div class="info-section">
          <h3><i class="fas ${iconClass}"></i> ${title}</h3>
          ${ul.outerHTML}
        </div>
      `;
    }

    function openProductModal(cardElement) {
      const dataset = cardElement.dataset;
      if (!dataset.name || dataset.name === "Em-Breve") return;

      modal.querySelector("#modal-name").textContent = dataset.name;
      modal.querySelector("#modal-img").src = dataset.img;
      modal.querySelector("#modal-price").textContent = dataset.price || "";
      modal.querySelector("#modal-subprice").textContent =
        dataset.subprice || "";
      modal.querySelector(
        "#modal-contact-btn"
      ).href = `https://wa.me/5517981008047?text=Olá, gostaria de mais informações sobre o produto: ${encodeURIComponent(
        dataset.name
      )}`;

      const modalInfoContainer = modal.querySelector(".modal-info");
      modalInfoContainer.innerHTML = "";

      let infoHtml = "";

      infoHtml += createInfoSection(
        "Informações Técnicas",
        "fa-cogs",
        dataset.specs ? dataset.specs.split("|").map((s) => s.trim()) : [],
        "specs-list"
      );

      const dimensionItems = dataset.dimensions
        ? dataset.dimensions.split("|").map((s) => s.trim())
        : [];
      if (dataset.weight) {
        dimensionItems.push(`Peso: ${dataset.weight}`);
      }
      infoHtml += createInfoSection(
        "Dimensões do equipamento",
        "fa-ruler-combined",
        dimensionItems,
        "specs-list"
      );

      infoHtml += createInfoSection(
        "Benefícios do Equipamento",
        "fa-star",
        dataset.benefits
          ? dataset.benefits.split("|").map((s) => s.trim())
          : [],
        "benefits-list"
      );

      if (dataset.comboItems) {
        const comboLinks = dataset.comboItems
          .split(",")
          .map((item) => {
            const itemName = item.trim();
            return `<button class="combo-item-link" data-target-name="${itemName}">- Ficha Técnica ${itemName}</button>`;
          })
          .join("");
        infoHtml += `<div id="modal-combo-links">${comboLinks}</div>`;
      }

      if (dataset.colors) {
        const colorBubbles = dataset.colors
          .split(",")
          .map((c) => {
            const colorName = c.trim().toLowerCase();
            const colorCode = colorMap[colorName];
            if (!colorCode) return "";
            const border =
              colorName === "branco" ? "border: 1px solid #ddd;" : "";
            const title =
              colorName.charAt(0).toUpperCase() + colorName.slice(1);
            return `<div class="color-bubble" style="background-color:${colorCode}; ${border}" title="${title}"></div>`;
          })
          .join("");

        if (colorBubbles) {
          infoHtml += `
            <div class="info-section">
                <h3><i class="fas fa-palette"></i> Cores Disponíveis</h3>
                <div class="color-swatch-container">${colorBubbles}</div>
            </div>
          `;
        }
      }

      modalInfoContainer.innerHTML = infoHtml;

      const modalVideoLink = modal.querySelector("#modal-video-link");
      if (dataset.videoLink) {
        modalVideoLink.href = dataset.videoLink;
        modalVideoLink.style.display = "block";
      } else {
        modalVideoLink.style.display = "none";
      }

      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }

    modal.addEventListener("click", (event) => {
      if (event.target.classList.contains("combo-item-link")) {
        const targetName = event.target.dataset.targetName;
        const targetCard = document.querySelector(
          `.product-card[data-name="${targetName}"]`
        );
        if (targetCard) {
          openProductModal(targetCard);
          modal.scrollTo(0, 0);
        } else {
          alert(`Ficha técnica para "${targetName}" não encontrada.`);
        }
      }
    });

    detailButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        openProductModal(card);
      });
    });

    function closeModal() {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }

    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
  }
});
