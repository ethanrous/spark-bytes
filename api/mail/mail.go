package mail

import (
	"fmt"

	"github.com/ethanrous/spark-bytes/database"
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

func SendEventCreationEmail(event models.Event, db database.Database) error {
	users, err := db.GetAllUsers()
	if err != nil {
		return err
	}

	for _, user := range users {
		// if user.ID == event.OwnerId {
		// 	continue
		// }
		err = SendMail("New Event Near You", fmt.Sprintf("Hi %s, A new event, '%s' has been created. It starts at %s and goes until %s:\n%s", user.FirstName, event.Name, event.StartTime.Format("January 2, 2006 at 15:04"), event.EndTime.Format("January 2, 2006 at 15:04"), event.Description), user.Email)
		if err != nil {
			return err
		}
	}

	return nil
}

func SendEventCancelledEmail(event models.Event, db database.Database) error {
	users, err := db.GetReservationsByEventId(event.ID)
	if err != nil {
		return err
	}

	for _, user := range users {
		err = SendMail("An event you registered for has been cancelled", fmt.Sprintf("Hi %s, An event you had registed for, %s, has been cancelled", user.FirstName, event.Name), user.Email)
		if err != nil {
			return err
		}
	}

	return nil
}

func SendEventStartingSoonToUser(event models.Event, user models.User) error {
	err := SendMail("An event you registered for is starting soon", fmt.Sprintf("Hi %s, An event you had registed for, %s, is starting soon! View it on the app: http://localhost:5001/view-events", user.FirstName, event.Name), user.Email)
	if err != nil {
		return err
	}

	return nil
}

func SendEventStartingSoonEmail(event models.Event, db database.Database) error {
	users, err := db.GetReservationsByEventId(event.ID)
	if err != nil {
		return err
	}

	for _, user := range users {
		err = SendEventStartingSoonToUser(event, user)
		if err != nil {
			return err
		}
	}

	return nil
}
