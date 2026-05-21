const razorpayInstance = require('../config/razorpay')
const Course = require('../models/course.model')
const crypto = require('crypto');
const Enrollment = require('../models/enrollment.model');

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

const verifyPayment = async (req,res)=>{
    try{
        const { courseId,
                razorpay_payment_id, 
                razorpay_order_id, 
                razorpay_signature 
              } = req.body;
    
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ success: false, message: "Payment verification failed!" });
        }


        const userId = req.user.id || req.user._id || req.user.userId;
        const existingEnrollment = await Enrollment.findOne({ student: userId, course: courseId });
        if (existingEnrollment) {
            return res.status(400).json({ success: false, message: "You are already enrolled!" });
        }

        const enrollment = await Enrollment.create({
        student: userId,
        course: courseId,
        completedLessons: [],
        isCompleted: false
    });

    res.status(200).json({ 
      success: true, 
      message: "Payment verified successfully!",
      enrollment 
    });
    
    }catch(error){
        console.error("Payment Verification Error:", error);
        res.status(500).json({ message: "Failed to verify payment" });
    }
}

module.exports = {createOrder, verifyPayment};