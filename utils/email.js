const nodemailer = require("nodemailer");
const MAIL_USER = process.env.EMAIL_USER;
const MAIL_PASS = process.env.EMAIL_PASS;
const MAIL_HOST = process.env.MAIL_HOST;
const ENVIRONMENT = process.env.NODE_ENV;

class Email {
	constructor(user, url) {
		this.user = user;
		this.url = url;
		this.to = user.email;
		this.firstName = user.name;
		this.from = `URL SHORTENER <${process.env.DOMAIN_MAIL}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === "production") {
			// Implement sendgrid API
			return;
		}
		return nodemailer.createTransport({
			host: MAIL_HOST,
			port: 465,
			auth: {
				user: MAIL_USER,
				pass: MAIL_PASS,
			},
		});
	}

	async send(template, subject) {
		let html = "";
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.fromString(html),
		};
		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send("welcome", "Welcome to URL SHORTENER");
	}

	async sendResetToken() {
		await this.send("passwordReset", "Forgot your password");
	}
}

exports = module.exports = Email;
exports.Email = Email;
