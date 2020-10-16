const express = require("express");
const router = express.Router();

const roomController = require('../controllers/rooms.controller');

router.post('/add', roomController.addRoom);
router.delete('/delete', roomController.deleteRoom);
router.get('/', roomController.getRooms);
router.post('/', roomController.checkRooms);
router.post('/search', roomController.searchRooms);

module.exports = router;

