const attributeService = require("../services/attribute.service");

const createAttribute = async (req,res) => {
    try{
        const {name,values} = req.body;
        const attribute = await attributeService.createAttributeService({name,values});
        res.status(201).json(attribute);
    }catch(error){
        console.log("Error in controller layer while creating attribute",error);
        res.status(500).json({error: "Internal Server Error"});
    }
}   

module.exports = {createAttribute};