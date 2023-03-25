const express = require("express")
const bodyparser = require("body-parser")
const Notes =  require("../modules/Note")

const { isAuthenticated } = require("../auth");
const route = express.Router()




route.get("/Getnotes",async(req,res)=>{
   try{
    let notes =  await Notes.find();
    res.status(200).json({
        status:"Sucess",
        notes
    })


   }catch(e){
    res.status(500).json({
        status:"Failed",
        message:e.message
    })
}
})
route.get("/Search/:search",async(req,res)=>{
   
    let SearchFeield = new RegExp("^"+ req.params.search);
    // let SearchFeield = req.params.title
    let Note = await Notes.find({title:{$regex:SearchFeield}})
    res.json({Note})

})


route.delete("/Notes/delete",async(req,res)=>{
    let notes = await Notes.deleteMany()
    res.json({message:"notes deleted"})
})



route.post("/ADDNOTES" ,async(req,res)=>{

try{
    let {title,description} = req.body;

    const notes = await Notes.create(req.body)
    res.status(200).json({
        notes,
        message:"Notes Added"
    })

}catch(e){
    res.status(500).json({
        status:"Failed",
        message:e.message
    })
}

})

module.exports = route