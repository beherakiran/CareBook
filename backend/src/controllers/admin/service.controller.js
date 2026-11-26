import ServiceModel from "../../models/service.model.js"


export const create = async(request,response)=>{
   ServiceModel(request.body)
   .save()
   .then((result)=>{
      const data ={
        _status:true,
        _message:"record created",
        _data:result,
      };
      return response.status(201).send(data);
   })
   .catch((err)=>{
     var errorMessage = {};
     for (var key in err.errors){
        errorMessage[key] = err.errors[key].message;
     }
      const data = {
        _status: false,
        _message: "Something went wrong",
        _error: errorMessage,
        _data: "",
      };
      return response.status(400).send(data);
   })
};