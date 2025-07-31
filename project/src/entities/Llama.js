import { createEntityClient } from "../utils/entityWrapper";
import schema from "./Llama.json";
export const Llama = createEntityClient("Llama", schema);
