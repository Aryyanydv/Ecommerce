const Contact = require("../models/contact");

exports.submitContact = async (req, res) => {
  try {
    const { name, emailId, phoneNumber, subject, message } = req.body;

    if (!name || !emailId || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required except phone number." });
    }

    const contact = await Contact.create({
      name,
      emailId,
      phoneNumber,
      subject,
      message,
    });

    return res.status(201).json({ success: true, message: "Contact request received.", data: contact });
  } catch (error) {
    console.error("contact submit error", error);
    return res.status(500).json({ success: false, message: "Unable to submit contact request." });
  }
};
