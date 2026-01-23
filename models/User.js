const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name : {type:String,require:true},
    email : {type:String,require:true,unique:true},
    password : {type:String,require:true}
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model('User',userSchema);
module.exports = User;