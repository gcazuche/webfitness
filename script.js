document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider");
  if (slider) {
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
      if (index >= totalSlides) currentSlide = 0;
      else if (index < 0) currentSlide = totalSlides - 1;
      else currentSlide = index;
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
    prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
    setInterval(() => showSlide(currentSlide + 1), 7000);
  }

  const menuTrigger = document.getElementById("mobile-menu-trigger");
  const nav = document.querySelector("header nav");
  if (menuTrigger && nav) {
    menuTrigger.addEventListener("click", () => {
      nav.classList.toggle("menu-active");
      const icon = menuTrigger.querySelector("i");
      if (nav.classList.contains("menu-active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  }

  const modal = document.getElementById("product-modal");
  if (modal) {
    const detailButtons = document.querySelectorAll(".btn-details");
    const closeModalBtn = document.querySelector(".close-modal");
    const modalImg = document.getElementById("modal-img");
    const modalName = document.getElementById("modal-name");
    const modalPrice = document.getElementById("modal-price");
    const modalSubprice = document.getElementById("modal-subprice");
    const modalSpecsContainer = document.getElementById("modal-specs");
    const modalColorsContainer = document.getElementById("modal-colors");
    const modalContactBtn = document.getElementById("modal-contact-btn");
    const modalComboLinksContainer =
      document.getElementById("modal-combo-links");
    const modalVideoLink = document.getElementById("modal-video-link");

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

    function openProductModal(cardElement) {
      const name = cardElement.dataset.name,
        img = cardElement.dataset.img,
        specs = cardElement.dataset.specs,
        colors = cardElement.dataset.colors,
        price = cardElement.dataset.price,
        subprice = cardElement.dataset.subprice,
        comboItems = cardElement.dataset.comboItems,
        videoLink = cardElement.dataset.videoLink;

      if (!name || name === "Em-Breve") return;

      modalName.textContent = name;
      modalImg.src = img;
      modalImg.alt = name;
      modalContactBtn.href = `https://wa.me/5517981008047?text=Olá%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20produto:%20${encodeURIComponent(
        name
      )}`;

      modalPrice.textContent = price || "";
      modalPrice.style.display = price ? "block" : "none";
      modalSubprice.textContent = subprice || "";
      modalSubprice.style.display = subprice ? "block" : "none";

      // ATUALIZAÇÃO: Popula specs como uma lista <ul>
      modalSpecsContainer.innerHTML = "";
      if (specs) {
        const ul = document.createElement("ul");
        ul.className = "specs-list";
        specs
          .split("|")
          .map((s) => s.trim())
          .forEach((specText) => {
            const li = document.createElement("li");
            const parts = specText.split(":");
            if (parts.length > 1) {
              li.innerHTML = `<strong>${parts[0]}:</strong>${parts
                .slice(1)
                .join(":")}`;
            } else {
              li.textContent = specText;
            }
            ul.appendChild(li);
          });
        modalSpecsContainer.appendChild(ul);
      }

      // ATUALIZAÇÃO: Lógica para mostrar ou esconder o botão de vídeo
      if (videoLink) {
        modalVideoLink.href = videoLink;
        modalVideoLink.style.display = "block";
      } else {
        modalVideoLink.style.display = "none";
      }

      modalColorsContainer.innerHTML = "";
      if (colors) {
        colors
          .split(",")
          .map((c) => c.trim().toLowerCase())
          .forEach((colorName) => {
            const colorCode = colorMap[colorName];
            if (colorCode) {
              const bubble = document.createElement("div");
              bubble.className = "color-bubble";
              bubble.style.backgroundColor = colorCode;
              bubble.title =
                colorName.charAt(0).toUpperCase() + colorName.slice(1);
              if (colorName === "branco")
                bubble.style.border = "1px solid #ddd";
              modalColorsContainer.appendChild(bubble);
            }
          });
      }

      modalComboLinksContainer.innerHTML = "";
      modalComboLinksContainer.style.display = "none";
      if (comboItems) {
        modalComboLinksContainer.style.display = "block";
        comboItems
          .split(",")
          .map((item) => item.trim())
          .forEach((itemName) => {
            const link = document.createElement("button");
            link.className = "combo-item-link";
            link.textContent = `Clique Aqui - Ficha Técnica ${itemName}`;
            link.addEventListener("click", () => {
              const targetCard = document.querySelector(
                `.product-card[data-name="${itemName}"]`
              );
              if (targetCard) {
                openProductModal(targetCard);
                modal.scrollTo(0, 0);
              } else {
                alert(`Ficha técnica para "${itemName}" não encontrada.`);
              }
            });
            modalComboLinksContainer.appendChild(link);
          });
      }

      modal.style.display = "flex";
    }

    detailButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        openProductModal(card);
      });
    });

    function closeModal() {
      modal.style.display = "none";
    }
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }
});
