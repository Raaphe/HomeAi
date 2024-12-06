import HouseDTO from "../payloads/dto/houseInfo.dto";
import LabelEncoder from "../utils/LabelEncoder";
import * as ort from "onnxruntime-web" ;
import Inference from "../inference/inference";
import { logger } from "../utils/logger";
import ResponseObject from "../interfaces/response.interface";

export default class InferenceService {

    private static labelEncoder = new LabelEncoder();
    private static stateCodes = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];

    public static async GetHouseInference(houseInfo: HouseDTO) : Promise<ResponseObject<number>> {
        try {
            this.labelEncoder.fit(this.stateCodes);
            const inputData: number[] = [
                houseInfo.bedrooms,
                houseInfo.bathrooms,
                houseInfo.acres,
                this.labelEncoder.transform(houseInfo.state),
                houseInfo.zip_code,
                houseInfo.living_space_size
            ];

            const inputBatch = [inputData]; 

            const inputTensor = new ort.Tensor('float32', inputBatch.flat(), [1, 6]);

            const feeds = { "onnx::Gemm_0": inputTensor };
            const results: any = await Inference.GetInferenceSession().inferenceSession?.run(feeds);

            if (results === undefined) {
                throw new Error("Inference result is undefined.");
            }
            
            return { code: 200, message: "Successfully made inference.", data: results["22"]["cpuData"]["0"] };

        } catch (e) {
            logger.error(e);
            return  {code: 500, message: `Error making inference.\n${e}`, data: 0}  
        }
    }

}