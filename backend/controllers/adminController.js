import Service from "../models/serviceModel.js";

//Get pending services
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

//Approve services 
export const approveService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if(!service){
            return res.status(404).json({message: "Service not found"});
        }

        //Already approved -> Conflict (409)
        if(service.isApproved === true) {
            return res.status(409).json({message: "Service is already approved"});
        }
        service.isApproved = true;
        await service.save();
        res.status(200).json({message: "Service approved successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

//Get all approved services

export const getApprovedServices = async (req, res) => {
    try {
        const services = await Service.find({isApproved: true}).populate("providerId", "name email phone");

        if(!services){
            return res.status(200).json({
                data: [],
                message: "No services found"
            })
        }

        res.status(200).json({
            success: true,
            count: services.length,
            services
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}