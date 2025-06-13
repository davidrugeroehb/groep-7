import mongoose from 'mongoose';

const aboutschema=new mongoose.Schema({
    tekst_about: {type: String, required: true}
});
const About=mongoose.model('About', aboutschema);
export default About