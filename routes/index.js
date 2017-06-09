const express = require('express')
const router = express.Router()
const putoController = require('../controllers/putoController')

router.get('/puto', putoController.usage)
router.post('/puto', putoController.translate)

module.exports = router
