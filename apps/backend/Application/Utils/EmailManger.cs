using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Application.Utils
{
    public class EmailManger
    {
        public void SendEmail(string htmlString, string ToMail, string Subject = "Validación de cuenta Treff")
        {
            //try
            //{
            MailMessage message = new MailMessage();
            SmtpClient smtp = new SmtpClient();
            message.From = new MailAddress("maxvazquezg@gmail.com");
            message.To.Add(new MailAddress(ToMail));
            message.Subject = Subject;
            message.IsBodyHtml = true; //to make message body as html
            message.Body = htmlString;
            smtp.Port = 587;
            smtp.Host = "smtp.gmail.com"; //for gmail host
            smtp.EnableSsl = true;
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential("maxvazquezg@gmail.com", "ydswoqfuzkaqjrwh");
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtp.Send(message);
            //}
            //catch (Exception) { }
        }
    }
}
