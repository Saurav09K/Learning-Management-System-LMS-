const razorpayInstance = require('../config/razorpay')
const Course = require('../models/course.model')

const createOrder = async (req,res)=>{
    try{
        const {courseId} = req.body;
        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                message : "Course Not Found"
            })
        }

        const amountInPaisa = course.price * 100;

        
        var options = {
            amount: amountInPaisa, 
            currency: "INR",
            receipt:  `receipt_course${courseId}`
        };
        const order = await razorpayInstance.orders.create(options);
            
        res.status(200).json({ success: true, order });     

    }catch(error){
        console.error("Order Creation Error:", error);
        res.status(500).json({ message: "Failed to create payment order" });
    }
}

module.exports = {createOrder};