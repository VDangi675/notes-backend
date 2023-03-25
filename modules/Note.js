const express = require("express")
const {  default: mongoose } = require("mongoose")
const Schema = mongoose.Schema;


const Notesschema = new Schema({
  title:{type:String},
  description:{type:String}
})

const Notes = mongoose.model("Notes",Notesschema)

module.exports = Notes;
