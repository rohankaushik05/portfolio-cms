const Contact = require("../models/contact");
const sendContactEmail = require("../services/emailService");

// Create contact message
const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    // Send email notification after successful MongoDB save
    await sendContactEmail({
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Get all contact messages
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

// Get single contact message
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      contact,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch message",
      error: error.message,
    });
  }
};

// Mark message as read/unread
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contact) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      message: "Message updated successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update message",
      error: error.message,
    });
  }
};

// Delete contact message
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete message",
      error: error.message,
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
};