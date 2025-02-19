import Land from "../models/landDetails.js";
import Aadhaar from "../models/aadharModel.js";
import { sendSms, aadharverificationStore, generateVerificationCode } from "../utils/genrateMobOTP.js";
import { sendConfirmationEmail } from "../utils/sendMail.js";


export const getLandOTP = async (req, res) => {
    try {
        const { surveyNumber, subdivisionNumber } = req.body;
        console.log(surveyNumber, subdivisionNumber);

        const oldLand = await Land.findOne({ surveyNumber: surveyNumber, subDivisionNumber: subdivisionNumber });

        if (!oldLand) {
            return res.status(400).json({ message: 'Existing land not found!' });
        }
        const aadhar = await Aadhaar.findOne({ _id: oldLand.aadhaarNumber });
        const phoneNumber = aadhar.phoneNumber;
        const otp = generateVerificationCode();
        console.log(otp);
        //  sendSms(phoneNumber,otp,"Aadhar Verify");
        sendConfirmationEmail(otp);
        aadharverificationStore.set(surveyNumber, otp);
        res.status(201).json({ message: `OTP sent to your Mobile - ${phoneNumber}` });
    } catch (error) {
        console.error('Error getting OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const verifyLandOTP = async (req, res) => {
    try {
        const { surveyNumber, subdivisionNumber, otp } = req.body;
        console.log(surveyNumber);
        const storedCode = aadharverificationStore.get(surveyNumber);
        const oldLand = await Land.findOne({ surveyNumber: surveyNumber, subDivisionNumber: subdivisionNumber });
        const landdetails = {
            acre: oldLand.extentOfLand,
            soil: oldLand.soilType,
            address: oldLand.address
        };
        console.log(oldLand);
        console.log(surveyNumber, subdivisionNumber, storedCode, otp);
        if (storedCode && storedCode == otp) {
            aadharverificationStore.delete(surveyNumber);
            res.status(201).json({ landdetails, message: 'Account verified!' });
        } else {
            res.status(400).send('Invalid verification code');
        }

    } catch (error) {
        console.error('Error getting OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};