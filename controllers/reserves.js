const Reserve = require('../models/Reserve');
const Restaurant = require('../models/Restaurant');

exports.getReserves=async (req,res,next) => {
    let query;

    if(req.user.role !== 'admin'){
        query=Reserve.find({user:req.user.id}).populate({
            path:'restaurant',
            select:'name province tel'
        });
    }else{
        if(req.params.reserveId){
            console.log(req.params.reserveId);
            query=Reserve.find({restaurant: req.params.reserveId}).populate({
                path:'restaurant',
                select:'name province tel'
            });
        }else
            query=Reserve.find().populate({
                path:'restaurant',
                select:'name province tel'
            });
        
    }

    try {
        const reserves=await query; 

        res.status(200).json({
            success:true,
            count:reserves.length,
            data:reserves
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Cannot find Reserve"});
    }
};

exports.getReserve=async (req,res,next) => {
    try{
        const reserve = await Reserve.findById(req.params.id).populate({
            path: 'restaurant',
            select: 'name description tel'
        });

        if(!reserve){
            return res.status(404).json({success:false,message:`No reserve with the id of ${req.params.id}`});
        }

        res.status(200).json({
            success:true,
            data: reserve
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Reserve"});
    }
}

exports.addReserve=async(req,res,next) => {
    try{
        req.body.restaurant=req.params.reserveId;

        const restaurant= await Restaurant.findById(req.params.reserveId);

        if(!restaurant){
            return res.status(404).json({success:false,message:`No restaurant with the id of ${req.params.reserveId}`});
        }
        req.body.user=req.user.id;
        const existedReserve=await Reserve.find({user:req.user.id});

        if(existedReserve.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 reserves`});
        }
        const reserve = await Reserve.create(req.body);
        res.status(200).json({success:true,data:reserve});

    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot create Reserve"});
    }
}

exports.updateReserve=async (req,res,next)=>{
    try{
        let reserve= await Reserve.findById(req.params.id);

        if(!reserve){
            return res.status(404).json({success:false,message:`No reserve with the id of ${req.params.id}`});
        }
        if(reserve.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this reserve`})
        }
        reserve = await Reserve.findByIdAndUpdate(req.params.id,req.body,{
            new : true,
            runValidators : true
        });

        res.status(200).json({
            success:true,
            data:reserve
        });
        
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot update Reserve"});
    }
}

exports.deleteReserve=async (req,res,next)=>{
    try{
        const reserve= await Reserve.findById(req.params.id);
        if(!reserve){
            return res.status(404).json({success:false,message:`No reserve with the id of ${req.params.id}`});
        }

        if(reserve.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this bootcamp`})
        }

        await reserve.deleteOne();

        res.status(200).json({
            success:true,
            data: {}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot delete Reserve"});
    }
}