const Joi = require('joi');

const createNoteSchema = Joi.object({
  title: Joi.string().max(255).required(),
  content: Joi.string().allow('', null).optional(),
  tags: Joi.string().allow('', null).optional(),
  notebook_id: Joi.number().integer().allow(null).optional(),
  is_pinned: Joi.boolean().optional(),
  is_archived: Joi.boolean().optional(),
});

const updateNoteSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  content: Joi.string().allow('', null).optional(),
  tags: Joi.string().allow('', null).optional(),
  notebook_id: Joi.number().integer().allow(null).optional(),
  is_pinned: Joi.boolean().optional(),
  is_archived: Joi.boolean().optional(),
}).min(1); // At least one field must be provided to update

module.exports = {
  createNoteSchema,
  updateNoteSchema,
};
