export const createError=(status, message)=>{
    return new Error({status,message});
};