const Attribute = require("../models/attributes");

const createAttributeService = async ({name,values}) => {
    try{
        const attribute = await Attribute.create({name,values});
        return attribute;
    }catch(error){
        console.log("Error in service layer while creating attribute",error);
        throw error;
    }
}

module.exports = {createAttributeService}