/**
 * Recebe os leads do funil e grava na planilha.
 * Cole este arquivo em Extensões > Apps Script da planilha (passo a passo no README).
 */

var SHEET_NAME = "Leads";
var HEADERS = ["Data", "Nome", "WhatsApp", "Abrir conversa", "Funil"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var data = JSON.parse(e.postData.contents);

    // Honeypot preenchido = bot. Responde ok para não dar pista.
    if (data.empresa) return json({ ok: true });

    var nome = String(data.nome || "").trim().slice(0, 80);
    // Número no formato internacional E.164, ex.: +5511987654321 ou +351912345678
    var whatsapp = String(data.whatsapp || "").trim();
    var digits = whatsapp.replace(/\D/g, "");

    if (nome.length < 2 || !/^\+[1-9]\d{7,14}$/.test(whatsapp)) {
      return json({ ok: false, error: "dados_invalidos" });
    }

    // Versão legível vinda do site (ex.: +55 11 98765-4321); só é usada se bater com o número
    var formatado = String(data.whatsappFormatado || "").trim();
    if (formatado.replace(/\D/g, "") !== digits) formatado = whatsapp;

    // De qual funil veio (funil, alex, laura, natalia...). Versões antigas do site não mandam: "funil".
    var funil = String(data.funil || "funil");
    if (!/^[a-z0-9-]{1,30}$/.test(funil)) funil = "funil";

    getSheet().appendRow([
      new Date(),
      safe(nome),
      safe(formatado),
      "https://wa.me/" + digits,
      funil
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Permite testar a URL publicada direto no navegador
function doGet() {
  return json({ ok: true, status: "Mova Leads no ar" });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }

  // Planilhas criadas antes da coluna "Funil" ganham o cabeçalho que falta
  var header = sheet.getRange(1, 1, 1, HEADERS.length);
  if (header.getValues()[0].join("|") !== HEADERS.join("|")) {
    header.setValues([HEADERS]).setFontWeight("bold");
  }

  return sheet;
}

// Evita que um texto começando com =, +, - ou @ vire fórmula na planilha
function safe(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
