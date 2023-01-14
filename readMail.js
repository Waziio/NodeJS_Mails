const logMail = require("./logMail.json");
const imaps = require("imap-simple");
const _ = require("lodash");
const parser = require("mailparser").simpleParser;

const config = {
  imap: {
    user: logMail.mail,
    password: logMail.pwd,
    host: "outlook.office365.com",
    port: 993,
    tls: true,
  },
};

/**
 * @function searchMails()
 * @description Recherche des mails avec un mot-clé
 * @param {String} text Mot-clé (un simple mot, sans espace)
 */
function searchMails(text) {
  // On met le mot clé dans le bon format
//   let textCorrect = text.toLowerCase().replace(" ", "");

  // Connexion à la boite mail
  imaps.connect(config).then((connection) => {
    return connection.openBox("INBOX").then(() => {
      //criteres de recherche
      let fromMail = ""; // Enter the source email address here
      let criteres = [["FROM", fromMail], ["TEXT", text]];

      let options = {
        bodies: [""],
      };

      //recherche de mails en fonctions des critères
      connection.search(criteres, options).then((messages) => {
        if(messages.length === 0) {
            throw Error("ERREUR");
        }
        messages.forEach((msg) => {
          let all = _.find(msg.parts, { which: "" });
          let id = msg.attributes.uid;
          let idHeader = "Imap-Id: " + id + "\r\n";
          parser(idHeader + all.body, (err, mail) => {
            console.log("L'objet du mail trouvé est : " + mail.subject);
            console.log("Le contenu du mail trouvé est : " + mail.text);
          });
        });
      }).catch((err) => {
        console.log(err)
      })
    });
  });
}

/**
 * @function moveMessage()
 * @description Déplacer les mails venant d'un utilisateur vers une autre boîte
 * @param {String} fromMail Adresse mail de l'envoyeur des mails que l'on souhaite déplacer
 * @param {String} fromBox La boîte où se trouvent actuellement les mails que l'on soihaite déplacer
 * @param {String} toBox La boîte de destination
 */
function moveMessages(fromMail, fromBox, toBox) {
  //connexion à la boîte mail
  imaps.connect(config).then((connection) => {
    return connection.openBox(fromBox).then(() => {
      //critères de recherche (les mails provenant de l'email souhaité)
      let criteres = [["FROM", fromMail]];
      let options = { bodies: [""] };

      // Recherche des mails
      connection.search(criteres, options).then((messages) => {
        messages.forEach((msg) => {
          // Pour chaque mail trouvé, le déplacer vers la boîte de destination
          connection.moveMessage(msg.attributes.uid, toBox, () => {
            console.log("Mail déplacé avec succès");
          });
        });
      });
    });
  });
}

searchMails("tu");
// moveMessages("mazdoud-ext@cogelec.fr", "INBOX", "Drafts");
