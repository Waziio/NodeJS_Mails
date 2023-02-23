const nodemailer = require('nodemailer');
const logMail = require("./logMail.json");


// Connexion à l'email
const mail = nodemailer.createTransport({
    service: "outlook",
    auth: {
        user: logMail.mail,
        pass: logMail.pwd
    }
});

// Envoi d'un mail
mail.sendMail({
    from: logMail.mail,
    to: "mohamed.azd49@gmail.com",
    subject: "Test de NodeMailer",
    text: "Ca marche ?"
}, (err, info) => {
    console.log(info.envelope);
    console.log(info.messageId)
    console.log(err);
})



