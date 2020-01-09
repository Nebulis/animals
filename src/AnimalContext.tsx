import { createContext } from "react";
import { Animal } from "./firebase";

export const AnimalContext = createContext<Animal[]>([]);
