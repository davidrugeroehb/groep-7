import About from '../models/aboutmodel';

export const getabout = async (req,res)=>{
    try{
        const about= await About.findOne();
        res.status(200).json(about);
    }catch (error){
        res.status(500).json({message:'fout bij het ophalen'})
    }
};

export const updateabout = async (req,res)=>{
    try{
        const{tekst}=req.body;
        let about=await About.fintOne();
        if(about){
            about.tekst=tekst;
            await about.save();
        }else{
            about=new About({tekst});
            await about.save();
        }
        res.status(200).json(about);
    }catch (error){
        res.status(500).json({message:'fout bij het opslagen'})
    }
};