const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// 会话相关路由
router.get('/', sessionController.list);                          // GET /api/sessions
router.post('/', sessionController.create);                       // POST /api/sessions
router.get('/:id', sessionController.getById);                    // GET /api/sessions/:id
router.put('/:id', sessionController.update);                     // PUT /api/sessions/:id
router.delete('/:id', sessionController.remove);                  // DELETE /api/sessions/:id
router.get('/:id/messages', sessionController.getMessages);       // GET /api/sessions/:id/messages

module.exports = router;
