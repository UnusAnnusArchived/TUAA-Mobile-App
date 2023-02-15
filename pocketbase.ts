import PocketBase from "pocketbase";
import { pb } from "./endpoints";

const pocketbase = new PocketBase(pb);

pocketbase.autoCancellation(false);

export default pocketbase;
