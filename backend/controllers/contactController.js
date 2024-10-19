const Contact = require('../models/Contact');
const vCardParser = require('vcard-parser');

// Get all contacts for a user
// GET /api/contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new contact
// POST /api/contacts
const createContact = async (req, res) => {
  const { name, email, phone, tags } = req.body;

  try {
    const contact = new Contact({
      user: req.user._id,
      name,
      email,
      phone,
      tags,
    });

    const createdContact = await contact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single contact
// GET /api/contacts/:id
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact && contact.user.toString() === req.user._id.toString()) {
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a contact
// PUT /api/contacts/:id
const updateContact = async (req, res) => {
  const { name, email, phone, tags } = req.body;

  try {
    const contact = await Contact.findById(req.params.id);

    if (contact && contact.user.toString() === req.user._id.toString()) {
      contact.name = name || contact.name;
      contact.email = email || contact.email;
      contact.phone = phone || contact.phone;
      contact.tags = tags || contact.tags;

      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a contact
// DELETE /api/contacts/:id
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact && contact.user.toString() === req.user._id.toString()) {
      await contact.remove();
      res.json({ message: 'Contact removed' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Import contacts from VCF
// POST /api/contacts/import
const importContacts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const vcfData = req.file.buffer.toString();
    const parsed = vCardParser.parse(vcfData);

    const contacts = parsed.map((vcard) => {
      const name = vcard.fn ? vcard.fn.value : 'No Name';
      const email = vcard.email ? vcard.email.value : '';
      const phone = vcard.tel ? vcard.tel.value : '';
      return {
        user: req.user._id,
        name,
        email,
        phone,
        tags: [],
      };
    });

    await Contact.insertMany(contacts);
    res.status(201).json({ message: 'Contacts imported successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export contacts to VCF
// GET /api/contacts/export
const exportContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id });
    let vcfData = '';

    contacts.forEach((contact) => {
      vcfData += 'BEGIN:VCARD\n';
      vcfData += 'VERSION:3.0\n';
      vcfData += `FN:${contact.name}\n`;
      if (contact.email) vcfData += `EMAIL:${contact.email}\n`;
      if (contact.phone) vcfData += `TEL:${contact.phone}\n`;
      vcfData += 'END:VCARD\n';
    });

    res.setHeader('Content-Disposition', 'attachment; filename=contacts.vcf');
    res.setHeader('Content-Type', 'text/vcard');
    res.send(vcfData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Find duplicate contacts
// GET /api/contacts/duplicates
const findDuplicates = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id });
    const duplicates = [];

    const seen = {};

    contacts.forEach((contact) => {
      const key = `${contact.name.toLowerCase()}_${contact.email.toLowerCase()}_${contact.phone}`;
      if (seen[key]) {
        duplicates.push([seen[key], contact]);
      } else {
        seen[key] = contact;
      }
    });

    res.json(duplicates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Merge duplicate contacts
// POST /api/contacts/merge
const mergeContacts = async (req, res) => {
  const { primaryId, duplicateId } = req.body;

  try {
    const primary = await Contact.findById(primaryId);
    const duplicate = await Contact.findById(duplicateId);

    if (
      primary &&
      duplicate &&
      primary.user.toString() === req.user._id.toString() &&
      duplicate.user.toString() === req.user._id.toString()
    ) {
      // Merge fields
      primary.email = primary.email || duplicate.email;
      primary.phone = primary.phone || duplicate.phone;
      primary.tags = Array.from(new Set([...primary.tags, ...duplicate.tags]));

      await primary.save();
      await duplicate.remove();

      res.json({ message: 'Contacts merged successfully', contact: primary });
    } else {
      res.status(404).json({ message: 'Contacts not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Search Contacts by name, email, or tags
const searchContacts = async (req, res) => {
    try {
        const { query } = req; 
        const { name, email, tags } = query;

        let searchCriteria = { userId: req.user._id }; 

        if (name) {
            searchCriteria.name = { $regex: name, $options: 'i' };
        }

        if (email) {
            searchCriteria.email = { $regex: email, $options: 'i' }; 
        }

        if (tags) {
            const tagArray = tags.split(','); 
            searchCriteria.tags = { $in: tagArray }; 
        }

        const contacts = await Contact.find(searchCriteria); 
        res.json(contacts); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
  importContacts,
  exportContacts,
  findDuplicates,
  mergeContacts,
  searchContacts,
};
