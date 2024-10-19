const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const multer = require('multer');

const upload = multer();

router.route('/')
  .get(protect, getContacts)
  .post(protect, createContact);

router.route('/import')
  .post(protect, upload.single('file'), importContacts);

router.route('/export')
  .get(protect, exportContacts);

router.route('/duplicates')
  .get(protect, findDuplicates);

router.route('/merge')
  .post(protect, mergeContacts);

router.route('/:id')
  .get(protect, getContactById)
  .put(protect, updateContact)
  .delete(protect, deleteContact);


// Search Contacts by name, email, or tags
router.get('/search', searchContacts);

module.exports = router;
