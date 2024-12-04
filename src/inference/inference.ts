import { InferenceSession } from "onnxruntime-web";
import { config } from "../config/config";
import { logger } from "../utils/logger";

class Inference {

    public hasLoaded = false;
    public inferenceSession: any;

    private modelName: string = `./${config.MODEL_NAME}.onnx`
    private static instance: Inference;
     
    private constructor() {
        InferenceSession.create("./inference/median-model.onnx").then(is => {
            this.inferenceSession = is;
            this.hasLoaded = true;
            logger.info("Inference Model Loaded");
        }).catch(e => {
            this.hasLoaded = false;
            logger.error("Error loading inference model");
            logger.error(e);
        });
    }

    public static GetInferenceSession() {
        if (!Inference.instance) {
            Inference.instance = new Inference();
        }
        return Inference.instance;
    }
}