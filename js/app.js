(function () {
  "use strict";

  var lead = { nome: "", whatsapp: "" };
  var current = "hero";

  var screens = document.querySelectorAll("[data-screen]");
  var formNome = document.getElementById("form-nome");
  var formWhatsapp = document.getElementById("form-whatsapp");
  var inputNome = document.getElementById("nome");
  var inputWhatsapp = document.getElementById("whatsapp");

  // Qual funil é este: pelo subdomínio (laura.movaclub.app → "laura") ou por ?funil=laura.
  // Qualquer outro endereço cai no funil padrão ("funil").
  var funis = window.MOVA_FUNIS || {};
  var funilKey = (function () {
    var key = new URLSearchParams(location.search).get("funil") || location.hostname.split(".")[0];
    return funis[key] ? key : "funil";
  })();

  applyFunil(funis[funilKey]);

  // Troca avatar, nome, textos e Instagram pelos do funil (o HTML já vem com o do Dhiego)
  function applyFunil(f) {
    if (!f) return;

    var avatar = document.querySelector("[data-founder-avatar]");
    if (f.avatar) {
      avatar.innerHTML = "";
      var img = document.createElement("img");
      img.src = f.avatar;
      img.alt = "Foto de " + f.nome;
      img.width = 256;
      img.height = 256;
      avatar.appendChild(img);
    } else {
      // Sem foto ainda: iniciais no lugar
      avatar.innerHTML = '<span class="founder__initials"></span>';
      avatar.firstChild.textContent = f.nome.charAt(0);
    }

    var name = document.querySelector("[data-founder-name]");
    name.textContent = f.nome + " ";
    if (f.legenda) {
      var legenda = document.createElement("span");
      legenda.textContent = "· " + f.legenda;
      name.appendChild(legenda);
    }

    // innerHTML só para o texto do balão, que vem do nosso js/funis.js (permite o span do emoji)
    document.querySelector("[data-founder-text]").innerHTML = f.balao;
    document.querySelector("[data-sucesso]").textContent = f.sucesso;

    document.querySelectorAll("[data-ajuda]").forEach(function (el) {
      el.textContent = f.ajuda;
    });
    document.querySelectorAll("[data-ig-handle]").forEach(function (el) {
      el.textContent = "@" + f.instagram;
    });
    document.querySelectorAll(".help__ig").forEach(function (el) {
      el.href = f.instagramLink;
    });
  }

  // Navegação entre telas. Cada tela vira uma entrada no histórico,
  // assim o botão "voltar" do celular volta um passo em vez de sair da página.
  function show(name, push) {
    screens.forEach(function (s) {
      s.hidden = s.dataset.screen !== name;
    });
    current = name;
    if (push) history.pushState({ screen: name }, "");
    window.scrollTo(0, 0);

    // Sem foco automático nos campos (abriria o teclado sozinho no celular);
    // só a tela de sucesso recebe foco no título, para leitores de tela anunciarem
    var screen = document.querySelector('[data-screen="' + name + '"]');
    var target = screen.querySelector('.step__title[tabindex="-1"]');
    if (target) target.focus({ preventScroll: true });
  }

  history.replaceState({ screen: "hero" }, "");

  window.addEventListener("popstate", function (e) {
    // Depois do envio não deixamos voltar para o formulário
    if (current === "sucesso") {
      history.pushState({ screen: "sucesso" }, "");
      return;
    }
    show((e.state && e.state.screen) || "hero", false);
  });

  document.addEventListener("click", function (e) {
    var action = e.target.closest("[data-action]");
    if (!action) return;
    if (action.dataset.action === "start") show("nome", true);
    if (action.dataset.action === "back") history.back();
  });

  // Carrossel de mockups da landing page: marca a bolinha do celular que está no centro
  var phones = document.getElementById("lp-phones");
  var dots = document.querySelectorAll(".lp__dots span");

  phones.addEventListener("scroll", function () {
    var center = phones.scrollLeft + phones.clientWidth / 2;
    var closest = 0;
    Array.prototype.forEach.call(phones.children, function (phone, i) {
      var phoneCenter = phone.offsetLeft + phone.offsetWidth / 2;
      var best = phones.children[closest];
      if (Math.abs(phoneCenter - center) < Math.abs(best.offsetLeft + best.offsetWidth / 2 - center)) closest = i;
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === closest);
    });
  }, { passive: true });

  // Enquanto a pessoa digita (teclado aberto no celular), o botão sai do rodapé fixo
  // e fica logo abaixo do campo, para não subir com o teclado e cobrir o input.
  // A volta ao rodapé espera um pouco: se a pessoa tocou no botão, o toque termina
  // antes de ele mudar de lugar.
  var typingTimer;

  document.addEventListener("focusin", function (e) {
    if (!e.target.matches(".step .field")) return;
    clearTimeout(typingTimer);
    e.target.closest(".step").classList.add("is-typing");
  });

  document.addEventListener("focusout", function (e) {
    if (!e.target.matches(".step .field")) return;
    var step = e.target.closest(".step");
    typingTimer = setTimeout(function () {
      step.classList.remove("is-typing");
    }, 300);
  });

  function setError(input, message) {
    var el = document.getElementById(input.id + "-erro");
    el.textContent = message || "";
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function firstName(nome) {
    return nome.split(" ")[0];
  }

  // Passo 1: nome
  formNome.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = inputNome.value.trim().replace(/\s+/g, " ");

    if (nome.length < 2 || !/\p{L}/u.test(nome)) {
      setError(inputNome, "Digite seu nome para continuar.");
      inputNome.focus();
      return;
    }

    setError(inputNome);
    lead.nome = nome;
    document.querySelectorAll("[data-first-name]").forEach(function (el) {
      el.textContent = ", " + firstName(nome);
    });
    show("whatsapp", true);
  });

  inputNome.addEventListener("input", function () {
    setError(inputNome);
  });

  // Passo 2: WhatsApp de qualquer país (intl-tel-input).
  // Começa no Brasil; a máscara e a validação seguem o país escolhido na bandeira.
  // No celular a lista de países abre como bottom sheet; no desktop, como lista suspensa.
  var mobile = window.matchMedia("(max-width: 899px)");
  var iti = createPhoneInput();

  function createPhoneInput(previous) {
    var instance = window.intlTelInput(inputWhatsapp, {
      initialCountry: previous ? previous.country : "br",
      countryOrder: ["br", "pt", "us", "es"],
      countryNameLocale: "pt-BR",
      countrySelectorMode: mobile.matches ? "FULLSCREEN" : "DROPDOWN",
      uiTranslations: {
        selectedCountryAriaLabel: "Alterar país, selecionado ${countryName} (${dialCode})",
        noCountrySelected: "Selecionar país",
        countryListAriaLabel: "Lista de países",
        searchPlaceholder: "Buscar país",
        clearSearchAriaLabel: "Limpar busca",
        closeCountrySelectorAriaLabel: "Fechar",
        searchEmptyState: "Nenhum país encontrado"
      },
      loadUtils: function () {
        return import("https://cdn.jsdelivr.net/npm/intl-tel-input@29.5.5/dist/js/utils.js");
      }
    });
    if (previous && previous.number) instance.setNumber(previous.number);
    return instance;
  }

  // Se a tela cruzar o limite celular/desktop (ex.: girar o tablet), recria o campo no modo certo
  mobile.addEventListener("change", function () {
    var previous = {
      country: (iti.getSelectedCountry() || {}).iso2 || "br",
      number: inputWhatsapp.value
    };
    iti.destroy();
    iti = createPhoneInput(previous);
  });

  inputWhatsapp.addEventListener("input", function () {
    setError(inputWhatsapp);
  });

  inputWhatsapp.addEventListener("countrychange", function () {
    setError(inputWhatsapp);
  });

  // No celular, abrir o bottom sheet de países não deve abrir o teclado: a biblioteca
  // põe o foco na busca ao abrir, então tiramos de lá e deixamos no próprio sheet.
  // O teclado só abre se a pessoa tocar na busca.
  inputWhatsapp.addEventListener("open:countryselector", function () {
    if (!mobile.matches) return;
    var sheet = document.querySelector(".iti--fullscreen-popup .iti__country-selector");
    var search = sheet && sheet.querySelector(".iti__search-input");
    if (!search || document.activeElement !== search) return;
    search.blur();
    sheet.setAttribute("tabindex", "-1");
    sheet.focus({ preventScroll: true });
  });

  var phoneErrors = {
    TOO_SHORT: "Parece que faltam números. Confira o seu WhatsApp.",
    TOO_LONG: "Esse número tem dígitos a mais. Confira o seu WhatsApp.",
    INVALID_COUNTRY_CODE: "Escolha o país do seu número na bandeira ao lado."
  };

  formWhatsapp.addEventListener("submit", function (e) {
    e.preventDefault();

    // Os dados de validação carregam em segundo plano; espera se ainda não chegaram.
    iti.promise.then(function () {
      // Validação precisa: além do tamanho, confere se o número existe naquele país
      if (!inputWhatsapp.value.trim() || !iti.isValidNumberPrecise()) {
        var error = inputWhatsapp.value.trim() ? phoneErrors[iti.getValidationError()] : null;
        setError(inputWhatsapp, error || "Digite um número de WhatsApp válido.");
        inputWhatsapp.focus();
        return;
      }

      setError(inputWhatsapp);
      lead.whatsapp = iti.getNumber();
      submitLead({
        nome: lead.nome,
        whatsapp: lead.whatsapp,
        whatsappFormatado: iti.getNumber("INTERNATIONAL"),
        funil: funilKey,
        empresa: formWhatsapp.empresa.value
      });
    });
  });

  function submitLead(data) {
    var button = formWhatsapp.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = "Enviando…";

    sendLead(data)
      .then(function () {
        show("sucesso", true);
        celebrate();
      })
      .catch(function (err) {
        console.error("[Mova Leads] Falha ao enviar:", err);
        setError(inputWhatsapp, "Não conseguimos enviar agora. Verifique sua conexão e tente de novo.");
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = "Enviar";
      });
  }

  // Confete na tela de sucesso: uma explosão no centro e dois jatos laterais, nas cores do Mova.
  // Quem prefere menos movimento (configuração do sistema) não vê o efeito.
  function celebrate() {
    if (!window.confetti) return;

    var base = {
      colors: ["#a0fe1b", "#ffffff", "#6fbf0f", "#d9ff9e"],
      disableForReducedMotion: true,
      zIndex: 100
    };

    window.confetti(Object.assign({}, base, {
      particleCount: 110,
      spread: 90,
      startVelocity: 45,
      origin: { y: 0.45 }
    }));

    setTimeout(function () {
      window.confetti(Object.assign({}, base, { particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } }));
      window.confetti(Object.assign({}, base, { particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } }));
    }, 250);
  }

  // Envio para o Google Sheets (via Apps Script).
  // Corpo em texto puro evita o preflight de CORS, que o Apps Script não suporta.
  function sendLead(data) {
    var endpoint = window.MOVA_CONFIG && window.MOVA_CONFIG.endpoint;

    if (!endpoint) {
      console.info("[Mova Leads] Endpoint não configurado em js/config.js. Lead (não enviado):", data);
      return Promise.resolve();
    }

    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (body) {
        if (!body.ok) throw new Error(body.error || "Resposta inválida");
      });
  }
})();
