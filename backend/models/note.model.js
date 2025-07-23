const mongoose = require('mongoose');

const schema = mongoose.Schema;
const noteSchema = new schema({
title: { type: String, required: true },
content: { type: String, required: true },
tags: { tyype: [String], default: []},
userId: { type: String, required: true },
createdOn: {type: Date, default: new Date().getTime()}
});

module.exports =mongoose.model('Note', noteSchema);


