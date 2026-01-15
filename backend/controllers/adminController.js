import Service from "../models/serviceModel.js";

export const getPendingServices = async (req, res) => {
    try {
        const services = await Service.find({isApproved: false}).populate("providerId", "name email phone");

        res.status(200).json({
            success: true,
            count: services.length,
            services
        });
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};

export const approveService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if(!service){
            return res.status(404).json({message: "Service not found"});
        }

        service.isApproved = true;
        await service.save();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}