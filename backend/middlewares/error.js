module.exports = (err,req,res,next) =>{
    err.statuscode =err.statuscode || 500;

    if(process.env.NODE_ENV=='development'){
        res.status(err.statuscode).json({
            success:false,
            message: err.message,
            stack: err.stack
        })

    }

    if(process.env.NODE_ENV=='production'){
        res.status(err.statuscode).json({
            success:false,
            message: err.message,
            
        })

    }
    else{
        
            res.status(err.statuscode).json({
                success:false,
                message: err.message,
                stack: err.stack
            })
    
        
    }

}