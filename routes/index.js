const express = require('express')
const router = express.Router()
const putoController = require('../controllers/putoController')
const genericController = require('../controllers/genericController')

router.get('/translators', genericController.getTranslators)

router.get('/puto', putoController.usage)
router.post('/puto', putoController.translate)

router.get('/:adjective', genericController.usage)
router.post('/:adjective', genericController.translate)

module.exports = router
