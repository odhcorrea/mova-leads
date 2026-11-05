// Um funil por pessoa. O site escolhe qual mostrar pelo subdomínio:
// alex.movaclub.app usa "alex", laura.movaclub.app usa "laura" e assim por diante.
// Qualquer outro endereço (funil.movaclub.app, localhost...) usa "funil".
// Para testar localmente: http://localhost:8000/?funil=laura
//
// Campos:
//   nome           aparece no balão ("Laura")
//   legenda        texto ao lado do nome no balão ("Cofundador do Mova"); "" para não mostrar
//   avatar         caminho da foto em assets/; null mostra as iniciais
//   balao          texto do balão (aceita o <span class="emoji"> do 👋)
//   sucesso        texto da tela de sucesso
//   ajuda          frase antes do botão do Instagram
//   instagram      @ do Instagram, sem o @
//   instagramLink  link aberto ao tocar no botão do Instagram
window.MOVA_FUNIS = {
  funil: {
    nome: "Dhiego",
    legenda: "Cofundador do Mova",
    avatar: "assets/avatar-dhiego.jpg",
    balao: 'E aí! <span class="emoji">👋</span> Meu nome é Dhiego, um dos fundadores do Mova. Deixe seu WhatsApp que eu te mando o link para testar o Mova, junto com um desconto exclusivo.',
    sucesso: "Recebemos seus dados. Em breve eu mesmo vou entrar em contato com você pelo WhatsApp com o link de acesso ao Mova.",
    ajuda: "Dúvidas ou problemas? Fale comigo",
    instagram: "odhcorrea",
    instagramLink: "https://www.instagram.com/odhcorrea/reels/"
  },

  alex: {
    nome: "Alex",
    legenda: "Cofundador do Mova",
    avatar: "assets/avatar-alex.jpg",
    balao: 'E aí! <span class="emoji">👋</span> Meu nome é Alex, um dos fundadores do Mova. Deixe seu WhatsApp que eu te mando o link para testar o Mova, junto com um desconto exclusivo.',
    sucesso: "Recebemos seus dados. Em breve eu mesmo vou entrar em contato com você pelo WhatsApp com o link de acesso ao Mova.",
    ajuda: "Dúvidas ou problemas? Fale comigo",
    instagram: "odevgringo",
    instagramLink: "https://www.instagram.com/odevgringo/"
  },

  laura: {
    nome: "Laura",
    legenda: "Cofundadora do Mova",
    avatar: "assets/avatar-laura.jpg",
    balao: 'E aí! <span class="emoji">👋</span> Meu nome é Laura, uma das fundadoras do Mova. Deixe seu WhatsApp que eu te mando o link para testar o Mova, junto com um desconto exclusivo.',
    sucesso: "Recebemos seus dados. Em breve eu mesma vou entrar em contato com você pelo WhatsApp com o link de acesso ao Mova.",
    ajuda: "Dúvidas ou problemas? Fale comigo",
    instagram: "lauradiasm",
    instagramLink: "https://www.instagram.com/lauradiasm/"
  },

  natalia: {
    nome: "Natália",
    legenda: "Cofundadora do Mova",
    avatar: "assets/avatar-natalia.jpg",
    balao: 'E aí! <span class="emoji">👋</span> Meu nome é Natália, uma das fundadoras do Mova. Deixe seu WhatsApp que eu te mando o link para testar o Mova, junto com um desconto exclusivo.',
    sucesso: "Recebemos seus dados. Em breve eu mesma vou entrar em contato com você pelo WhatsApp com o link de acesso ao Mova.",
    ajuda: "Dúvidas ou problemas? Fale comigo",
    instagram: "nataliamja",
    instagramLink: "https://www.instagram.com/nataliamja/"
  }
};
