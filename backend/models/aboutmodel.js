import mongoose from 'mongoose';

const aboutschema=new mongoose.Schema({
    tekst_about: {String: true}
});
const About=mongoose.model('About', aboutschema);
export default About