package mail

import (
	"fmt"

	"github.com/ethanrous/spark-bytes/models"
	"github.com/wneessen/go-mail"
)

func SendMail(subject, body, recipient string) error {
	message := mail.NewMsg()
	err := message.From("sparkbytes6@gmail.com")
	if err != nil {
		return err
	}
	err = message.To(recipient)
	if err != nil {
		return err
	}

	message.Subject(subject)
	message.SetBodyString(mail.TypeTextPlain, body)

	client, err := mail.NewClient("smtp.gmail.com", mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername("sparkbytes6@gmail.com"), mail.WithPassword("aqfd zyho kmch qzmn"))
	if err != nil {
		return err
	}

	err = client.DialAndSend(message)
	if err != nil {
		return err
	}

	return nil
}

func SendVerificationEmail(user models.User) error {
	body := fmt.Sprintf("Hi %s, Click here to verify your email: http://localhost:5001/verify?userId=%d", user.FirstName, user.ID)
	err := SendMail("Verify your email", body, user.Email)
	if err != nil {
		return err
	}

	return nil
}
